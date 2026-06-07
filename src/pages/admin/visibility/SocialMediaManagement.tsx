import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function SocialMediaManagement() {
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
            Swal.fire('Success', 'Social media settings updated.', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400 italic">Loading settings...</div>;

    const updateSocial = (field: string, value: any) => {
        setConfig({
            ...config,
            social_links: {
                ...config.social_links,
                [field]: value
            }
        });
    };

    const platforms = [
        { id: 'facebook', label: 'Facebook', icon: 'fa-facebook', color: 'text-blue-600' },
        { id: 'instagram', label: 'Instagram', icon: 'fa-instagram', color: 'text-pink-600' },
        { id: 'linkedin', label: 'LinkedIn', icon: 'fa-linkedin', color: 'text-blue-700' },
        { id: 'twitter', label: 'X (Twitter)', icon: 'fa-x-twitter', color: 'text-slate-900' },
        { id: 'youtube', label: 'YouTube', icon: 'fa-youtube', color: 'text-red-600' },
        { id: 'github', label: 'GitHub', icon: 'fa-github', color: 'text-slate-800' },
        { id: 'pinterest', label: 'Pinterest', icon: 'fa-pinterest', color: 'text-red-700' },
        { id: 'tiktok', label: 'TikTok', icon: 'fa-tiktok', color: 'text-slate-900' },
    ];

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-share-nodes text-indigo-600"></i>
                    Social Media Management
                </h1>
                <p className="text-slate-500 text-sm">Manage your brand's presence across social platforms and optimize for sharing.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Profiles */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Social Profiles</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {platforms.map(platform => (
                                    <div key={platform.id} className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <i className={`fa-brands ${platform.icon} ${platform.color} text-sm`}></i>
                                            {platform.label} URL
                                        </label>
                                        <input 
                                            type="url" 
                                            value={config.social_links?.[platform.id] || ''} 
                                            onChange={e => updateSocial(platform.id, e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                            placeholder={`https://${platform.id}.com/yourbrand`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Social Sharing */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Global Sharing Defaults</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Default OG Image URL</label>
                                    <input 
                                        type="url" 
                                        value={config.social_links?.og_image || ''} 
                                        onChange={e => updateSocial('og_image', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://yourdomain.com/social-share.png"
                                    />
                                    <p className="text-[10px] text-slate-400">The fallback image used when a page doesn't have a specific OG image defined.</p>
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
                            Save Social Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
