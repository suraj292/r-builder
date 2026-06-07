# Theme Engine Architecture & Design System

## Objective
Decouple visual styling (colors, typography, spacing) from structural layouts (templates). Implement a robust Design Token architecture powered by CSS variables to enable instant, highly customizable, and occupation-aware theme switching without React re-renders.

## 1. Design Token Schema (`src/types/theme.ts`)
The `Theme` type dictates exactly how a resume looks.

```typescript
export interface ThemeTokens {
  id: string;
  name: string;
  category: 'Minimal' | 'Tech' | 'Corporate' | 'Creative' | 'Academic';
  mode: 'light' | 'dark';

  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string; // Used for cards/sidebars
    textPrimary: string;
    textSecondary: string;
    border: string;
  };

  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    baseScale: number; // e.g., 1 for 16px base, 0.875 for 14px
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
```

## 2. Theme vs. Template Separation
Previously, `ResumeTemplate` held both layout and styling. We must separate them:
- **`LayoutTemplate`**: Defines grid structure (single column, sidebar, etc.).
- **`Theme`**: Defines the paint (colors, fonts, borders).
Any theme can be applied to any layout.

## 3. CSS Variable Injection Engine
To ensure instant switching and high performance, the `ThemeProvider` (or a utility function used in `A4Page`) will map `ThemeTokens` directly to CSS Custom Properties injected at the page container root.

```css
:root {
  --theme-primary: #2563eb;
  --theme-bg: #ffffff;
  --theme-surface: #f3f4f6;
  --font-heading: 'Inter', sans-serif;
  --radius-md: 8px;
}
```
Tailwind v4 allows us to use arbitrary values: `bg-[var(--theme-primary)]`.

## 4. Theme Registry (`src/themes/registry.ts`)
A centralized repository of premium presets:
- **Clean White (Minimal)**: High contrast, sans-serif, spacious.
- **VS Code Dark (Tech)**: Dark background, monospace headers, neon accents.
- **Executive Blue (Corporate)**: Navy primary, serif headers, conservative spacing.
- **Editorial Magazine (Creative)**: Large typography, bold primary colors, tight item gaps.

## 5. Theme Editor UI
A new sidebar panel (`ThemePanel.tsx`) that allows granular customization:
- **Color Pickers**: Directly update `--theme-primary` in Zustand.
- **Font Pairs**: Select from curated Google Font combinations.
- **Density Controls**: Sliders to adjust `--section-gap` and `--page-padding`.

## 6. Print & ATS Optimization
- **Contrast Checking**: The theme engine should warn if `--theme-bg` and `--theme-textPrimary` have a low contrast ratio.
- **Print Safety**: Dark mode themes must automatically invert or rely on `@media print` rules to ensure the PDF export doesn't waste ink (unless explicitly desired).

## 7. Migration Plan
1. Define `ThemeTokens` interfaces.
2. Build the `ThemeRegistry`.
3. Update Zustand to store the active `ThemeTokens` separately from the layout.
4. Refactor all `Block` components to strictly use CSS variables (`var(--theme-primary)`) instead of hardcoded Tailwind classes.
5. Build the `ThemeGallery` and `ThemeEditor` UI.
