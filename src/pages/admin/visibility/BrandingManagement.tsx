import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function BrandingManagement() {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const data = await api.get('/v1/admin/visibility/config');
            setConfig(data);
        } catch (error) {
            console.error('Failed to fetch config');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/v1/admin/visibility/config', config);
            Swal.fire('Success', 'Branding settings updated.', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400 italic">Loading branding...</div>;

    const updateBranding = (field: string, value: any) => {
        setConfig({
            ...config,
            branding_settings: {
                ...config.branding_settings,
                [field]: value
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-palette text-indigo-600"></i>
                    Branding & Global UI
                </h1>
                <p className="text-slate-500 text-sm">Manage global brand assets, logos, and footer information across resumebp.com.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Logos */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Visual Assets</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Main Site Logo URL</label>
                                    <input 
                                        type="text" 
                                        value={config.branding_settings?.site_logo || ''} 
                                        onChange={e => updateBranding('site_logo', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://resumebp.com/logo.png"
                                    />
                                    {config.branding_settings?.site_logo && (
                                        <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                                            <img src={config.branding_settings.site_logo} alt="Logo Preview" className="h-8 object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Favicon URL (32x32)</label>
                                    <input 
                                        type="text" 
                                        value={config.branding_settings?.site_icon || ''} 
                                        onChange={e => updateBranding('site_icon', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://resumebp.com/favicon.ico"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Global CTA */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Header Call-to-Action</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">CTA Button Text</label>
                                    <input 
                                        type="text" 
                                        value={config.branding_settings?.header_cta_text || 'Get Started Free'} 
                                        onChange={e => updateBranding('header_cta_text', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">CTA Button Link</label>
                                    <input 
                                        type="text" 
                                        value={config.branding_settings?.header_cta_link || '/builder'} 
                                        onChange={e => updateBranding('header_cta_link', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Footer Configuration</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Copyright Text</label>
                                    <input 
                                        type="text" 
                                        value={config.branding_settings?.footer_text || `© ${new Date().getFullYear()} ResumeBP. All rights reserved.`} 
                                        onChange={e => updateBranding('footer_text', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Extra Footer Scripts (Analytics, Chat, etc.)</label>
                                    <textarea 
                                        rows={4}
                                        value={config.branding_settings?.analytics_scripts || ''} 
                                        onChange={e => updateBranding('analytics_scripts', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-xs font-mono"
                                        placeholder="<script>...</script>"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
                        >
                            {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check"></i>}
                            Update Branding
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
