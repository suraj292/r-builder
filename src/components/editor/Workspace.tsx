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
import { LayoutTemplate, PlusSquare, Palette } from 'lucide-react';

import { useEditorStore } from '../../store/useEditorStore';

const AIOptimizerSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-gray-200 bg-white shrink-0">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>AI Optimizer</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Tailor your resume with AI assistance.</p>
      </div>
      
      <div className="p-4 space-y-8 overflow-y-auto">
        {/* Upload Resume Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-500" />
            Upload Existing Resume
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Click to upload</p>
              <p className="text-xs text-gray-500">PDF or DOCX (Max 5MB)</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-center italic">
            * Our AI will extract your details to populate the builder.
          </p>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Job Description Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            Job Description
          </label>
          <textarea 
            className="w-full h-48 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50 text-gray-700"
            placeholder="Paste the target job description here..."
          />
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md group">
            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Analyze & Match
          </button>
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
              {pages.map((blockIds, index) => (
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
