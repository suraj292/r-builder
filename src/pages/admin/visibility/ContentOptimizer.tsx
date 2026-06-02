import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function ContentOptimizer() {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const data = await api.get('/v1/admin/seo/discover-pages');
            setPages(data);
        } catch (error) {
            console.error('Failed to fetch pages');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedPage) return;
        setIsAnalyzing(true);
        try {
            const res = await api.post<{ suggestion: string }>('/v1/admin/seo/optimize', {
                path: selectedPage.path,
                context: "Perform a full SEO and Readability audit. Return a structured report."
            });
            setReport(res.suggestion);
        } catch (error) {
            Swal.fire('Error', 'Analysis failed.', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-gauge-high text-indigo-600"></i>
                    Content Optimizer
                </h1>
                <p className="text-slate-500 text-sm">Analyze and optimize every page for SEO, readability, and AI discoverability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Select Page</h3>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {pages.map(page => (
                                <button 
                                    key={page.path}
                                    onClick={() => setSelectedPage(page)}
                                    className={`w-full p-3 rounded-xl text-left transition-all flex flex-col gap-1 border ${selectedPage?.path === page.path ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                                >
                                    <span className="text-xs font-bold truncate">{page.label}</span>
                                    <code className={`text-[10px] font-mono ${selectedPage?.path === page.path ? 'text-indigo-200' : 'text-slate-400'}`}>{page.path}</code>
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleAnalyze}
                            disabled={!selectedPage || isAnalyzing}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-magnifying-glass-chart"></i>}
                            Run Deep Analysis
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {isAnalyzing ? (
                        <div className="bg-white rounded-[32px] border border-slate-200 p-20 text-center space-y-6">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl animate-bounce mx-auto">
                                <i className="fa-solid fa-microchip"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-900">AI is auditing your content...</h3>
                                <p className="text-xs text-slate-500">Scanning headings, keyword density, and entity clarity.</p>
                            </div>
                        </div>
                    ) : report ? (
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                            <header className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-900">Analysis Report: {selectedPage?.label}</h3>
                                    <p className="text-xs text-slate-500">{selectedPage?.path}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">SEO: 85/100</span>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">AI: 72/100</span>
                                </div>
                            </header>
                            <div className="p-8 prose prose-slate prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-sans">{report}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] border border-slate-200 border-dashed p-20 text-center text-slate-400 space-y-4">
                            <i className="fa-solid fa-chart-line text-4xl opacity-20"></i>
                            <p className="text-sm italic">Select a page from the left and run analysis to see insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
