import React, { useMemo } from 'react';
import { THEME_REGISTRY } from '../../themes/registry';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';
import { Check, Palette, Sparkles, Moon, Sun } from 'lucide-react';

const CATEGORIES = ['All', 'Minimal', 'Tech', 'Corporate', 'Creative', 'Academic'];

interface ThemeGalleryProps {
  onEdit: () => void;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({ onEdit }) => {
  const activeThemeId = useResumeStore((state) => state.resume.metadata.themeId);
  const setThemeId = useResumeStore((state) => state.setThemeId);
  const [activeCategory, setActiveCategory] = React.useState('All');

  const themes = useMemo(() => Object.values(THEME_REGISTRY), []);
  const filteredThemes = useMemo(() => 
    activeCategory === 'All' ? themes : themes.filter(t => t.category === activeCategory),
    [themes, activeCategory]
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col overflow-hidden no-print shrink-0">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <Palette className="w-5 h-5 text-purple-600" />
          <span>Themes</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Change colors, fonts and visual styles instantly.</p>
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 shrink-0 bg-white">
        <div className="flex overflow-x-auto p-2 gap-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                activeCategory === cat 
                  ? "bg-purple-100 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {filteredThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setThemeId(theme.id)}
            className={cn(
              "w-full group text-left relative transition-all duration-200 p-3 bg-white border rounded-xl shadow-sm hover:shadow-md",
              activeThemeId === theme.id ? "ring-2 ring-purple-500 border-purple-200" : "border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">{theme.name}</span>
              <div className="flex items-center gap-2">
                {theme.mode === 'dark' ? <Moon className="w-3 h-3 text-gray-400" /> : <Sun className="w-3 h-3 text-gray-400" />}
                {activeThemeId === theme.id && <Check className="w-4 h-4 text-purple-600" />}
              </div>
            </div>

            {/* Preview Strip */}
            <div className="flex h-8 rounded-lg overflow-hidden border border-gray-100 mb-2">
               <div className="flex-1" style={{ backgroundColor: theme.colors.background }} />
               <div className="w-4" style={{ backgroundColor: theme.colors.primary }} />
               <div className="w-4" style={{ backgroundColor: theme.colors.accent }} />
               <div className="w-4" style={{ backgroundColor: theme.colors.textPrimary }} />
            </div>

            <div className="flex items-center gap-2">
               <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{theme.category}</span>
               <div className="h-1 w-1 rounded-full bg-gray-200" />
               <span className="text-[10px] text-gray-500 truncate" style={{ fontFamily: theme.typography.headingFont }}>
                 {theme.typography.headingFont.split(',')[0]}
               </span>
            </div>
          </button>
        ))}
      </div>

      {/* Manual Customization Shortcut */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button 
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Custom Theme Editor
        </button>
      </div>
    </div>
  );
};
