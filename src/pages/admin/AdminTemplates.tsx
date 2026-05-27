import { useState, useMemo } from 'react';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { cn } from '../../lib/utils';
import { Shield, Palette, Briefcase, GraduationCap, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

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

  const templates = useMemo(() => Object.values(TEMPLATE_REGISTRY), []);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' || t.requiredTier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [templates, searchQuery, selectedTier]);

  const stats = useMemo(() => ({
    total: templates.length,
    free: templates.filter(t => t.requiredTier === 'free').length,
    pro: templates.filter(t => t.requiredTier === 'pro').length,
    career_plus: templates.filter(t => t.requiredTier === 'career_plus').length,
  }), [templates]);

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
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total Library</p>
                    <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <i className="fa-solid fa-layer-group text-sm"></i>
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
                        "flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                        selectedTier === tier ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tier.replace('_', '+')}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 transition-all">
            <div className="relative aspect-[1/1.3] bg-slate-100 overflow-hidden">
                <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">
                        Preview
                    </button>
                    <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
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
                        <i className="fa-solid fa- wand-magic-sparkles text-indigo-400"></i>
                        <span>Creativity: {template.metadata.creativityLevel}/5</span>
                    </div>
                    <button className="text-[10px] font-bold text-indigo-600 hover:underline">
                        Edit Rules
                    </button>
                </div>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <i className="fa-solid fa-layer-group text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800">No templates found</h3>
                <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
            </div>
        )}
      </div>
    </div>
  );
}

import { LayoutTemplate } from 'lucide-react';
