import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function SchemaManager() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [discoverablePages, setDiscoverablePages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<any>(null);

    useEffect(() => {
        fetchConfigs();
        fetchDiscoverablePages();
    }, []);

    const fetchConfigs = async () => {
        try {
            const data = await api.get<any[]>('/v1/admin/seo/');
            setConfigs(data.filter((c: any) => c.custom_schema || c.faqs));
        } catch (error) {
            console.error('Failed to fetch configs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDiscoverablePages = async () => {
        try {
            const data = await api.get<any[]>('/v1/admin/seo/discover-pages');
            setDiscoverablePages(data);
        } catch (error) {
            console.error('Failed to discover pages');
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
            Swal.fire('Success', 'Schema updated.', 'success');
            setIsEditorOpen(false);
            fetchConfigs();
        } catch (error: any) {
            Swal.fire('Error', 'Failed to save schema', 'error');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <i className="fa-solid fa-code text-indigo-600"></i>
                        Schema Manager
                    </h1>
                    <p className="text-slate-500 text-sm">Manage JSON-LD structured data for Google Rich Results and AI discovery.</p>
                </div>
                <button 
                    onClick={() => { setEditingConfig({ path: '', custom_schema: {}, is_indexed: true, is_followed: true, sitemap_priority: '0.5', sitemap_changefreq: 'monthly', include_in_sitemap: true }); setIsEditorOpen(true); }}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    New Schema
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Path</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Schema Types</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400">Loading...</td></tr>
                        ) : configs.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400">No custom schemas found.</td></tr>
                        ) : configs.map((config) => (
                            <tr key={config.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-indigo-600">{config.path}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {config.faqs && config.faqs.length > 0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">FAQ</span>}
                                        {config.custom_schema && Object.keys(config.custom_schema).length > 0 && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">Custom</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => { setEditingConfig(config); setIsEditorOpen(true); }}
                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
                        <header className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl">Edit Structured Data</h3>
                            <button onClick={() => setIsEditorOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </header>
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
                            {!editingConfig.id && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Target Page</label>
                                    <select 
                                        value={editingConfig.path}
                                        onChange={(e) => setEditingConfig({ ...editingConfig, path: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                        required
                                    >
                                        <option value="">-- Choose a Page --</option>
                                        {discoverablePages.map(page => (
                                            <option key={page.path} value={page.path}>{page.label} ({page.path})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom JSON-LD Schema</label>
                                <textarea 
                                    rows={15}
                                    value={JSON.stringify(editingConfig.custom_schema || {}, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const val = JSON.parse(e.target.value);
                                            setEditingConfig({ ...editingConfig, custom_schema: val });
                                        } catch (err) {}
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs bg-slate-900 text-emerald-400 focus:ring-0"
                                />
                                <p className="text-[10px] text-slate-400 italic">Ensure valid JSON format. Follow schema.org guidelines.</p>
                            </div>
                        </form>
                        <footer className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsEditorOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600">Cancel</button>
                            <button type="button" onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20">Save Schema</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
