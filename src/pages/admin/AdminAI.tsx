import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface AIConfig {
  ai_provider: string;
  openai_model: string;
  gemini_model: string;
  openai_key_configured: boolean;
  gemini_key_configured: boolean;
}

export default function AdminAI() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.get<AIConfig>('/v1/admin/ai-config');
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch AI config', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) return <div>Loading config...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider Status */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-microchip text-indigo-600"></i> Active Provider
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                  <i className={`fa-solid ${config?.ai_provider === 'openai' ? 'fa-bolt text-amber-500' : 'fa-sparkles text-blue-500'}`}></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 capitalize">{config?.ai_provider}</p>
                  <p className="text-xs text-slate-500">Current primary engine</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg">Active</span>
            </div>
          </div>
        </div>

        {/* API Key Status */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-key text-indigo-600"></i> API Key Health
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">OpenAI API Key</span>
              <span className={`text-xs font-bold ${config?.openai_key_configured ? 'text-emerald-500' : 'text-rose-500'}`}>
                {config?.openai_key_configured ? 'Connected' : 'Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Gemini API Key</span>
              <span className={`text-xs font-bold ${config?.gemini_key_configured ? 'text-emerald-500' : 'text-rose-500'}`}>
                {config?.gemini_key_configured ? 'Connected' : 'Missing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Prompt Management</h3>
        <div className="space-y-4">
            {[
                { name: 'Summary Generation', id: 'summary_gen', tokens: '450 avg' },
                { name: 'Experience Optimization', id: 'exp_opt', tokens: '800 avg' },
                { name: 'ATS Score Calculation', id: 'ats_calc', tokens: '1200 avg' },
            ].map(prompt => (
                <div key={prompt.id} className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <i className="fa-solid fa-terminal text-sm"></i>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{prompt.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ID: {prompt.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400">{prompt.tokens}</span>
                        <button className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all">
                            Edit Prompt
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
