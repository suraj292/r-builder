import React from 'react';
import { cn } from '../../lib/utils';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlock } from '../blocks/base/SortableBlock';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { useResumeStore } from '../../store/useResumeStore';
import { templateToCssVariables } from '../../templates/mapper';
import { THEME_REGISTRY } from '../../themes/registry';
import { themeToCssVariables } from '../../themes/mapper';

interface A4PageProps {
  blockIds: string[];
  pageIndex: number;
}

export const A4Page: React.FC<A4PageProps> = ({ blockIds, pageIndex }) => {
  const templateId = useResumeStore((state) => state.resume.metadata.templateId);
  const themeId = useResumeStore((state) => state.resume.metadata.themeId);
  const designOverrides = useResumeStore((state) => state.resume.metadata.designOverrides);
  
  const template = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['modern-professional'];
  const theme = THEME_REGISTRY[themeId] || THEME_REGISTRY['clean-white'];
  
  const layoutVars = templateToCssVariables(template);
  const themeVars = themeToCssVariables(theme, designOverrides);
  const layout = template.layout;

  const renderContent = () => {
    // For now, if it's a grid/timeline/two-column, we'll just render it with a CSS class indicator
    // A fully independent multi-column drag-and-drop requires multiple SortableContexts.
    // We will render it as a single flow for simplicity, but apply layout-specific classes.
    return (
      <div 
        className={cn(
          "flex flex-col flex-1", 
          layout.type === 'two-column' && "lg:flex-row gap-8"
        )}
        style={{ gap: template.spacing.sectionGap }}
      >
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {blockIds.map((id) => (
            <SortableBlock key={id} id={id}>
              <BlockRenderer id={id} />
            </SortableBlock>
          ))}
        </SortableContext>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "bg-white shadow-2xl mx-auto mb-10 overflow-hidden relative print:shadow-none print:mb-0",
        "w-[210mm] h-[297mm]",
        `layout-${layout.type}`,
        theme.mode === 'dark' ? 'dark-theme' : 'light-theme'
      )}
      style={{
        padding: template.spacing.pagePadding,
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.bodyFont,
        ...layoutVars,
        ...themeVars
      }}
    >
      {renderContent()}
      
      {/* Page Number (Hidden in print if desired) */}
      <div className="absolute bottom-4 right-8 text-xs text-gray-400 print:hidden">
        Page {pageIndex + 1}
      </div>
    </div>
  );
};
