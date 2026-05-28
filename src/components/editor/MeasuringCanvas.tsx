import React, { useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { templateToCssVariables } from '../../templates/mapper';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { cn } from '../../lib/utils';

interface MeasuringCanvasProps {
  onMeasure: (heights: Record<string, number>, pageHeight: number) => void;
}

export const MeasuringCanvas: React.FC<MeasuringCanvasProps> = ({ onMeasure }) => {
  const layout = useResumeStore((state) => state.resume.layout);
  const metadata = useResumeStore((state) => state.resume.metadata);
  const templateId = metadata.templateId;
  const designOverrides = metadata.designOverrides;
  const template = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['modern-professional'];
  const cssVars = templateToCssVariables(template);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (!containerRef.current) return;
      
      const heights: Record<string, number> = {};
      
      // Get all child nodes that represent blocks
      const blockNodes = containerRef.current.querySelectorAll('[data-measure-id]');
      blockNodes.forEach((node) => {
        const id = node.getAttribute('data-measure-id');
        if (id) {
          // Use getBoundingClientRect for exact sub-pixel measurements
          heights[id] = (node as HTMLElement).getBoundingClientRect().height;
        }
      });

      // Calculate usable page height (A4 height - padding)
      // Standard A4 at 96dpi is roughly 1122.5px height.
      // We will measure the container's height constraint.
      const A4_HEIGHT_PX = 1122.5; 
      
      // We need to extract padding-top and padding-bottom from the template spacing
      // It's usually something like '20mm'. Let's let the browser compute it.
      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      
      const usableHeight = A4_HEIGHT_PX - paddingTop - paddingBottom;

      onMeasure(heights, usableHeight);
    };

    // Use ResizeObserver to detect any changes in block sizes (e.g. typing)
    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(containerRef.current);

    // Initial measure
    // Timeout helps ensure fonts/images are loaded for initial measure
    const timeoutId = setTimeout(measure, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [layout, templateId, designOverrides, onMeasure]);

  return (
    <div 
      className="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0 z-[-9999]"
      aria-hidden="true"
    >
      <div 
        ref={containerRef}
        className={cn(
          "w-[210mm] bg-white",
          `layout-${template.layout.type}`
        )}
        style={{
          padding: template.spacing.pagePadding,
          fontFamily: template.typography.bodyFont,
          ...cssVars
        }}
      >
        <div 
          className={cn(
            "flex flex-col flex-1", 
            template.layout.type === 'two-column' && "lg:flex-row gap-8"
          )}
          style={{ gap: template.spacing.sectionGap }}
        >
           {(layout || []).map((id) => {
             if (typeof id !== 'string') return null;
             return (
               <div key={id} data-measure-id={id}>
                 <BlockRenderer id={id} />
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};
