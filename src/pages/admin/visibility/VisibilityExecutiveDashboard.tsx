import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';

export default function VisibilityExecutiveDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const data = await api.get('/v1/admin/visibility/summary');
            setSummary(data);
        } catch (error) {
            console.error('Failed to fetch executive summary');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400">Loading master dashboard...</div>;

    const scores = [
        { label: 'Overall Visibility', value: summary?.scores?.overall || 0, icon: 'fa-eye', color: 'indigo' },
        { label: 'SEO Health', value: summary?.scores?.seo || 0, icon: 'fa-search', color: 'emerald' },
        { label: 'AI Readiness', value: summary?.scores?.ai || 0, icon: 'fa-robot', color: 'amber' },
        { label: 'Performance', value: summary?.scores?.perf || 0, icon: 'fa-bolt', color: 'rose' },
    ];

    const modules = [
        { path: '/admin/visibility/settings', label: 'Visibility Settings', icon: 'fa-gears', status: summary?.visibility_config?.business_info?.business_name ? 'Configured' : 'Missing' },
        { path: '/admin/seo', label: 'SEO Center', icon: 'fa-search-dollar', status: summary?.seo_count > 0 ? 'Active' : 'Empty' },
        { path: '/admin/visibility/schema', label: 'Schema Manager', icon: 'fa-code', status: 'Managed' },
        { path: '/admin/visibility/google', label: 'Google Console', icon: 'fa-brands fa-google', status: summary?.visibility_config?.google_settings?.ga4_measurement_id ? 'Connected' : 'Setup Required' },
        { path: '/admin/visibility/social', label: 'Social Media', icon: 'fa-share-nodes', status: Object.keys(summary?.visibility_config?.social_links || {}).length > 0 ? 'Linked' : 'Missing' },
        { path: '/admin/visibility/ai', label: 'AI Discovery', icon: 'fa-brain', status: summary?.scores?.ai > 0 ? 'Monitoring' : 'Not Scanned' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                    <i className="fa-solid fa-chess-king text-indigo-600"></i>
                    Executive Visibility Dashboard
                </h1>
                <p className="text-slate-500 mt-1">Master control center for site growth, search engine authority, and AI discovery.</p>
            </div>

            {/* Top Scores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {scores.map((score, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-default">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${score.color}-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50`}></div>
                        <div className={`w-12 h-12 rounded-2xl bg-${score.color}-50 text-${score.color}-600 flex items-center justify-center text-xl`}>
                            <i className={`fa-solid ${score.icon}`}></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{score.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 mt-1">{score.value}<span className="text-lg text-slate-300 font-bold">%</span></h3>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-${score.color}-500 transition-all duration-1000`} style={{ width: `${score.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Module Quick Access */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Core Management Modules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((mod, idx) => (
                            <Link 
                                key={idx} 
                                to={mod.path}
                                className="bg-white p-6 rounded-[32px] border border-slate-200 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/5 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center text-lg">
                                        <i className={`fa-solid ${mod.icon}`}></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{mod.label}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${mod.status.includes('Missing') || mod.status.includes('Setup') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {mod.status}
                                        </p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-indigo-600 transition-colors mr-2"></i>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Critical Issues & Actions */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Critical Actions</h3>
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 shadow-2xl shadow-slate-900/20">
                        <div className="space-y-4">
                            {(summary?.alerts && summary.alerts.length > 0) ? summary.alerts.slice(0, 4).map((issue: any, idx: number) => (
                                <div key={idx} className="flex gap-4 group cursor-pointer" onClick={() => {
                                    if (issue.module === 'settings') window.location.href = '/admin/visibility/settings';
                                    if (issue.module === 'google') window.location.href = '/admin/visibility/google';
                                    if (issue.module === 'audit') window.location.href = '/admin/visibility/audit';
                                    if (issue.module === 'seo') window.location.href = '/admin/seo';
                                }}>
                                    <div className={`w-10 h-10 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center ${issue.severity === 'high' ? 'text-rose-400 group-hover:bg-rose-500' : 'text-amber-400 group-hover:bg-amber-500'} group-hover:text-white transition-all`}>
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <div className="border-b border-white/5 pb-4 flex-1">
                                        <p className="text-xs font-bold leading-tight">{issue.issue}</p>
                                        <p className="text-[10px] text-white/40 uppercase mt-1 tracking-widest">{issue.module}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center space-y-3">
                                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <p className="text-xs text-white/60 font-bold">No Critical Issues Found</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <Link to="/admin/visibility/audit" className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                                Run Full Audit
                            </Link>
                            <button className="w-full py-4 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-xs text-white/60 hover:bg-white/10 transition-all">
                                Export PDF Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
