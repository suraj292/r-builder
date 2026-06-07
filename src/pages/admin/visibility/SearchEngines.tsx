import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function SearchEngines() {
    const [robots, setRobots] = useState('User-agent: *\nAllow: /');
    const [sitemapInfo, setSitemapInfo] = useState<any>(null);

    useEffect(() => {
        fetchRobots();
    }, []);

    const fetchRobots = async () => {
        try {
            const data = await api.get<{ content: string }>('/v1/admin/visibility/robots.txt');
            setRobots(data.content);
        } catch (error) {
            console.error('Failed to fetch robots.txt');
        }
    };

    const handleSaveRobots = async () => {
        try {
            await api.put('/v1/admin/visibility/robots.txt', { content: robots });
            Swal.fire('Success', 'Robots.txt updated.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update', 'error');
        }
    };

    const handleGenerateSitemap = async () => {
        try {
            Swal.fire({ title: 'Generating...', didOpen: () => Swal.showLoading() });
            await api.get('/v1/seo/sitemap.xml'); // Trigger generation
            setSitemapInfo({ last_generated: new Date().toISOString(), url: '/api/v1/seo/sitemap.xml' });
            Swal.fire('Success', 'Sitemap.xml is live.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Generation failed', 'error');
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-tower-broadcast text-indigo-600"></i>
                    Search Engines
                </h1>
                <p className="text-slate-500 text-sm">Control crawling and indexing rules for Google and AI bots.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Robots.txt Editor */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-8 flex-1 space-y-4">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Robots.txt Editor</h3>
                        <textarea 
                            value={robots}
                            onChange={(e) => setRobots(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <p className="text-[10px] text-slate-400 italic">Be careful. Disallowing '/' will de-index your entire site.</p>
                    </div>
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={handleSaveRobots}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20"
                        >
                            Save Rules
                        </button>
                    </div>
                </div>

                {/* Sitemap Management */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-8 flex-1 space-y-6">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Sitemap Management</h3>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                    <i className="fa-solid fa-sitemap"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-900">Sitemap is Active</p>
                                    <p className="text-[10px] text-emerald-600">Last updated: {sitemapInfo?.last_generated || 'Never'}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sitemap URL</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={`${window.location.origin}/sitemap.xml`} 
                                        className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-mono border-none"
                                    />
                                    <button className="px-3 py-2 bg-slate-200 rounded-lg text-slate-600 hover:bg-slate-300 transition-colors">
                                        <i className="fa-solid fa-copy text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                onClick={handleGenerateSitemap}
                                className="w-full py-3 bg-white border border-indigo-600 text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-50 transition-colors"
                            >
                                Regenerate XML Sitemap
                            </button>
                            <p className="text-[10px] text-slate-400 text-center">Automatically includes all pages marked "Include in Sitemap".</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
