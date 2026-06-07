import { useResumeStore } from '../../store/useResumeStore';
import type { ColumnsBlock as ColumnsBlockType } from '../../types/resume';
import { BlockRenderer } from './BlockRenderer';

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as ColumnsBlockType;
  
  if (!block || block.type !== 'columns') return null;

  const { columns, ratio, gap, columnsData } = block.data;
  
  // Calculate grid template based on ratio (e.g. "1:2")
  let gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  if (ratio) {
    const parts = ratio.split(':').map(Number);
    if (parts.length === columns && parts.every(p => !isNaN(p))) {
      gridTemplateColumns = parts.map(p => `${p}fr`).join(' ');
    }
  }

  return (
    <div 
      className="w-full grid"
      style={{ 
        gridTemplateColumns,
        gap: gap || 'var(--section-gap)',
      }}
    >
      {columnsData.map((columnBlockIds, colIndex) => (
        <div key={colIndex} className="flex flex-col min-h-[50px] border border-transparent hover:border-gray-200/50 rounded-lg p-1 transition-colors" style={{ gap: 'var(--item-gap)' }}>
          {columnBlockIds.length === 0 && (
             <div className="flex-1 flex items-center justify-center text-[10px] text-gray-300 font-medium bg-gray-50/50 rounded border border-dashed border-gray-200">
               Empty Column
             </div>
          )}
          {columnBlockIds.map(childId => (
            <BlockRenderer key={childId} id={childId} />
          ))}
        </div>
      ))}
    </div>
  );
};