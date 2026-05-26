export type ThemeCategory = 'Minimal' | 'Tech' | 'Corporate' | 'Creative' | 'Academic';
export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  id: string;
  name: string;
  category: ThemeCategory;
  mode: ThemeMode;

  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };

  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    baseScale: number; // 1 = 100%
  };

  spacing: {
    pagePadding: string;
    sectionGap: string;
    itemGap: string;
  };

  visuals: {
    borderRadius: string;
    shadow: string;
    dividerStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  };
}
