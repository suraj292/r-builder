import React, { Suspense } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { BlockRegistry } from './registry';

interface BlockRendererProps {
  id: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ id }) => {
  const block = useResumeStore((state) => state.resume.blocks[id]);

  if (!block) return null;

  const Component = BlockRegistry[block.type];

  if (!Component) {
    return (
      <div className="p-4 bg-red-50 text-red-500 border border-red-200 rounded">
        Error: Block type "{block.type}" not found in registry.
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded" />}>
      <div 
        data-block-id={id}
        style={block.customStyles as React.CSSProperties}
      >
        <Component id={id} {...block.data} />
      </div>
    </Suspense>
  );
};
