import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function TrustCenter() {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const updateTrust = (field: string, value: any) => {
        const newConfig = {
            ...config,
            trust_center: {
                ...config.trust_center,
                [field]: value
            }
        };
        setConfig(newConfig);
    };

    const handleSave = async () => {
        try {
            await api.put('/v1/admin/visibility/config', config);
            Swal.fire('Success', 'Trust settings updated.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to save', 'error');
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400">Loading...</div>;

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-certificate text-indigo-600"></i>
                    Trust Center
                </h1>
                <p className="text-slate-500 text-sm">Manage testimonials, reviews, and trust badges to build authority and improve EEAT.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Trust Badges</h3>
                    <div className="space-y-4">
                        {[
                            { id: 'google_stars', label: 'Google Rating (4.9/5)', icon: 'fa-google' },
                            { id: 'secure_checkout', label: 'SSL Secure Checkout', icon: 'fa-shield-halved' },
                            { id: 'guarantee', label: '30-Day Money Back', icon: 'fa-rotate-left' },
                        ].map(badge => (
                            <label key={badge.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:border-indigo-200 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <i className={`fa-solid ${badge.icon}`}></i>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{badge.label}</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.trust_center?.[badge.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={config.trust_center?.[badge.id] || false} 
                                        onChange={e => updateTrust(badge.id, e.target.checked)}
                                    />
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.trust_center?.[badge.id] ? 'left-6' : 'left-1'}`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Reviews Aggregator</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Connect your external review platforms to automatically pull ratings and inject Review Schema (JSON-LD) into your site.</p>
                        <div className="space-y-3">
                            <input 
                                type="url" 
                                placeholder="Trustpilot Profile URL" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs"
                            />
                            <input 
                                type="url" 
                                placeholder="G2 Crowd Profile URL" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Save Trust Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
