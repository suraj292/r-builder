import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { Wand2, Shield, Zap, Key, Save, X, Terminal, RotateCcw, AlertCircle } from 'lucide-react';

interface AIConfig {
  ai_provider: string;
  openai_model: string;
  gemini_model: string;
  openai_key_configured: boolean;
  gemini_key_configured: boolean;
}

interface AIPrompt {
  id: number;
  slug: string;
  name: string;
  description: string;
  system_prompt: string;
  user_prompt_template: string;
  model_override: string | null;
  temperature: number;
  is_active: boolean;
}

export default function AdminAI() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configData, promptsData] = await Promise.all([
        api.get<AIConfig>('/v1/admin/ai-config'),
        api.get<AIPrompt[]>('/v1/admin/prompts')
      ]);
      setConfig(configData);
      setPrompts(promptsData);
    } catch (err) {
      console.error('Failed to fetch AI data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt) return;

    try {
      setIsSaving(true);
      await api.patch(`/v1/admin/prompts/${editingPrompt.id}`, editingPrompt);
      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? editingPrompt : p));
      setEditingPrompt(null);
    } catch (err) {
      alert("Failed to save prompt. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider Status */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-600" /> Active Provider
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                  {config?.ai_provider === 'openai' ? <Zap className="w-6 h-6 text-amber-500" /> : <Sparkles className="w-6 h-6 text-blue-500" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 capitalize">{config?.ai_provider || 'Not Set'}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Primary Intelligence Engine</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg">Active</span>
            </div>
            <div className="text-[10px] text-slate-400 px-2 italic flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                Change provider in system environment variables (.env)
            </div>
          </div>
        </div>

        {/* API Key Status */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" /> API Key Health
          </h3>
          
          <div className="space-y-3">
            {[
                { name: 'OpenAI (GPT-4o)', configured: config?.openai_key_configured, model: config?.openai_model },
                { name: 'Google (Gemini 1.5)', configured: config?.gemini_key_configured, model: config?.gemini_model }
            ].map(key => (
                <div key={key.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div>
                        <p className="text-sm font-bold text-slate-700">{key.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{key.model}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", key.configured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400')}></div>
                        <span className={cn("text-[10px] font-black uppercase", key.configured ? 'text-emerald-600' : 'text-rose-500')}>
                            {key.configured ? 'Connected' : 'Missing'}
                        </span>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                    <Terminal className="w-5 h-5 text-indigo-600" /> Prompt Library
                </h3>
                <p className="text-xs text-slate-500">Configure how the AI interacts with user data.</p>
            </div>
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Refresh Prompts">
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {prompts.map(prompt => (
                <div key={prompt.id} className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{prompt.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{prompt.slug}</p>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 max-w-md">{prompt.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-slate-400">Temp</span>
                            <span className="text-xs font-bold text-slate-700">{prompt.temperature / 10}</span>
                        </div>
                        <button 
                            onClick={() => setEditingPrompt(prompt)}
                            className="px-6 py-2 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-xs font-black uppercase transition-all shadow-sm cursor-pointer"
                        >
                            Edit Prompt
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setEditingPrompt(null)}>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                              <Terminal className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Edit Prompt Template</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{editingPrompt.slug}</p>
                          </div>
                      </div>
                      <button onClick={() => setEditingPrompt(null)} className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <form onSubmit={handleSavePrompt} className="p-8 space-y-6 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Display Name</label>
                              <input 
                                type="text" 
                                value={editingPrompt.name}
                                onChange={e => setEditingPrompt({...editingPrompt, name: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Creativity (Temp: {editingPrompt.temperature / 10})</label>
                              <input 
                                type="range" 
                                min="0" max="10" step="1"
                                value={editingPrompt.temperature}
                                onChange={e => setEditingPrompt({...editingPrompt, temperature: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">System Instructions (Role)</label>
                          <textarea 
                            rows={3}
                            value={editingPrompt.system_prompt}
                            onChange={e => setEditingPrompt({...editingPrompt, system_prompt: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium bg-slate-50"
                            placeholder="e.g. You are a recruitment expert..."
                          ></textarea>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">User Prompt Template</label>
                          <textarea 
                            rows={6}
                            value={editingPrompt.user_prompt_template}
                            onChange={e => setEditingPrompt({...editingPrompt, user_prompt_template: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono bg-slate-900 text-indigo-300"
                            placeholder="e.g. Optimize this resume for {job_title}: {resume_content}"
                          ></textarea>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 px-1">
                              <Info className="w-3 h-3" /> Use curly braces for variables: {'{data}'}, {'{job_title}'}
                          </p>
                      </div>

                      <div className="pt-4 flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setEditingPrompt(null)}
                            className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-xs font-black uppercase text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                              Discard Changes
                          </button>
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex-[2] py-3.5 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                          >
                              {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Template
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}

import { Info, Sparkles } from 'lucide-react';
