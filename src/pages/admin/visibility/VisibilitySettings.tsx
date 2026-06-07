import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function VisibilitySettings() {
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
            console.error('Failed to fetch visibility config');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/v1/admin/visibility/config', config);
            Swal.fire('Success', 'Visibility settings updated.', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400 italic">Loading settings...</div>;

    const updateInfo = (field: string, value: any) => {
        setConfig({
            ...config,
            business_info: {
                ...config.business_info,
                [field]: value
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-eye text-indigo-600"></i>
                    Visibility Settings
                </h1>
                <p className="text-slate-500 text-sm">Core business data that search engines and AI systems use to identify your brand.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Basic Branding */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Brand Identity</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Legal Business Name</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.business_name || ''} 
                                        onChange={e => updateInfo('business_name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="e.g. ResumeAI Inc."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Public Brand Name</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.brand_name || ''} 
                                        onChange={e => updateInfo('brand_name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="e.g. ResumeAI"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Website URL</label>
                                    <input 
                                        type="url" 
                                        value={config.business_info?.website_url || ''} 
                                        onChange={e => updateInfo('website_url', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://resumeai.com"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Business Description (AI Knowledge Base)</label>
                                    <textarea 
                                        rows={4}
                                        value={config.business_info?.description || ''} 
                                        onChange={e => updateInfo('description', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                                        placeholder="Provide a detailed description of your business for AI LLMs to understand your mission and services."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contact & Location */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Contact & Location</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Email</label>
                                    <input 
                                        type="email" 
                                        value={config.business_info?.email || ''} 
                                        onChange={e => updateInfo('email', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Phone</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.phone || ''} 
                                        onChange={e => updateInfo('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Full Office Address</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.address || ''} 
                                        onChange={e => updateInfo('address', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.city || ''} 
                                        onChange={e => updateInfo('city', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Country</label>
                                    <input 
                                        type="text" 
                                        value={config.business_info?.country || ''} 
                                        onChange={e => updateInfo('country', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
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
                            {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                            Save Visibility Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
