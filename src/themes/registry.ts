import type { ThemeTokens } from '../types/theme';

const FONTS = {
  sans: 'Inter, system-ui, sans-serif',
  serif: 'Lora, Georgia, serif',
  mono: 'JetBrains Mono, monospace',
  geometric: 'Poppins, sans-serif',
};

export const THEME_REGISTRY: Record<string, ThemeTokens> = {
  'clean-white': {
    id: 'clean-white',
    name: 'Clean White',
    category: 'Minimal',
    mode: 'light',
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
    typography: {
      headingFont: FONTS.sans,
      bodyFont: FONTS.sans,
      monoFont: FONTS.mono,
      baseScale: 1,
    },
    spacing: {
      pagePadding: '20mm',
      sectionGap: '1.5rem',
      itemGap: '0.75rem',
    },
    visuals: {
      borderRadius: '0.375rem',
      shadow: 'none',
      dividerStyle: 'solid',
    },
  },

  'vs-code-dark': {
    id: 'vs-code-dark',
    name: 'VS Code Dark',
    category: 'Tech',
    mode: 'dark',
    colors: {
      primary: '#007acc',
      secondary: '#cccccc',
      accent: '#ce9178',
      background: '#1e1e1e',
      surface: '#252526',
      textPrimary: '#d4d4d4',
      textSecondary: '#858585',
      border: '#3e3e42',
    },
    typography: {
      headingFont: FONTS.mono,
      bodyFont: FONTS.sans,
      monoFont: FONTS.mono,
      baseScale: 0.95,
    },
    spacing: {
      pagePadding: '15mm',
      sectionGap: '1rem',
      itemGap: '0.5rem',
    },
    visuals: {
      borderRadius: '0',
      shadow: 'none',
      dividerStyle: 'dashed',
    },
  },

  'executive-blue': {
    id: 'executive-blue',
    name: 'Executive Blue',
    category: 'Corporate',
    mode: 'light',
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#2563eb',
      background: '#ffffff',
      surface: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      border: '#cbd5e1',
    },
    typography: {
      headingFont: FONTS.serif,
      bodyFont: FONTS.serif,
      monoFont: FONTS.mono,
      baseScale: 1.05,
    },
    spacing: {
      pagePadding: '25mm',
      sectionGap: '2rem',
      itemGap: '1rem',
    },
    visuals: {
      borderRadius: '0.125rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      dividerStyle: 'solid',
    },
  },

  'vibrant-designer': {
    id: 'vibrant-designer',
    name: 'Vibrant Designer',
    category: 'Creative',
    mode: 'light',
    colors: {
      primary: '#ec4899',
      secondary: '#be185d',
      accent: '#f472b6',
      background: '#fff1f2',
      surface: '#ffffff',
      textPrimary: '#881337',
      textSecondary: '#9d174d',
      border: '#fecdd3',
    },
    typography: {
      headingFont: FONTS.geometric,
      bodyFont: FONTS.sans,
      monoFont: FONTS.mono,
      baseScale: 1,
    },
    spacing: {
      pagePadding: '20mm',
      sectionGap: '1.75rem',
      itemGap: '1rem',
    },
    visuals: {
      borderRadius: '1rem',
      shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      dividerStyle: 'none',
    },
  },
  
  'research-paper': {
    id: 'research-paper',
    name: 'Research Paper',
    category: 'Academic',
    mode: 'light',
    colors: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#555555',
      background: '#ffffff',
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#333333',
      border: '#000000',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'serif',
      monoFont: FONTS.mono,
      baseScale: 0.9,
    },
    spacing: {
      pagePadding: '30mm',
      sectionGap: '1.25rem',
      itemGap: '0.5rem',
    },
    visuals: {
      borderRadius: '0',
      shadow: 'none',
      dividerStyle: 'solid',
    },
  },
};
