import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';

export default function AIDiscoveryCenter() {
    const [stats, setStats] = useState<any>({
        readiness_score: 0,
        schema_coverage: 0,
        faq_coverage: 0,
        entity_coverage: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.get<any>('/v1/admin/visibility/summary');
            if (data?.latest_audit) {
                setStats({
                    readiness_score: data.latest_audit.ai_score || 0,
                    schema_coverage: 0, // In a real system, these would be in the audit summary
                    faq_coverage: 0,
                    entity_coverage: 0
                });
                setHasData(true);
            }
        } catch (error) {
            console.error('Failed to fetch AI discovery data');
        } finally {
            setIsLoading(false);
        }
    };

    const recommendations = [
        { title: 'Missing Organization Schema', impact: 'High', description: 'Add complete business details to help AI link your brand to your website.', action: '/admin/visibility/settings' },
        { title: 'Low FAQ Coverage', impact: 'Medium', description: 'AI systems prefer question-answer formats. Add FAQs to core pages.', action: '/admin/seo' },
        { title: 'Entity Clarity', impact: 'Medium', description: 'Ensure your description mentions key industry entities like "Resume Builder", "ATS", and "AI Career Tool".', action: '/admin/visibility/settings' }
    ];

    if (isLoading) return <div className="py-20 text-center text-slate-400">Analyzing AI Readiness...</div>;

    return (
        <div className="space-y-8 animate-fade-in relative">
            {!hasData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] rounded-[40px] -m-4">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <i className="fa-solid fa-robot"></i>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">AI Discovery Analysis Required</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We haven't scanned your site for AI readiness yet. Run a site audit to identify missing signals that help ChatGPT, Gemini, and Claude discover your brand.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link 
                                to="/admin/visibility/audit"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                            >
                                <i className="fa-solid fa-bolt"></i>
                                Run First Site Audit
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className={`${!hasData ? 'opacity-30 grayscale pointer-events-none blur-[1px]' : ''} space-y-8`}>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <i className="fa-solid fa-robot text-indigo-600"></i>
                        AI Discovery Center
                    </h1>
                    <p className="text-slate-500 text-sm">Optimize your website for ChatGPT, Gemini, Claude, and AI-powered search engines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'AI Readiness', value: stats.readiness_score, icon: 'fa-brain', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Schema Coverage', value: stats.schema_coverage, icon: 'fa-code', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'FAQ Coverage', value: stats.faq_coverage, icon: 'fa-question', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Entity Score', value: stats.entity_coverage, icon: 'fa-diagram-project', color: 'text-rose-600', bg: 'bg-rose-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900">{stat.value}%</h3>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${stat.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${stat.value}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-slate-900">AI Optimization Roadmap</h3>
                            <p className="text-xs text-slate-500">Actionable steps to improve visibility in Generative Engine Results (GEO).</p>
                        </div>
                        <div className="p-8 space-y-6">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${rec.impact === 'High' ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-amber-200 text-amber-600 bg-amber-50'}`}>
                                            {rec.impact.charAt(0)}
                                        </div>
                                        <div className="w-0.5 flex-1 bg-slate-100 group-last:hidden"></div>
                                    </div>
                                    <div className="pb-8 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-slate-800">{rec.title}</h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${rec.impact === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {rec.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{rec.description}</p>
                                        <Link to={rec.action} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                                            Take Action <i className="fa-solid fa-arrow-right-long text-[8px]"></i>
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-900/20 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="relative space-y-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <h3 className="text-xl font-bold leading-tight">AI Content Analyzer</h3>
                            <p className="text-sm text-indigo-100 leading-relaxed">Let our LLM analyze your current content structure for AI readability, entity clarity, and intent alignment.</p>
                            <Link 
                                to="/admin/visibility/optimizer"
                                className="mt-4 w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-black/20 flex items-center justify-center"
                            >
                                Run Content Scan
                            </Link>

                        </div>
                        <div className="mt-auto pt-8 border-t border-white/10 text-[10px] text-indigo-300">
                            <p>Powered by SEO-GPT Enterprise & Gemini Pro Vision</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
