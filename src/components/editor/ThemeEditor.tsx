import React from 'react';
import { THEME_REGISTRY } from '../../themes/registry';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';
import { ArrowLeft, Type, Palette, Layout, Sliders } from 'lucide-react';

const FONTS = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Lora (Serif)', value: 'Lora, Georgia, serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
];

interface ThemeEditorProps {
  onBack: () => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ onBack }) => {
  const metadata = useResumeStore((state) => state.resume.metadata);
  const updateDesignOverrides = useResumeStore((state) => state.updateDesignOverrides);
  const updateMetadata = useResumeStore((state) => state.updateMetadata);

  const activeThemeId = metadata.themeId;
  const theme = THEME_REGISTRY[activeThemeId] || THEME_REGISTRY['clean-white'];
  const overrides = metadata.designOverrides || {};

  const handleReset = () => {
    updateMetadata({ designOverrides: {} });
  };

  const updateColor = (key: string, value: string) => {
    updateDesignOverrides({ colors: { [key]: value } as any });
  };

  const updateTypography = (key: string, value: any) => {
    updateDesignOverrides({ typography: { [key]: value } as any });
  };

  const updateSpacing = (key: string, value: string) => {
    updateDesignOverrides({ spacing: { [key]: value } as any });
  };

  const updateVisual = (key: string, value: string) => {
    updateDesignOverrides({ visuals: { [key]: value } as any });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col overflow-hidden no-print shrink-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 hover:bg-gray-200 rounded-md transition-all">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-900 text-lg">Custom Theme</h2>
        </div>
        <button 
          onClick={handleReset}
          className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
          title="Reset all overrides"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        
        {/* Colors Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Colors</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 font-medium">Primary</label>
              <input 
                type="color" 
                value={overrides.colors?.primary || theme.colors.primary} 
                onChange={(e) => updateColor('primary', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 font-medium">Accent</label>
              <input 
                type="color" 
                value={overrides.colors?.accent || theme.colors.accent} 
                onChange={(e) => updateColor('accent', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 font-medium">Background</label>
              <input 
                type="color" 
                value={overrides.colors?.background || theme.colors.background} 
                onChange={(e) => updateColor('background', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 overflow-hidden shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Typography</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold">Heading Font</label>
              <select 
                value={overrides.typography?.headingFont || theme.typography.headingFont}
                onChange={(e) => updateTypography('headingFont', e.target.value)}
                className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold">Body Font</label>
              <select 
                value={overrides.typography?.bodyFont || theme.typography.bodyFont}
                onChange={(e) => updateTypography('bodyFont', e.target.value)}
                className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold flex justify-between">
                <span>Font Scale</span>
                <span className="text-blue-600">{(overrides.typography?.baseScale || theme.typography.baseScale).toFixed(2)}x</span>
              </label>
              <input 
                type="range" 
                min="0.7" 
                max="1.3" 
                step="0.05"
                value={overrides.typography?.baseScale || theme.typography.baseScale}
                onChange={(e) => updateTypography('baseScale', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </section>

        {/* Spacing & Density */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4 text-green-600" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Density</h3>
          </div>
          <div className="space-y-4">
             <div>
               <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold flex justify-between">
                 <span>Section Gap</span>
               </label>
               <div className="grid grid-cols-3 gap-2">
                 {['0.75rem', '1.5rem', '2.5rem'].map((gap, i) => (
                   <button 
                     key={i}
                     onClick={() => updateSpacing('sectionGap', gap)}
                     className={cn(
                       "text-[10px] py-2 rounded-lg border transition-all",
                       (overrides.spacing?.sectionGap || theme.spacing.sectionGap) === gap
                        ? "bg-green-600 border-green-600 text-white font-bold"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                     )}
                   >
                     {i === 0 ? 'Compact' : i === 1 ? 'Normal' : 'Spacious'}
                   </button>
                 ))}
               </div>
             </div>
             <div>
               <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold flex justify-between">
                 <span>Page Padding</span>
               </label>
               <select 
                 value={overrides.spacing?.pagePadding || theme.spacing.pagePadding}
                 onChange={(e) => updateSpacing('pagePadding', e.target.value)}
                 className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
               >
                 <option value="10mm">Minimal (10mm)</option>
                 <option value="15mm">Narrow (15mm)</option>
                 <option value="20mm">Standard (20mm)</option>
                 <option value="30mm">Wide (30mm)</option>
               </select>
             </div>
          </div>
        </section>

        {/* Visuals Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visual Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5 uppercase font-semibold">Border Radius</label>
              <div className="grid grid-cols-4 gap-2">
                {['0', '0.375rem', '0.75rem', '1.5rem'].map((r, i) => (
                   <button 
                     key={i}
                     onClick={() => updateVisual('borderRadius', r)}
                     className={cn(
                       "h-8 rounded-lg border transition-all flex items-center justify-center overflow-hidden bg-white",
                       (overrides.visuals?.borderRadius || theme.visuals.borderRadius) === r
                        ? "ring-2 ring-orange-500 border-orange-200"
                        : "border-gray-200 hover:bg-gray-50"
                     )}
                   >
                     <div className="w-4 h-4 bg-gray-200" style={{ borderRadius: r }} />
                   </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
