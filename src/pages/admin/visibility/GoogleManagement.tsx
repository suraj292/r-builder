import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Swal from 'sweetalert2';

export default function GoogleManagement() {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isIndexing, setIsIndexing] = useState(false);

    const keyPages = [
        '/',
        '/ats-checker',
        '/pricing',
        '/about',
        '/contact',
        '/blog'
    ];

    const handleForceIndexing = async () => {
        const domain = config.business_info?.website_url || 'https://resumebp.com';
        const urls = keyPages.map(path => `${domain.replace(/\/$/, '')}${path}`);

        const result = await Swal.fire({
            title: 'Force Google Indexing?',
            text: `This will request Google to crawl and index ${urls.length} key pages. Continue?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit',
            confirmButtonColor: '#4f46e5'
        });

        if (result.isConfirmed) {
            setIsIndexing(true);
            try {
                const response = await api.post('/v1/admin/visibility/google/index', {
                    urls: urls,
                    action: 'URL_UPDATED'
                });
                
                const successes = response.results.filter((r: any) => r.status === 'success').length;
                Swal.fire('Indexing Request Sent', `Successfully submitted ${successes} out of ${urls.length} URLs.`, 'success');
            } catch (error: any) {
                Swal.fire('Error', error.message || 'Failed to submit indexing request. Ensure service_account.json is present on the server.', 'error');
            } finally {
                setIsIndexing(false);
            }
        }
    };

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
            Swal.fire('Success', 'Google settings updated.', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.message || 'Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400 italic">Loading settings...</div>;

    const updateGoogle = (field: string, value: any) => {
        setConfig({
            ...config,
            google_settings: {
                ...config.google_settings,
                [field]: value
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <i className="fa-brands fa-google text-indigo-600"></i>
                    Google Management
                </h1>
                <p className="text-slate-500 text-sm">Connect your site with Google services to track performance and improve indexing.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Analytics */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Google Analytics (GA4)</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">GA4 Measurement ID</label>
                                    <input 
                                        type="text" 
                                        value={config.google_settings?.ga4_measurement_id || ''} 
                                        onChange={e => updateGoogle('ga4_measurement_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                    <p className="text-[10px] text-slate-400">Your Google Analytics 4 tracking ID. Scripts will be auto-injected.</p>
                                </div>
                            </div>
                        </section>

                        {/* Search Console */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Google Search Console</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">HTML Verification Tag</label>
                                    <input 
                                        type="text" 
                                        value={config.google_settings?.search_console_tag || ''} 
                                        onChange={e => updateGoogle('search_console_tag', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder='<meta name="google-site-verification" content="..." />'
                                    />
                                    <p className="text-[10px] text-slate-400">Paste the full meta tag or just the content value.</p>
                                </div>
                            </div>
                        </section>

                        {/* Indexing API */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Google Indexing API</h3>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                                        <i className="fa-solid fa-bolt"></i>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Force Instant Crawling</h4>
                                            <p className="text-xs text-slate-500 mt-1">Submit your core pages directly to Google's indexing queue. Use this after making major content updates or design changes.</p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {keyPages.map(page => (
                                                <span key={page} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-medium text-slate-600">
                                                    {page}
                                                </span>
                                            ))}
                                        </div>

                                        <button 
                                            type="button"
                                            onClick={handleForceIndexing}
                                            disabled={isIndexing}
                                            className="px-6 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            {isIndexing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-rocket"></i>}
                                            Request Instant Indexing
                                        </button>
                                        <p className="text-[10px] text-slate-400 italic font-medium">Requires backend/service_account.json with Indexing API access.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Business Profile */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Google Business Profile</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Business Profile URL</label>
                                    <input 
                                        type="url" 
                                        value={config.google_settings?.google_business_url || ''} 
                                        onChange={e => updateGoogle('google_business_url', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://business.google.com/..."
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Google Maps Share URL</label>
                                    <input 
                                        type="url" 
                                        value={config.google_settings?.google_maps_url || ''} 
                                        onChange={e => updateGoogle('google_maps_url', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                        placeholder="https://goo.gl/maps/..."
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
                            Save Google Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
