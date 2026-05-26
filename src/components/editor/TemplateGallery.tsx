import React, { useMemo } from 'react';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';
import { Check, Search, Sparkles, Shield, Palette, Briefcase, GraduationCap } from 'lucide-react';
import { getRecommendedTemplates } from '../../lib/recommendations';
import type { ExperienceLevel } from '../../types/template';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ATS: <Shield className="w-4 h-4" />,
  Professional: <Briefcase className="w-4 h-4" />,
  Creative: <Palette className="w-4 h-4" />,
  Designer: <Palette className="w-4 h-4" />,
  Academic: <GraduationCap className="w-4 h-4" />,
  Executive: <Sparkles className="w-4 h-4" />,
};

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['fresher', 'mid', 'senior', 'executive'];

export const TemplateGallery: React.FC = () => {
  const currentTemplateId = useResumeStore((state) => state.resume.metadata.templateId);
  const metadata = useResumeStore((state) => state.resume.metadata);
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const updateMetadata = useResumeStore((state) => state.updateMetadata);
  const reorderBlocks = useResumeStore((state) => state.reorderBlocks);
  const blocks = useResumeStore((state) => state.resume.blocks);

  const [searchQuery, setSearchQuery] = React.useState('');

  const activeTemplate = useMemo(() => TEMPLATE_REGISTRY[currentTemplateId], [currentTemplateId]);

  const handleOptimizeStructure = () => {
    if (!activeTemplate) return;
    
    // Map recommended categories to actual block IDs
    // This is a simplified heuristic: match block.type or section.data.title
    const recommended = activeTemplate.metadata.recommendedSections;
    const blockEntries = Object.entries(blocks);
    
    const newOrder: string[] = [];
    
    recommended.forEach(rec => {
      // Find blocks matching the recommendation
      const matches = blockEntries.filter(([_, b]) => {
        if (rec === 'header' && b.type === 'header') return true;
        if (rec === 'summary' && b.type === 'text' && b.id.includes('summary')) return true;
        if (rec === 'experience' && (b.type === 'experience_item' || (b.type === 'section' && b.data.title.toLowerCase().includes('experience')))) return true;
        if (rec === 'skills' && (b.id.includes('skill') || (b.type === 'section' && b.data.title.toLowerCase().includes('skill')))) return true;
        if (rec === 'education' && (b.id.includes('edu') || (b.type === 'section' && b.data.title.toLowerCase().includes('education')))) return true;
        if (rec === 'projects' && (b.id.includes('project') || (b.type === 'section' && b.data.title.toLowerCase().includes('project')))) return true;
        return false;
      });
      
      matches.forEach(([id]) => {
        if (!newOrder.includes(id)) newOrder.push(id);
      });
    });
    
    reorderBlocks(newOrder);
  };

  const templates = useMemo(() => Object.values(TEMPLATE_REGISTRY), []);

  const recommended = useMemo(() => 
    getRecommendedTemplates(templates, {
      targetOccupation: metadata.targetOccupation,
      experienceLevel: metadata.experienceLevel,
    }), [templates, metadata.targetOccupation, metadata.experienceLevel]);

  const atsTemplates = useMemo(() => templates.filter(t => t.metadata.atsOptimized), [templates]);
  const creativeTemplates = useMemo(() => templates.filter(t => t.metadata.creativityLevel >= 4), [templates]);
  const filteredTemplates = useMemo(() => 
    templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [templates, searchQuery]
  );

  const renderTemplateCard = (template: typeof templates[0]) => (
    <button
      key={template.id}
      onClick={() => setTemplate(template.id)}
      className={cn(
        "group text-left relative transition-all duration-200 flex flex-col shrink-0",
        currentTemplateId === template.id ? "ring-2 ring-blue-500 rounded-lg p-1 bg-blue-50/50" : "hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-[1/1.4] w-32 rounded-md overflow-hidden bg-white border border-gray-200 shadow-sm transition-shadow group-hover:shadow-md">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="w-full h-full object-cover"
        />
        {currentTemplateId === template.id && (
          <div className="absolute top-1 right-1 bg-blue-500 text-white p-0.5 rounded-full shadow-sm">
            <Check className="w-2.5 h-2.5" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        {template.metadata.atsOptimized && (
          <div className="absolute bottom-1 left-1 bg-green-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
            ATS Safe
          </div>
        )}
      </div>
      <div className="mt-1 px-0.5">
        <h3 className={cn(
          "text-[10px] font-semibold leading-tight line-clamp-1",
          currentTemplateId === template.id ? "text-blue-700" : "text-gray-700"
        )}>
          {template.name}
        </h3>
      </div>
    </button>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col overflow-hidden no-print shrink-0">
      {/* Profile Selector */}
      <div className="p-4 border-b border-gray-200 bg-blue-50/30 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Your Profile</h2>
          <button 
            onClick={handleOptimizeStructure}
            className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md font-bold hover:bg-blue-700 transition-colors"
            title="Auto-reorder sections based on your profile"
          >
            <Sparkles className="w-3 h-3" />
            Magic Reorder
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Target Occupation</label>
            <input 
              type="text" 
              value={metadata.targetOccupation || ''} 
              onChange={(e) => updateMetadata({ targetOccupation: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Experience Level</label>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              {EXPERIENCE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => updateMetadata({ experienceLevel: level })}
                  className={cn(
                    "text-[9px] px-2 py-1 rounded-full border transition-all whitespace-nowrap capitalize",
                    metadata.experienceLevel === level 
                      ? "bg-blue-600 border-blue-600 text-white font-bold" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-gray-100">
        
        {/* Search */}
        <div className="p-3 bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search all templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border-none rounded-md text-[11px] focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {searchQuery ? (
          <div className="p-4 grid grid-cols-2 gap-3">
            {filteredTemplates.map(renderTemplateCard)}
          </div>
        ) : (
          <>
            {recommended.length > 0 && (
              <section className="p-4 bg-gradient-to-b from-blue-50/50 to-white">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <h2 className="text-sm font-bold text-gray-900">Recommended for You</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {recommended.map(renderTemplateCard)}
                </div>
              </section>
            )}

            <section className="p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Shield className="w-4 h-4 text-green-600" />
                <h2 className="text-sm font-bold text-gray-900">ATS Optimized</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {atsTemplates.map(renderTemplateCard)}
              </div>
            </section>

            <section className="p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Palette className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-gray-900">Creative & Bold</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {creativeTemplates.map(renderTemplateCard)}
              </div>
            </section>

            {/* General Categories */}
            {['Professional', 'Executive', 'Academic', 'Developer'].map(cat => (
              <section key={cat} className="p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  {CATEGORY_ICONS[cat]}
                  <h2 className="text-sm font-bold text-gray-900">{cat}</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {templates.filter(t => t.category === cat).map(renderTemplateCard)}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
