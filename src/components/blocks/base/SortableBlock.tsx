import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useEditorStore } from '../../../store/useEditorStore';
import { FloatingToolbar } from '../../editor/FloatingToolbar';

interface SortableBlockProps {
  id: string;
  children: React.ReactNode;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({ id, children }) => {
  const selectedBlockId = useEditorStore(state => state.selectedBlockId);
  const setSelectedBlock = useEditorStore(state => state.setSelectedBlock);
  const isSelected = selectedBlockId === id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging || isSelected ? 50 : 'auto',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBlock(id);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={handleClick}
      className={cn(
        "group relative transition-all",
        isDragging && "opacity-50 ring-2 ring-blue-500 rounded-lg shadow-xl",
        isSelected && !isDragging && "ring-2 ring-blue-400 rounded-md"
      )}
    >
      {isSelected && <FloatingToolbar id={id} />}

      {/* Interaction layer - handles and buttons */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 print:hidden">
        <div 
          {...attributes} 
          {...listeners} 
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 print:hidden">
        <button className="p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-md transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 hover:text-gray-700 text-gray-400 rounded-md transition-all">
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {children}
    </div>
  );
};
