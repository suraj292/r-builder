import { useState, useMemo, useEffect } from 'react';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { cn } from '../../lib/utils';
import { Shield, Palette, Briefcase, GraduationCap, Sparkles, Lock, CheckCircle2, LayoutTemplate, X, Wand2, Info, Activity } from 'lucide-react';
import type { ResumeTemplate, ExperienceLevel } from '../../types/template';
import { useTemplateStore } from '../../store/useTemplateStore';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ATS: <Shield className="w-4 h-4" />,
  Professional: <Briefcase className="w-4 h-4" />,
  Creative: <Palette className="w-4 h-4" />,
  Designer: <Palette className="w-4 h-4" />,
  Academic: <GraduationCap className="w-4 h-4" />,
  Executive: <Sparkles className="w-4 h-4" />,
};

const TIER_COLORS: Record<string, string> = {
  free: 'bg-slate-100 text-slate-600 border-slate-200',
  pro: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  career_plus: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function AdminTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'pro' | 'career_plus'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const { settings, fetchSettings, updateSetting } = useTemplateStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const [localTemplates, setLocalTemplates] = useState<ResumeTemplate[]>([]);

  // Combine static registry with dynamic DB settings
  useEffect(() => {
    const combined = Object.values(TEMPLATE_REGISTRY).map(t => {
      const dbSettings = settings[t.id];
      return {
        ...t,
        isActive: dbSettings?.isActive ?? t.isActive ?? true,
        requiredTier: (dbSettings?.requiredTier as any) ?? t.requiredTier,
      };
    });
    setLocalTemplates(combined);
  }, [settings]);

  // Modal State
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [manageTemplate, setManageTemplate] = useState<ResumeTemplate | null>(null);
  const [rulesTemplate, setRulesTemplate] = useState<ResumeTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return localTemplates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' || t.requiredTier === selectedTier;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' ? t.isActive : !t.isActive);
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [localTemplates, searchQuery, selectedTier, statusFilter]);

  const stats = useMemo(() => ({
    total: localTemplates.length,
    active: localTemplates.filter(t => t.isActive).length,
    free: localTemplates.filter(t => t.requiredTier === 'free').length,
    pro: localTemplates.filter(t => t.requiredTier === 'pro').length,
    career_plus: localTemplates.filter(t => t.requiredTier === 'career_plus').length,
  }), [localTemplates]);

  const handleToggleStatus = async (id: string) => {
    const template = localTemplates.find(t => t.id === id);
    if (!template) return;
    try {
      // Optimistic update
      setLocalTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !template.isActive } : t));
      if (manageTemplate?.id === id) {
          setManageTemplate(prev => prev ? { ...prev, isActive: !template.isActive } : null);
      }
      
      await updateSetting(id, { isActive: !template.isActive });
    } catch (e) {
      // Revert on failure
      setLocalTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: template.isActive } : t));
      alert("Failed to update status");
    }
  };

  const handleSaveTier = async (id: string, tier: 'free' | 'pro' | 'career_plus') => {
    const template = localTemplates.find(t => t.id === id);
    if (!template) return;
    try {
      // Optimistic update
      setLocalTemplates(prev => prev.map(t => t.id === id ? { ...t, requiredTier: tier } : t));
      if (manageTemplate?.id === id) {
          setManageTemplate(prev => prev ? { ...prev, requiredTier: tier } : null);
      }
      await updateSetting(id, { requiredTier: tier });
    } catch (e) {
      // Revert on failure
      setLocalTemplates(prev => prev.map(t => t.id === id ? { ...t, requiredTier: template.requiredTier } : t));
      alert("Failed to update tier");
    }
  };

  const handleSaveRules = (id: string, metadata: Partial<ResumeTemplate['metadata']>) => {
    setLocalTemplates(prev => prev.map(t => t.id === id ? { ...t, metadata: { ...t.metadata, ...metadata } } : t));
    alert("Rules updated (in-memory preview)");
    setRulesTemplate(null);
  };


  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Template Management</h1>
          <p className="text-slate-500 text-sm">Control template availability and monetization tiers.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Active</p>
                    <p className="text-lg font-bold text-slate-900">{stats.active}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total Library</p>
                    <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <LayoutTemplate className="w-4 h-4" />
                </div>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search templates by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {(['all', 'free', 'pro', 'career_plus'] as const).map(tier => (
                <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                        "flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer",
                        selectedTier === tier ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tier.replace('_', '+')}
                </button>
            ))}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {(['all', 'active', 'inactive'] as const).map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                        "flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer",
                        statusFilter === status ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className={cn(
              "group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 transition-all animate-fade-in relative",
              !template.isActive && "opacity-75"
          )}>
            {!template.isActive && (
                <div className="absolute inset-0 z-10 bg-slate-900/5 pointer-events-none flex items-center justify-center">
                    <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xl">Disabled</span>
                </div>
            )}
            <div className="relative aspect-[1/1.3] bg-slate-100 overflow-hidden">
                <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className={cn(
                        "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                        !template.isActive && "grayscale contrast-75"
                    )}
                />
                <div className="absolute top-3 left-3">
                    <span className={cn(
                        "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm",
                        TIER_COLORS[template.requiredTier]
                    )}>
                        {template.requiredTier.replace('_', '+')}
                    </span>
                </div>
                {template.metadata.atsOptimized && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg" title="ATS Optimized">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                        onClick={() => setPreviewTemplate(template)}
                        className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                        Preview
                    </button>
                    <button 
                        onClick={() => setManageTemplate(template)}
                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-gear text-xs"></i>
                    </button>
                </div>
            </div>
            
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{template.name}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                            {CATEGORY_ICONS[template.category] || <LayoutTemplate className="w-3 h-3" />}
                            <span className="text-[10px] font-medium uppercase tracking-wider">{template.category}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {template.metadata.experienceLevels.map(level => (
                        <span key={level} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-bold rounded border border-slate-100 capitalize">
                            {level}
                        </span>
                    ))}
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Wand2 className="w-3 h-3 text-indigo-400" />
                        <span>Creativity: {template.metadata.creativityLevel}/5</span>
                    </div>
                    <button 
                        onClick={() => setRulesTemplate(template)}
                        className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                        Edit Rules
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1. PREVIEW MODAL */}
      {previewTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setPreviewTemplate(null)}>
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setPreviewTemplate(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all z-10 cursor-pointer">
                      <X className="w-4 h-4" />
                  </button>
                  <div className="aspect-[1/1.41] overflow-y-auto max-h-[85vh]">
                      <img src={previewTemplate.thumbnail} className="w-full" alt="Full Preview" />
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div>
                          <h3 className="font-bold text-slate-900">{previewTemplate.name}</h3>
                          <p className="text-xs text-slate-500">{previewTemplate.category} Template</p>
                      </div>
                      <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">
                          Use Template
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. MANAGE TIER MODAL */}
      {manageTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setManageTemplate(null)}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8" onClick={e => e.stopPropagation()}>
                  <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                          <LayoutTemplate className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Manage Template</h3>
                      <p className="text-sm text-slate-500">{manageTemplate.name}</p>
                  </div>

                  <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Access Level</p>
                      {(['free', 'pro', 'career_plus'] as const).map(tier => (
                          <button 
                            key={tier}
                            onClick={() => handleSaveTier(manageTemplate.id, tier)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group cursor-pointer",
                                manageTemplate.requiredTier === tier ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-slate-300"
                            )}
                          >
                              <div className="flex items-center gap-3">
                                  <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs",
                                      tier === 'free' ? "bg-slate-100 text-slate-500" : tier === 'pro' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                                  )}>
                                      <i className={`fa-solid ${tier === 'free' ? 'fa-leaf' : tier === 'pro' ? 'fa-bolt' : 'fa-crown'}`}></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-800 capitalize">{tier.replace('_', '+')}</span>
                              </div>
                              {manageTemplate.requiredTier === tier && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                          </button>
                      ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Availability</p>
                    <button 
                        onClick={() => {
                            handleToggleStatus(manageTemplate.id);
                            setManageTemplate(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
                        }}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                            manageTemplate.isActive ? "border-emerald-600 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                manageTemplate.isActive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                            )}>
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">{manageTemplate.isActive ? 'Template Active' : 'Template Disabled'}</p>
                                <p className="text-[10px] text-slate-500">{manageTemplate.isActive ? 'Visible to users' : 'Hidden from gallery'}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-10 h-5 rounded-full relative transition-all duration-300",
                            manageTemplate.isActive ? "bg-emerald-500" : "bg-slate-300"
                        )}>
                            <div className={cn(
                                "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all",
                                manageTemplate.isActive ? "translate-x-5" : ""
                            )}></div>
                        </div>
                    </button>
                  </div>

                  <button 
                    onClick={() => setManageTemplate(null)}
                    className="w-full mt-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                      Cancel
                  </button>
              </div>
          </div>
      )}

      {/* 3. EDIT RULES MODAL */}
      {rulesTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setRulesTemplate(null)}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                          <Wand2 className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Edit Rules</h3>
                          <p className="text-xs text-slate-500">{rulesTemplate.name}</p>
                      </div>
                  </div>

                  <form className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-emerald-600" />
                              <div>
                                  <p className="text-sm font-bold text-slate-800">ATS Optimized</p>
                                  <p className="text-[10px] text-slate-500">Enable deep-scan compatibility</p>
                              </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleSaveRules(rulesTemplate.id, { atsOptimized: !rulesTemplate.metadata.atsOptimized })}
                            className={cn(
                                "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                                rulesTemplate.metadata.atsOptimized ? "bg-emerald-500" : "bg-slate-300"
                            )}
                          >
                              <div className={cn(
                                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all",
                                  rulesTemplate.metadata.atsOptimized ? "translate-x-6" : ""
                              )}></div>
                          </button>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Creativity Level (1-5)</label>
                          <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(lvl => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => handleSaveRules(rulesTemplate.id, { creativityLevel: lvl })}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl border font-bold text-sm transition-all cursor-pointer",
                                        rulesTemplate.metadata.creativityLevel === lvl 
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                        : "border-slate-100 hover:border-slate-300 text-slate-500"
                                    )}
                                  >
                                      {lvl}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                          <p className="text-[10px] text-blue-700 leading-relaxed">
                              Changing rules affects how our AI recommendation engine suggests this template to users based on their target industry and job title.
                          </p>
                      </div>

                      <button 
                        type="button"
                        onClick={() => setRulesTemplate(null)}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
                      >
                          Close Rules
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
}
