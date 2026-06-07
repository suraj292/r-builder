import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';
import type { SystemSettings } from '../../types/system';
import MediaLibrary from '../../components/admin/MediaLibrary';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Media selection states
  const [activeMediaTarget, setActiveMediaTarget] = useState<'logo' | 'icon' | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get<SystemSettings>('/v1/admin/system/');
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await api.put('/v1/admin/system/', settings);
      Swal.fire('Success', 'System settings updated successfully.', 'success');
      // Refresh global store if needed (window.location.reload is the easy way for now)
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocial = (key: string, value: string) => {
    if (!settings) return;
    setSettings({
        ...settings,
        social_links: {
            ...settings.social_links,
            [key]: value
        }
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading system configurations...</p>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8 pb-20 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-500 text-sm">Manage your platform's identity, contact info, and behavior.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
        >
            {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            {/* General Identity */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Platform Identity</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Project Name</label>
                            <input 
                                type="text" 
                                value={settings?.project_name} 
                                onChange={(e) => setSettings({ ...settings!, project_name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Site Domain</label>
                            <input 
                                type="text" 
                                value={settings?.site_domain} 
                                onChange={(e) => setSettings({ ...settings!, site_domain: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand Logo</label>
                            <div className="relative group aspect-[3/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                {settings?.site_logo ? (
                                    <img src={settings.site_logo} className="h-12 object-contain" alt="Logo" />
                                ) : (
                                    <i className="fa-solid fa-image text-slate-300 text-2xl"></i>
                                )}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => setActiveMediaTarget('logo')}
                                        className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-xl"
                                    >
                                        Change Logo
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Favicon (Icon)</label>
                            <div className="relative group aspect-square w-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                {settings?.site_icon ? (
                                    <img src={settings.site_icon} className="w-12 h-12 object-contain" alt="Icon" />
                                ) : (
                                    <i className="fa-solid fa-circle text-slate-300 text-2xl"></i>
                                )}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => setActiveMediaTarget('icon')}
                                        className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-bold shadow-xl"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Contact & Support</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Support Email</label>
                            <input 
                                type="email" 
                                value={settings?.contact_email} 
                                onChange={(e) => setSettings({ ...settings!, contact_email: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Phone</label>
                            <input 
                                type="text" 
                                value={settings?.contact_phone || ''} 
                                onChange={(e) => setSettings({ ...settings!, contact_phone: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Physical Address</label>
                        <textarea 
                            rows={3}
                            value={settings?.contact_address || ''} 
                            onChange={(e) => setSettings({ ...settings!, contact_address: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Social Media Links</h3>
                    <i className="fa-solid fa-share-nodes text-indigo-400"></i>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <i className="fa-brands fa-facebook text-blue-600 text-xs"></i> Facebook
                        </label>
                        <input 
                            type="text" 
                            value={settings?.social_links?.facebook || ''} 
                            onChange={(e) => updateSocial('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <i className="fa-brands fa-x-twitter text-slate-900 text-xs"></i> Twitter / X
                        </label>
                        <input 
                            type="text" 
                            value={settings?.social_links?.twitter || ''} 
                            onChange={(e) => updateSocial('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <i className="fa-brands fa-linkedin text-blue-700 text-xs"></i> LinkedIn
                        </label>
                        <input 
                            type="text" 
                            value={settings?.social_links?.linkedin || ''} 
                            onChange={(e) => updateSocial('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/company/..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <i className="fa-brands fa-instagram text-rose-600 text-xs"></i> Instagram
                        </label>
                        <input 
                            type="text" 
                            value={settings?.social_links?.instagram || ''} 
                            onChange={(e) => updateSocial('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            {/* System Status */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Platform Status</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                        <div>
                            <p className="text-xs font-bold text-slate-800">Maintenance Mode</p>
                            <p className="text-[10px] text-slate-500">Lock site for non-admins.</p>
                        </div>
                        <button 
                            onClick={() => setSettings({ ...settings!, maintenance_mode: !settings?.maintenance_mode })}
                            className={`w-10 h-5 rounded-full relative transition-colors ${settings?.maintenance_mode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings?.maintenance_mode ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                        <div>
                            <p className="text-xs font-bold text-slate-800">New Registrations</p>
                            <p className="text-[10px] text-slate-500">Allow new signups.</p>
                        </div>
                        <button 
                            onClick={() => setSettings({ ...settings!, allow_new_registrations: !settings?.allow_new_registrations })}
                            className={`w-10 h-5 rounded-full relative transition-colors ${settings?.allow_new_registrations ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings?.allow_new_registrations ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-rose-200 bg-rose-100/30">
                    <h3 className="font-bold text-rose-800 text-sm uppercase tracking-wider">Danger Zone</h3>
                </div>
                <div className="p-6 space-y-4">
                    <button className="w-full py-3 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all text-xs shadow-sm">
                        Clear System Cache
                    </button>
                    <button className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all text-xs shadow-md">
                        Flush All Sessions
                    </button>
                </div>
            </div>
        </div>

      </div>

      {/* Media Library Modal */}
      {activeMediaTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-slate-900/60 backdrop-blur-sm">
            <MediaLibrary 
                selectionMode 
                onClose={() => setActiveMediaTarget(null)}
                onSelect={(media) => {
                    if (activeMediaTarget === 'logo') setSettings({ ...settings!, site_logo: media.file_path });
                    if (activeMediaTarget === 'icon') setSettings({ ...settings!, site_icon: media.file_path });
                    setActiveMediaTarget(null);
                }}
            />
        </div>
      )}
    </div>
  );
}
