import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { A4Page } from './A4Page';
import { ZoomIn, ZoomOut, Download, Undo, Redo, Share2, Sparkles, Wand2, Upload, FileText } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import { TemplateGallery } from './TemplateGallery';
import { ElementSidebar } from './ElementSidebar';
import { ThemeGallery } from './ThemeGallery';
import { ThemeEditor } from './ThemeEditor';
import { MeasuringCanvas } from './MeasuringCanvas';
import { cn } from '../../lib/utils';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { LayoutTemplate, PlusSquare, Palette, Briefcase, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

import { useEditorStore } from '../../store/useEditorStore';
import { useAIOptimizer } from '../../hooks/useAIOptimizer';

const PROFESSIONS = [
  'Software Developer',
  'Frontend Developer',
  'Backend Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Graphic Designer',
  'Data Scientist',
  'Accountant',
  'HR Manager',
  'Marketing Executive',
  'Student/Fresher'
];

const AIOptimizerSidebar: React.FC = () => {
  const {
    isUploading,
    isAnalyzing,
    isOptimizing,
    atsAnalysis,
    jobDescription,
    setJobDescription,
    targetProfession,
    setTargetProfession,
    handleUploadResume,
    handleAnalyzeATS,
    handleOptimizeResume
  } = useAIOptimizer();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadResume(e.target.files[0]);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-gray-200 bg-white shrink-0">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>AI Optimizer</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Parse, analyze, and optimize.</p>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto">
        
        {/* 1. Profession Detection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Briefcase className="w-3 h-3" /> Target Role
          </label>
          <select 
            value={targetProfession}
            onChange={(e) => setTargetProfession(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="h-px bg-gray-100" />

        {/* 2. Upload Resume Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Upload className="w-3 h-3" /> Auto-Parse Resume
          </label>
          <label className="relative border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group overflow-hidden">
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              className="hidden" 
              onChange={onFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
               <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs font-bold text-indigo-700">Parsing AI...</p>
               </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">Upload PDF/DOCX</p>
                  <p className="text-[10px] text-slate-500">Auto-fill builder instantly</p>
                </div>
              </>
            )}
          </label>
        </div>

        {/* 3. ATS Score Analysis */}
        {atsAnalysis && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
               <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                 <Activity className="w-3 h-3" /> ATS Score
               </label>
               <span className={cn("text-xs font-black", atsAnalysis.score >= 80 ? 'text-emerald-600' : 'text-amber-500')}>
                  {atsAnalysis.score}%
               </span>
            </div>
            
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", atsAnalysis.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500')} 
                  style={{ width: `${atsAnalysis.score}%` }} 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col">
                   <span className="text-[9px] font-bold text-slate-400 uppercase">Readability</span>
                   <span className="text-sm font-black text-slate-700">{atsAnalysis.readability}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col">
                   <span className="text-[9px] font-bold text-slate-400 uppercase">Kw Density</span>
                   <span className="text-sm font-black text-slate-700">{atsAnalysis.keywordDensity}%</span>
                </div>
            </div>

            {atsAnalysis.missingKeywords.length > 0 && (
                <div className="mt-3">
                    <p className="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Missing Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {atsAnalysis.missingKeywords.slice(0, 5).map(kw => (
                            <span key={kw} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold border border-amber-200">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}

        <div className="h-px bg-gray-100" />

        {/* 4. Job Description & Optimization */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <FileText className="w-3 h-3" /> Job Target Matching
          </label>
          <textarea 
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            className="w-full h-32 p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50 text-slate-700"
            placeholder="Paste job description here to optimize against..."
          />
          
          <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => handleAnalyzeATS()}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                Quick Scan
              </button>
              
              <button 
                onClick={handleOptimizeResume}
                disabled={isOptimizing || !jobDescription.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md group disabled:opacity-50 disabled:grayscale"
              >
                {isOptimizing ? (
                    <Wand2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        AI Auto-Optimize
                    </>
                )}
              </button>
          </div>
          <p className="text-[9px] text-slate-400 text-center leading-tight">
             Optimization will rewrite summary, improve bullet points, and inject missing keywords based on target JD.
          </p>
        </div>
      </div>
    </div>
  );
};

export const Workspace: React.FC = () => {
  const pages = useResumeStore((state) => state.pages);
  const moveBlock = useResumeStore((state) => state.moveBlock);
  const layout = useResumeStore((state) => state.resume.layout);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const setSelectedBlock = useEditorStore((state) => state.setSelectedBlock);
  
  const [activeSidebar, setActiveSidebar] = useState<'templates' | 'elements' | 'themes' | 'theme-editor' | 'optimizer'>('elements');
  
  const { handleMeasure } = usePagination();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newIndex = layout.indexOf(over.id as string);
      moveBlock(active.id as string, newIndex);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 1.5));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <MeasuringCanvas onMeasure={handleMeasure} />
      
      {/* Top Toolbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-xl text-blue-600">ResuMaker</h1>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-md transition-all text-gray-600"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold w-12 text-center text-gray-700">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-md transition-all text-gray-600"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500" title="Undo">
              <Undo className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500" title="Redo">
              <Redo className="w-5 h-5" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 z-30 shrink-0 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] relative">
          <button 
            onClick={() => setActiveSidebar('elements')}
            className={cn("p-2.5 rounded-xl transition-all", activeSidebar === 'elements' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-50')}
            title="Add Elements"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveSidebar('templates')}
            className={cn("p-2.5 rounded-xl transition-all", activeSidebar === 'templates' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-50')}
            title="Templates"
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveSidebar('themes')}
            className={cn("p-2.5 rounded-xl transition-all", activeSidebar === 'themes' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:bg-gray-50')}
            title="Themes"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveSidebar('optimizer')}
            className={cn("p-2.5 rounded-xl transition-all", activeSidebar === 'optimizer' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-50')}
            title="AI Optimizer"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        {/* Active Sidebar */}
        <div className="shrink-0 flex h-full z-20">
          {activeSidebar === 'templates' && <TemplateGallery />}
          {activeSidebar === 'elements' && <ElementSidebar />}
          {activeSidebar === 'themes' && <ThemeGallery onEdit={() => setActiveSidebar('theme-editor')} />}
          {activeSidebar === 'theme-editor' && <ThemeEditor onBack={() => setActiveSidebar('themes')} />}
          {activeSidebar === 'optimizer' && <AIOptimizerSidebar />}
        </div>

        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-auto p-10 flex flex-col items-center bg-gray-100/50"
          onClick={() => setSelectedBlock(null)}
        >
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              {(pages || []).map((blockIds, index) => (
                <A4Page key={index} blockIds={blockIds} pageIndex={index} />
              ))}
            </div>
          </DndContext>
        </main>
      </div>
      
      {/* Quick Add / Floating Sidebar (Optional) */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 bg-white p-3 shadow-xl border border-gray-200 rounded-2xl flex flex-col gap-4 z-30">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs cursor-help" title="Add Blocks">
          +
        </div>
        {/* We can add more icons here for quick block addition */}
      </aside>
    </div>
  );
};
