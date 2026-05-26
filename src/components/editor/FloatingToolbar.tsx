import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { AlignLeft, AlignCenter, AlignRight, Trash, PaintBucket } from 'lucide-react';
import type { ElementStyles } from '../../types/resume';

interface FloatingToolbarProps {
  id: string;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ id }) => {
  const block = useResumeStore(state => state.resume.blocks[id]);
  const updateBlock = useResumeStore(state => state.updateBlock);
  const deleteBlock = useResumeStore(state => state.deleteBlock);

  if (!block) return null;

  const currentStyles = block.customStyles || {};

  const handleStyleChange = (updates: Partial<ElementStyles>) => {
    updateBlock(id, { ...block.data } as any); // trigger update
    // We need to update customStyles specifically. Let's write a small workaround 
    // or add `updateBlockStyle` action. For now we will update via the store action we'll add.
    useResumeStore.setState(state => {
      if (state.resume.blocks[id]) {
        state.resume.blocks[id].customStyles = {
          ...(state.resume.blocks[id].customStyles || {}),
          ...updates
        };
        state.resume.metadata.updatedAt = Date.now();
      }
    });
  };

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-1 rounded-lg shadow-xl flex items-center gap-1 z-50 animate-in fade-in zoom-in-95 duration-100">
      
      {/* Colors */}
      <div className="flex items-center border-r border-gray-700 pr-1 mr-1">
        <label className="p-1.5 hover:bg-gray-700 rounded cursor-pointer relative" title="Text Color">
          <input 
            type="color" 
            value={currentStyles.color || '#000000'}
            onChange={(e) => handleStyleChange({ color: e.target.value })}
            className="absolute opacity-0 w-full h-full cursor-pointer"
          />
          <div className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: currentStyles.color || 'var(--text-color)' }} />
        </label>
        
        <label className="p-1.5 hover:bg-gray-700 rounded cursor-pointer relative" title="Background Color">
          <input 
            type="color" 
            value={currentStyles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
            className="absolute opacity-0 w-full h-full cursor-pointer"
          />
          <PaintBucket className="w-4 h-4 text-gray-300" />
        </label>
      </div>

      {/* Alignment */}
      <div className="flex items-center border-r border-gray-700 pr-1 mr-1">
        <button 
          onClick={() => handleStyleChange({ textAlign: 'left' })}
          className={`p-1.5 rounded ${currentStyles.textAlign === 'left' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleStyleChange({ textAlign: 'center' })}
          className={`p-1.5 rounded ${currentStyles.textAlign === 'center' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleStyleChange({ textAlign: 'right' })}
          className={`p-1.5 rounded ${currentStyles.textAlign === 'right' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Box Model */}
      <div className="flex items-center gap-1 border-r border-gray-700 pr-1 mr-1">
        <input 
          type="text" 
          placeholder="Pad" 
          value={currentStyles.padding || ''}
          onChange={(e) => handleStyleChange({ padding: e.target.value })}
          className="w-12 bg-gray-800 text-xs px-1 py-1 rounded border border-gray-700 focus:border-blue-500 outline-none"
          title="Padding (e.g. 1rem)"
        />
        <input 
          type="text" 
          placeholder="Rad" 
          value={currentStyles.borderRadius || ''}
          onChange={(e) => handleStyleChange({ borderRadius: e.target.value })}
          className="w-12 bg-gray-800 text-xs px-1 py-1 rounded border border-gray-700 focus:border-blue-500 outline-none"
          title="Border Radius (e.g. 8px)"
        />
      </div>

      {/* Actions */}
      <button 
        onClick={() => deleteBlock(id)}
        className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded"
        title="Delete Element"
      >
        <Trash className="w-4 h-4" />
      </button>

    </div>
  );
};
