import { useState } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function AIContentStudio() {
    const [prompt, setPrompt] = useState('');
    const [type, setType] = useState('blog');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            // Reusing existing blog AI optimization logic as a base
            const res = await api.post<{ suggestion: string }>('/v1/admin/seo/optimize', {
                path: `studio-${type}`,
                context: prompt
            });
            setResult(res.suggestion);
        } catch (error) {
            Swal.fire('Error', 'AI failed to generate content.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-wand-magic-sparkles text-indigo-600"></i>
                    AI Content Studio
                </h1>
                <p className="text-slate-500 text-sm">Create high-ranking SEO content and AI-friendly snippets in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'blog', label: 'Blog Post', icon: 'fa-blog' },
                                    { id: 'faq', label: 'FAQ Set', icon: 'fa-question' },
                                    { id: 'meta', label: 'Meta Data', icon: 'fa-search' },
                                    { id: 'social', label: 'Social Post', icon: 'fa-share-nodes' }
                                ].map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${type === t.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                                    >
                                        <i className={`fa-solid ${t.icon}`}></i>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Topic or Keywords</label>
                            <textarea 
                                rows={6}
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                                placeholder="e.g. Write an SEO optimized blog post about 'How to write a resume for 2024 using AI tools'."
                            />
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
                            Generate SEO Content
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="lg:col-span-3">
                    <div className="bg-slate-900 rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden h-[600px] flex flex-col">
                        <header className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Output Studio</span>
                            </div>
                            {result && (
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(result); Swal.fire({ title: 'Copied!', toast: true, position: 'top-right', showConfirmButton: false, timer: 1500, icon: 'success' }); }}
                                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-600 transition-colors"
                                >
                                    Copy Content
                                </button>
                            )}
                        </header>
                        <div className="flex-1 p-8 overflow-y-auto text-slate-300 font-mono text-sm leading-relaxed">
                            {isGenerating ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                                </div>
                            ) : result ? (
                                <div className="whitespace-pre-wrap">{result}</div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 text-center">
                                    <i className="fa-solid fa-ghost text-4xl"></i>
                                    <p className="text-xs">No content generated yet.<br/>Fill in the details and click generate.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
