import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface SystemSettings {
  project_name: string;
  maintenance_mode: boolean;
  allow_new_registrations: boolean;
  contact_email: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get<SystemSettings>('/v1/admin/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">General Settings</h3>
            <p className="text-xs text-slate-500">Configure global platform behavior and identity.</p>
        </div>
        <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Name</label>
                    <input 
                        type="text" 
                        value={settings?.project_name} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Support Email</label>
                    <input 
                        type="email" 
                        value={settings?.contact_email} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                        <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Disable the frontend for all non-admin users.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all ${settings?.maintenance_mode ? 'translate-x-6 bg-indigo-600' : ''}`}></div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                        <p className="text-sm font-bold text-slate-800">Public Registrations</p>
                        <p className="text-xs text-slate-500">Allow new users to create accounts.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-600 cursor-pointer">
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all translate-x-6`}></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                Save Changes
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden border-l-4 border-l-rose-500">
        <div className="p-6">
            <h3 className="font-bold text-rose-800">Danger Zone</h3>
            <p className="text-xs text-rose-600">Actions here are destructive and cannot be undone.</p>
            <div className="mt-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-800">Clear System Cache</p>
                    <p className="text-xs text-slate-500">Flush all Redis keys and temporary sessions.</p>
                </div>
                <button className="px-4 py-2 border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-all text-xs">
                    Execute Flush
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
