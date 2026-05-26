import { useCallback } from 'react';
import { useResumeStore } from '../store/useResumeStore';

export const usePagination = () => {
  const layout = useResumeStore((state) => state.resume.layout);
  const setPages = useResumeStore((state) => state.setPages);

  const handleMeasure = useCallback((heights: Record<string, number>, usableHeight: number) => {
    const stringLayout = layout.filter((item): item is string => typeof item === 'string');
    
    // Safety check: if layout is empty or heights haven't resolved yet
    if (stringLayout.length === 0 || Object.keys(heights).length === 0) {
      return;
    }

    const pages: string[][] = [[]];
    let currentHeight = 0;
    let currentPageIndex = 0;

    for (const blockId of stringLayout) {
      // In a flex/grid layout with gap, we should ideally account for the gap here.
      // We will add a hardcoded gap buffer for safety based on average section-gap (e.g. 24px)
      // A more robust engine would measure elements INCLUDING their bottom margin.
      const GAP_BUFFER = 24; 
      const height = (heights[blockId] || 0) + GAP_BUFFER;
      
      if (currentHeight + height > usableHeight && currentHeight > 0) {
        // Overflow! Move to next page
        currentPageIndex++;
        pages[currentPageIndex] = [blockId];
        currentHeight = height;
      } else {
        pages[currentPageIndex].push(blockId);
        currentHeight += height;
      }
    }

    setPages(pages);
  }, [layout, setPages]);

  return { handleMeasure };
};
