import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Type, Image, LayoutGrid, Award, BarChart, Plus, GripVertical } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import type { Block } from '../../types/resume';

const ELEMENT_CATEGORIES = [
  { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
  { id: 'visuals', icon: <BarChart className="w-4 h-4" />, label: 'Visuals' },
  { id: 'media', icon: <Image className="w-4 h-4" />, label: 'Media' },
  { id: 'structure', icon: <LayoutGrid className="w-4 h-4" />, label: 'Layout' },
  { id: 'badges', icon: <Award className="w-4 h-4" />, label: 'Badges' },
];

const generateId = () => `block-${Math.random().toString(36).substr(2, 9)}`;

const PRESET_ELEMENTS: Record<string, { label: string; generate: () => Block }[]> = {
  text: [
    { label: 'Paragraph', generate: () => ({ id: generateId(), type: 'text', data: { content: 'Add your text here...', variant: 'p' } }) },
    { label: 'Heading 1', generate: () => ({ id: generateId(), type: 'text', data: { content: 'Heading 1', variant: 'h1' } }) },
    { label: 'Section Title', generate: () => ({ id: generateId(), type: 'section', data: { title: 'NEW SECTION' } }) },
  ],
  visuals: [
    { label: 'Skill Chart (Bar)', generate: () => ({ id: generateId(), type: 'skill_chart', data: { skills: [{name: 'React', level: 80}, {name: 'Node', level: 70}], chartType: 'bar' } }) },
    { label: 'Skill Chart (Dots)', generate: () => ({ id: generateId(), type: 'skill_chart', data: { skills: [{name: 'Figma', level: 90}], chartType: 'dots' } }) },
  ],
  media: [
    { label: 'Profile Photo', generate: () => ({ id: generateId(), type: 'photo', data: { url: '', shape: 'circle' } }) },
    { label: 'QR Code', generate: () => ({ id: generateId(), type: 'qr_code', data: { url: 'https://example.com' } }) },
  ],
  structure: [
    { label: '2 Columns', generate: () => ({ id: generateId(), type: 'columns', data: { columns: 2, columnsData: [[], []] } }) },
    { label: 'Experience Item', generate: () => ({ id: generateId(), type: 'experience_item', data: { company: 'Company', role: 'Role', location: 'Location', startDate: 'Start', endDate: 'End', description: 'Description' } }) },
  ],
  badges: [
    { label: 'Solid Badge', generate: () => ({ id: generateId(), type: 'badge', data: { text: 'Certified', style: 'solid' } }) },
    { label: 'Social Links', generate: () => ({ id: generateId(), type: 'social_links', data: { displayMode: 'icon-text', links: [{platform: 'github', url: '#', handle: '@username'}] } }) },
  ]
};

export const ElementSidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('text');
  const insertBlock = useResumeStore(state => state.insertBlock);

  const handleAdd = (generate: () => Block) => {
    // In a full implementation, we'd use drag-and-drop to place this accurately.
    // For now, click-to-add appends to the bottom.
    const newBlock = generate();
    insertBlock(newBlock);
  };

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 h-full flex flex-col no-print shrink-0 z-30 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-gray-200 bg-white shrink-0">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5 text-purple-600" />
          <span>Add Elements 22</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Drag or click to add to resume.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Categories Tab */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-2 gap-2 overflow-y-auto shrink-0">
          {ELEMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "p-3 rounded-xl flex flex-col items-center gap-1 transition-all",
                activeCategory === cat.id ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
              title={cat.label}
            >
              {cat.icon}
              <span className="text-[9px] font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Elements List */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          <div className="space-y-2">
            {PRESET_ELEMENTS[activeCategory]?.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleAdd(preset.generate)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group"
              >
                <span className="text-sm font-medium text-gray-700">{preset.label}</span>
                <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-purple-400 cursor-grab" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
