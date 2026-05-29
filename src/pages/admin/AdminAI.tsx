import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { showAlert } from '../../lib/alerts';
import { Shield, Zap, Key, Save, X, Terminal, RotateCcw, AlertCircle, Info, Sparkles, Activity, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';

interface AIConfig {
  ai_provider: string;
  openai_model: string;
  gemini_model: string;
  openai_key_configured: boolean;
  gemini_key_configured: boolean;
}

interface AIHealthStatus {
  openai: { status: string; message: string };
  gemini: { status: string; message: string };
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

const OPENAI_MODELS = [
  'gpt-5.4',
  'gpt-5.4-mini',
  'gpt-5.5',
  'gpt-5-mini',
  'gpt-4o-mini',
  'gpt-4.1',
  'o3',
  'o4-mini'
];
const GEMINI_MODELS = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];

export default function AdminAI() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [health, setHealth] = useState<AIHealthStatus | null>(null);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Edit State
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);

  // Live Test State
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testProvider, setTestProvider] = useState<'openai' | 'gemini'>('openai');
  const [testModel, setTestModel] = useState(OPENAI_MODELS[0]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Update test model when provider changes
  useEffect(() => {
    setTestModel(testProvider === 'openai' ? OPENAI_MODELS[0] : GEMINI_MODELS[0]);
  }, [testProvider]);

  const handleLiveTest = async () => {
    if (!testPrompt.trim()) return;

    try {
      setIsTesting(true);
      setTestResult('');
      const data = await api.post<{ response: string; latency: number }>('/v1/admin/test-ai', {
        provider: testProvider,
        model: testModel,
        prompt: testPrompt
      });
      setTestResult(data.response);
      setTestLatency(data.latency);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showAlert.error("Diagnostic Test Failed", errorMsg);
    } finally {
      setIsTesting(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configData, promptsData, healthData] = await Promise.all([
        api.get<AIConfig>('/v1/admin/ai-config'),
        api.get<AIPrompt[]>('/v1/admin/prompts'),
        api.get<AIHealthStatus>('/v1/admin/ai-health')
      ]);
      setConfig(configData);
      setPrompts(promptsData);
      setHealth(healthData);
    } catch (err) {
      console.error('Failed to fetch AI data', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAIHealth = async () => {
    try {
      setCheckingHealth(true);
      const healthData = await api.get<AIHealthStatus>('/v1/admin/ai-health');
      setHealth(healthData);
    } catch (err) {
      console.error('Failed to check AI health', err);
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleUpdateConfig = async (updates: Partial<AIConfig>) => {
    try {
      setIsUpdatingConfig(true);
      await api.post('/v1/admin/ai-config', updates);
      setConfig(prev => prev ? { ...prev, ...updates } : null);
      // Refresh health after provider/model change
      await checkAIHealth();
    } catch (err) {
      showAlert.error("Update Failed", "Failed to update AI configuration settings.");
    } finally {
      setIsUpdatingConfig(false);
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
      showAlert.error("Save Failed", "Failed to save prompt template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'limit_exceeded': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'unauthorized': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'missing_key': return <AlertCircle className="w-4 h-4 text-slate-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'limit_exceeded': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'unauthorized': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Banner - Global Config */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Zap className="w-8 h-8 fill-amber-400 text-amber-400" />
              AI Control Center
            </h2>
            <p className="text-indigo-100 font-medium">Manage your intelligence engines and orchestration prompts.</p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Active Provider</p>
              <p className="text-sm font-bold capitalize">{config?.ai_provider}</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Default Model</p>
              <p className="text-sm font-bold">{config?.ai_provider === 'openai' ? config?.openai_model : config?.gemini_model}</p>
            </div>
          </div>
        </div>
        <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection & Routing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-indigo-600" /> Model Configuration
              </h3>
              {isUpdatingConfig && <RotateCcw className="w-4 h-4 text-indigo-600 animate-spin" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* OpenAI Config */}
              <div className={cn("space-y-4 p-5 rounded-2xl border transition-all", config?.ai_provider === 'openai' ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900">OpenAI (GPT)</span>
                  </div>
                  <button
                    onClick={() => handleUpdateConfig({ ai_provider: 'openai' })}
                    className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all",
                      config?.ai_provider === 'openai' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    )}
                  >
                    {config?.ai_provider === 'openai' ? 'Selected' : 'Use This'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Primary Model</label>
                  <select
                    value={config?.openai_model}
                    onChange={(e) => handleUpdateConfig({ openai_model: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                  >
                    {OPENAI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Gemini Config */}
              <div className={cn("space-y-4 p-5 rounded-2xl border transition-all", config?.ai_provider === 'gemini' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-900">Google (Gemini)</span>
                  </div>
                  <button
                    onClick={() => handleUpdateConfig({ ai_provider: 'gemini' })}
                    className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all",
                      config?.ai_provider === 'gemini' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    )}
                  >
                    {config?.ai_provider === 'gemini' ? 'Selected' : 'Use This'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Primary Model</label>
                  <select
                    value={config?.gemini_model}
                    onChange={(e) => handleUpdateConfig({ gemini_model: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  >
                    {GEMINI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 border-dashed">
              <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                <strong>Note:</strong> Changes made here update the system routing in real-time for the current session. To make these changes permanent across restarts, update the corresponding environment variables in your <code className="bg-slate-200 px-1 rounded text-slate-700">.env</code> file.
              </p>
            </div>
          </div>

          {/* LIVE TEST SECTION */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Terminal className="w-5 h-5 text-indigo-600" /> Live AI Diagnostics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Test Provider</label>
                <select
                  value={testProvider}
                  onChange={(e) => setTestProvider(e.target.value as 'openai' | 'gemini')}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Test Model</label>
                <select
                  value={testModel}
                  onChange={(e) => setTestModel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {(testProvider === 'openai' ? OPENAI_MODELS : GEMINI_MODELS).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Test Prompt</label>
              <div className="relative">
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Type something to test the AI..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
                <button
                  onClick={handleLiveTest}
                  disabled={isTesting || !testPrompt.trim()}
                  className="absolute bottom-3 right-3 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  {isTesting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                  Run Test
                </button>
              </div>
            </div>

            {testResult && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AI Response</span>
                  <span className="text-[10px] font-bold text-slate-400">Latency: {testLatency}s</span>
                </div>
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-inner">
                  <p className="text-sm font-medium text-indigo-100 leading-relaxed whitespace-pre-wrap">
                    {testResult}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health & Key Status */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-indigo-600" /> Engine Health
            </h3>
            <button
              onClick={checkAIHealth}
              disabled={checkingHealth}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={cn("w-4 h-4", checkingHealth && "animate-spin")} />
            </button>
          </div>

          <div className="space-y-5">
            {[
              {
                id: 'openai',
                name: 'OpenAI API',
                configured: config?.openai_key_configured,
                model: config?.openai_model,
                health: health?.openai
              },
              {
                id: 'gemini',
                name: 'Google Gemini API',
                configured: config?.gemini_key_configured,
                model: config?.gemini_model,
                health: health?.gemini
              }
            ].map(engine => (
              <div key={engine.name} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-700">{engine.name}</span>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(engine.health?.status)}
                    <span className={cn("text-[9px] font-black uppercase tracking-tighter",
                      engine.health?.status === 'healthy' ? 'text-emerald-500' : 'text-rose-500'
                    )}>
                      {engine.health?.status?.replace('_', ' ') || 'Checking...'}
                    </span>
                  </div>
                </div>
                <div className={cn("p-4 rounded-2xl border transition-all", getStatusColor(engine.health?.status))}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{engine.model}</span>
                    <span className={cn("w-1.5 h-1.5 rounded-full", engine.configured ? 'bg-current animate-pulse' : 'bg-slate-300')}></span>
                  </div>
                  <p className="text-[11px] font-medium leading-tight">
                    {engine.health?.message || 'Attempting to verify connectivity...'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Usage Quotas</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">You can monitor credits and usage in your provider dashboard.</p>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://platform.openai.com/usage" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group">
                <span className="text-[10px] font-bold text-slate-600">OpenAI</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="https://aistudio.google.com/app/plan" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group">
                <span className="text-[10px] font-bold text-slate-600">Gemini</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
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
                    onChange={e => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Creativity (Temp: {editingPrompt.temperature / 10})</label>
                  <input
                    type="range"
                    min="0" max="10" step="1"
                    value={editingPrompt.temperature}
                    onChange={e => setEditingPrompt({ ...editingPrompt, temperature: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">System Instructions (Role)</label>
                <textarea
                  rows={3}
                  value={editingPrompt.system_prompt}
                  onChange={e => setEditingPrompt({ ...editingPrompt, system_prompt: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium bg-slate-50"
                  placeholder="e.g. You are a recruitment expert..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">User Prompt Template</label>
                <textarea
                  rows={6}
                  value={editingPrompt.user_prompt_template}
                  onChange={e => setEditingPrompt({ ...editingPrompt, user_prompt_template: e.target.value })}
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
