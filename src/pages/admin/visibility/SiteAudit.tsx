import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function SiteAudit() {
    const [audits, setAudits] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAudits();
    }, []);

    const fetchAudits = async () => {
        try {
            const data = await api.get('/v1/admin/visibility/audits');
            setAudits(data);
        } catch (error) {
            console.error('Failed to fetch audits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunAudit = async () => {
        setIsRunning(true);
        try {
            Swal.fire({ title: 'Running Site Audit...', text: 'Crawling pages and checking AI signals', didOpen: () => Swal.showLoading() });
            await api.post('/v1/admin/visibility/audits/run');
            await fetchAudits();
            Swal.fire('Complete', 'Audit finished successfully.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Audit failed', 'error');
        } finally {
            setIsRunning(false);
        }
    };

    const latest = audits[0];
    const auditDate = latest ? new Date(latest.timestamp).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    }) : '';

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <i className="fa-solid fa-clipboard-check text-indigo-600"></i>
                        Site Health Audit
                    </h1>
                    <p className="text-slate-500 text-sm">Deep scan of your website for SEO, Performance, Accessibility, and AI Discoverability.</p>
                </div>
                <div className="flex gap-3">
                    {latest && (
                        <div className="hidden md:flex flex-col items-end justify-center px-4 border-r border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Scan</span>
                            <span className="text-xs font-bold text-slate-600">{auditDate}</span>
                        </div>
                    )}
                    <button 
                        onClick={handleRunAudit}
                        disabled={isRunning}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                    >
                        {isRunning ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                        Start Full Audit
                    </button>
                </div>
            </div>

            {latest ? (
                <div className="space-y-8">
                    {/* Overall Score */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-12">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-50" />
                                <circle 
                                    cx="96" cy="96" r="85" 
                                    stroke="currentColor" strokeWidth="14" fill="transparent" 
                                    strokeDasharray={534} 
                                    strokeDashoffset={534 - (534 * (latest.overall_score || 0)) / 100} 
                                    className="text-indigo-600 transition-all duration-1000 ease-out" 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900">{latest.overall_score || 0}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Global Health</span>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                            {[
                                { label: 'SEO', value: latest.seo_score || 0 },
                                { label: 'AI Ready', value: latest.ai_score || 0 },
                                { label: 'Performance', value: latest.perf_score || 0 },
                                { label: 'Access', value: latest.accessibility_score || 0 },
                            ].map(score => {
                                const scoreColor = score.value >= 80 ? 'emerald' : score.value >= 50 ? 'amber' : 'rose';
                                return (
                                    <div key={score.label} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{score.label}</p>
                                            <span className={`text-sm font-black ${scoreColor === 'emerald' ? 'text-emerald-600' : scoreColor === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>{score.value}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${scoreColor === 'emerald' ? 'bg-emerald-500' : scoreColor === 'amber' ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-1000`} style={{ width: `${score.value}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detailed Issues */}
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900">Detected Issues ({latest.issues?.length || 0})</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold">Critical: {latest.issues?.filter((i: any) => i.severity === 'high').length}</span>
                                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-bold">Warning: {latest.issues?.filter((i: any) => i.severity === 'medium').length}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {latest.issues?.map((issue: any, idx: number) => (
                                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${issue.severity === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                            <i className={`fa-solid ${issue.module === 'seo' ? 'fa-search' : 'fa-robot'}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{issue.issue}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{issue.module} module</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (issue.module === 'seo') navigate('/admin/seo');
                                            else if (issue.module === 'ai') navigate('/admin/visibility/schema');
                                            else if (issue.module === 'perf') navigate('/admin/visibility/settings');
                                            else navigate('/admin/visibility/dashboard');
                                        }}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        Fix Issue
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-20 text-center text-slate-400 space-y-4">
                    <i className="fa-solid fa-clipboard-check text-4xl opacity-20"></i>
                    <p className="text-sm italic">No audits found. Run your first site audit to see performance insights.</p>
                </div>
            )}
        </div>
    );
}
