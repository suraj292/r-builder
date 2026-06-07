import type { ResumeTemplate } from '../types/template';

export function templateToCssVariables(template: ResumeTemplate): React.CSSProperties {
  return {
    '--primary-color': template.colors.primary,
    '--secondary-color': template.colors.secondary,
    '--text-color': template.colors.text,
    '--text-light': template.colors.textLight,
    '--bg-color': template.colors.background,
    '--accent-color': template.colors.accent,
    '--border-color': template.colors.border,
    
    '--heading-font': template.typography.headingFont,
    '--body-font': template.typography.bodyFont,
    
    '--page-padding': template.spacing.pagePadding,
    '--section-gap': template.spacing.sectionGap,
    '--item-gap': template.spacing.blockGap,
    
    '--section-title-style': template.blocks.sectionStyle,
    '--section-title-border-bottom': template.blocks.sectionBorder === 'bottom' ? `2px solid ${template.colors.primary}` : 'none',
    '--section-title-border-all': template.blocks.sectionBorder === 'all' ? `1px solid ${template.colors.border}` : 'none',
    '--section-title-padding': template.blocks.sectionBorder === 'all' ? '8px 12px' : '0 0 4px 0',
    
    '--header-alignment': template.blocks.headerAlignment,
    
    // Can map scale to actual sizes later if needed
    '--font-scale-base': template.typography.scale === 'small' ? '0.875rem' : template.typography.scale === 'large' ? '1.125rem' : '1rem',
  } as React.CSSProperties;
}
