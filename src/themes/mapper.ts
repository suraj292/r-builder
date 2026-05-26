import type { ThemeTokens } from '../types/theme';

/**
 * Maps ThemeTokens to a React.CSSProperties object containing CSS Variables.
 */
export function themeToCssVariables(theme: ThemeTokens, overrides?: Partial<ThemeTokens>): React.CSSProperties {
  const t = {
    ...theme,
    ...overrides,
    colors: { ...theme.colors, ...overrides?.colors },
    typography: { ...theme.typography, ...overrides?.typography },
    spacing: { ...theme.spacing, ...overrides?.spacing },
    visuals: { ...theme.visuals, ...overrides?.visuals },
  };

  return {
    // Colors
    '--theme-primary': t.colors.primary,
    '--theme-secondary': t.colors.secondary,
    '--theme-accent': t.colors.accent,
    '--theme-bg': t.colors.background,
    '--theme-surface': t.colors.surface,
    '--theme-text-primary': t.colors.textPrimary,
    '--theme-text-secondary': t.colors.textSecondary,
    '--theme-border': t.colors.border,

    // Typography
    '--theme-font-heading': t.typography.headingFont,
    '--theme-font-body': t.typography.bodyFont,
    '--theme-font-mono': t.typography.monoFont,
    '--theme-font-scale': t.typography.baseScale.toString(),

    // Spacing
    '--theme-page-padding': t.spacing.pagePadding,
    '--theme-section-gap': t.spacing.sectionGap,
    '--theme-item-gap': t.spacing.itemGap,

    // Visuals
    '--theme-radius': t.visuals.borderRadius,
    '--theme-shadow': t.visuals.shadow,
    '--theme-divider-style': t.visuals.dividerStyle,
  } as React.CSSProperties;
}
