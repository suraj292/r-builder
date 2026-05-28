import { useCallback } from 'react';
import { useResumeStore } from '../store/useResumeStore';

export const usePagination = () => {
  const layout = useResumeStore((state) => state.resume.layout);
  const templateId = useResumeStore((state) => state.resume.metadata.templateId);
  const setPages = useResumeStore((state) => state.setPages);

  const handleMeasure = useCallback((heights: Record<string, number>, usableHeight: number) => {
    const stringLayout = layout.filter((item): item is string => typeof item === 'string');
    
    if (stringLayout.length === 0 || Object.keys(heights).length === 0) {
      return;
    }

    const pages: string[][] = [[]];
    let currentHeight = 0;
    let currentPageIndex = 0;

    // Use a conservative buffer for section gaps (approx 1.5rem = 24px)
    const SECTION_GAP = 24; 

    for (const blockId of stringLayout) {
      const height = (heights[blockId] || 0);
      
      // If block itself is taller than the whole page, we must include it anyway 
      // otherwise it will be lost or cause infinite loop.
      // Ideally we should split the block, but for now we just force it on its own page.
      if (currentHeight + height > usableHeight && currentHeight > 0) {
        currentPageIndex++;
        pages[currentPageIndex] = [blockId];
        currentHeight = height + SECTION_GAP;
      } else {
        pages[currentPageIndex].push(blockId);
        currentHeight += height + SECTION_GAP;
      }
    }

    // Only update state if pagination actually changed to prevent render loops
    setPages(pages);
  }, [layout, setPages]);

  return { handleMeasure };
};
