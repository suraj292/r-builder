import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';
import type { SEOConfig } from '../../types/seo';

interface DiscoverablePage {
    path: string;
    label: string;
    type: string;
}

export default function AdminSEO() {
    const [configs, setConfigs] = useState<SEOConfig[]>([]);
    const [discoverablePages, setDiscoverablePages] = useState<DiscoverablePage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAILoading, setIsAILoading] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingConfig, setEditingPost] = useState<Partial<SEOConfig> | null>(null);

    useEffect(() => {
        fetchConfigs();
        fetchDiscoverablePages();
    }, []);

    const fetchConfigs = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<SEOConfig[]>('/v1/admin/seo/');
            setConfigs(data);
        } catch (error) {
            console.error('Failed to fetch SEO configs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDiscoverablePages = async () => {
        try {
            const data = await api.get<DiscoverablePage[]>('/v1/admin/seo/discover-pages');
            setDiscoverablePages(data);
        } catch (error) {
            console.error('Failed to discover pages');
        }
    };

    const handleAIOptimize = async () => {
        if (!editingConfig?.path) return Swal.fire('Wait', 'Select a page path first.', 'info');
        
        setIsAILoading(true);
        try {
            const res = await api.post<{ suggestion: string }>('/v1/admin/seo/optimize', { 
                path: editingConfig.path,
                context: editingConfig.title || ""
            });
            
            let raw = res.suggestion;
            if (raw.includes('```json')) {
                raw = raw.split('```json')[1].split('```')[0].trim();
            } else if (raw.includes('```')) {
                raw = raw.split('```')[1].split('```')[0].trim();
            }
            
            try {
                const data = JSON.parse(raw);
                setEditingPost({
                    ...editingConfig,
                    title: data.title || editingConfig.title,
                    description: data.description || editingConfig.description,
                    keywords: data.keywords || editingConfig.keywords,
                    og_title: data.og_title || data.title || editingConfig.og_title,
                    og_description: data.og_description || data.description || editingConfig.og_description,
                });
                Swal.fire('SEO-GPT Optimized', 'Metadata generated successfully. Review and save.', 'success');
            } catch (e) {
                Swal.fire({
                    title: 'AI Insights',
                    text: res.suggestion,
                    icon: 'info',
                    width: '600px'
                });
            }
        } catch (error) {
            Swal.fire('Error', 'AI optimization failed.', 'error');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingConfig?.path) return;

        try {
            if (editingConfig.id) {
                await api.put(`/v1/admin/seo/${editingConfig.id}`, editingConfig);
            } else {
                await api.post('/v1/admin/seo/', editingConfig);
            }
            Swal.fire('Success', 'SEO configuration saved.', 'success');
            setIsEditorOpen(false);
            fetchConfigs();
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save SEO config', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const res = await Swal.fire({
            title: 'Are you sure?',
            text: "This will remove custom SEO for this path.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete'
        });

        if (res.isConfirmed) {
            try {
                await api.delete(`/v1/admin/seo/${id}`);
                fetchConfigs();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <i className="fa-solid fa-search-dollar text-indigo-600"></i>
                        SEO Management
                    </h1>
                    <p className="text-slate-500 text-sm">Target Google and AI Search Engines with precision metadata.</p>
                </div>
                <button 
                    onClick={() => { setEditingPost({ path: '/', is_indexed: true, is_followed: true, sitemap_priority: '0.5', sitemap_changefreq: 'monthly', twitter_card: 'summary_large_image', include_in_sitemap: true }); setIsEditorOpen(true); }}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    New SEO Target
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="py-20 text-center text-slate-400">Loading configurations...</div>
                ) : configs.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">No custom SEO configurations found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Path</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Index</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {configs.map((config) => (
                                <tr key={config.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <code className="text-xs bg-indigo-50 px-2 py-0.5 rounded font-mono text-indigo-600 w-fit">{config.path}</code>
                                            <span className="text-[10px] text-slate-400">
                                                {discoverablePages.find(p => p.path === config.path)?.label || 'Custom Path'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-700 truncate max-w-xs">{config.title || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {config.is_indexed ? (
                                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-tight">Index</span>
                                        ) : (
                                            <span className="text-rose-500 text-xs font-bold uppercase tracking-tight">No-Index</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => { setEditingPost(config); setIsEditorOpen(true); }}
                                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-pen text-xs"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(config.id!)}
                                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* SEO Editor Sidebar */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900">Page SEO Configuration</h3>
                                <p className="text-xs text-slate-500">Customize how search engines and AI see this path.</p>
                            </div>
                            <button onClick={() => setIsEditorOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-200 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Path Setting */}
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2 flex justify-between items-center">
                                    Target Selection
                                    <button 
                                        type="button"
                                        onClick={handleAIOptimize}
                                        disabled={isAILoading || !editingConfig?.path}
                                        className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-amber-200 transition-colors"
                                    >
                                        {isAILoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                                        AI Optimize Full Page
                                    </button>
                                </h4>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Select Page Path</label>
                                    <select 
                                        value={editingConfig?.path}
                                        onChange={(e) => setEditingPost({ ...editingConfig!, path: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                        required
                                    >
                                        <option value="">-- Choose a Page --</option>
                                        {discoverablePages.map(page => (
                                            <option key={page.path} value={page.path}>{page.label} ({page.path})</option>
                                        ))}
                                        <option value="custom">-- Custom Path --</option>
                                    </select>
                                    
                                    {editingConfig?.path === 'custom' && (
                                        <input 
                                            type="text"
                                            placeholder="/enter/custom/path"
                                            onChange={(e) => setEditingPost({ ...editingConfig!, path: e.target.value })}
                                            className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Meta Section */}
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Google & Search Metadata</h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Title</label>
                                        <input 
                                            type="text" 
                                            value={editingConfig?.title || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, title: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        />
                                        <div className="flex justify-between px-1">
                                            <span className="text-[9px] text-slate-400">Recommended: 50-60 characters</span>
                                            <span className={`text-[9px] font-bold ${editingConfig?.title?.length || 0 > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {editingConfig?.title?.length || 0} chars
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Meta Description</label>
                                        <textarea 
                                            rows={3}
                                            value={editingConfig?.description || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, description: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 resize-none text-sm"
                                        />
                                        <div className="flex justify-between px-1">
                                            <span className="text-[9px] text-slate-400">Recommended: 150-160 characters</span>
                                            <span className={`text-[9px] font-bold ${editingConfig?.description?.length || 0 > 160 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {editingConfig?.description?.length || 0} chars
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Focus Keywords</label>
                                        <input 
                                            type="text" 
                                            value={editingConfig?.keywords || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, keywords: e.target.value })}
                                            placeholder="keyword1, keyword2, keyword3"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Dynamic OG Section */}
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Social & AI Cards (Open Graph)</h4>
                                <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">OG Title</label>
                                        <input 
                                            type="text" 
                                            value={editingConfig?.og_title || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, og_title: e.target.value })}
                                            placeholder="Defaults to SEO Title"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">OG Description</label>
                                        <textarea 
                                            rows={2}
                                            value={editingConfig?.og_description || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, og_description: e.target.value })}
                                            placeholder="Defaults to Meta Description"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 resize-none text-sm bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Social Share Image URL</label>
                                        <input 
                                            type="text" 
                                            value={editingConfig?.og_image || ''}
                                            onChange={(e) => setEditingPost({ ...editingConfig!, og_image: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Controls */}
                            <section className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Indexing</h4>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${editingConfig?.is_indexed ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                <input type="checkbox" className="hidden" checked={editingConfig?.is_indexed} onChange={(e) => setEditingPost({...editingConfig!, is_indexed: e.target.checked})} />
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${editingConfig?.is_indexed ? 'left-6' : 'left-1'}`} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">Index this page</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${editingConfig?.is_followed ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                <input type="checkbox" className="hidden" checked={editingConfig?.is_followed} onChange={(e) => setEditingPost({...editingConfig!, is_followed: e.target.checked})} />
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${editingConfig?.is_followed ? 'left-6' : 'left-1'}`} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">Follow links</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Sitemap</h4>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${editingConfig?.include_in_sitemap ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                <input type="checkbox" className="hidden" checked={editingConfig?.include_in_sitemap} onChange={(e) => setEditingPost({...editingConfig!, include_in_sitemap: e.target.checked})} />
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${editingConfig?.include_in_sitemap ? 'left-6' : 'left-1'}`} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">Show in Sitemap</span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Schema / FAQ */}
                            <section className="space-y-4 pb-20">
                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Structured Data (FAQ)</h4>
                                <p className="text-[10px] text-slate-400 italic">Auto-generates FAQ Schema for this page.</p>
                                <div className="space-y-3">
                                    {editingConfig?.faqs?.map((faq, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group/faq">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const newFaqs = [...(editingConfig.faqs || [])];
                                                    newFaqs.splice(idx, 1);
                                                    setEditingPost({...editingConfig, faqs: newFaqs});
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity"
                                            >
                                                <i className="fa-solid fa-xmark text-[10px]"></i>
                                            </button>
                                            <input 
                                                placeholder="Question" 
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const newFaqs = [...(editingConfig.faqs || [])];
                                                    newFaqs[idx].question = e.target.value;
                                                    setEditingPost({...editingConfig, faqs: newFaqs});
                                                }}
                                                className="w-full bg-transparent border-none text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0 mb-1"
                                            />
                                            <textarea 
                                                placeholder="Answer..." 
                                                value={faq.answer}
                                                rows={2}
                                                onChange={(e) => {
                                                    const newFaqs = [...(editingConfig.faqs || [])];
                                                    newFaqs[idx].answer = e.target.value;
                                                    setEditingPost({...editingConfig, faqs: newFaqs});
                                                }}
                                                className="w-full bg-transparent border-none text-xs text-slate-500 placeholder:text-slate-300 focus:ring-0 resize-none"
                                            />
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => setEditingPost({...editingConfig!, faqs: [...(editingConfig?.faqs || []), { question: '', answer: '' }]})}
                                        className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-xs font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        + Add FAQ Entry
                                    </button>
                                </div>
                            </section>
                        </form>

                        <footer className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsEditorOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                            >
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                Save Config
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
