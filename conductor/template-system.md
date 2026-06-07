# Template & Theme System Architecture

## Objective
Implement a dynamic, scalable template system allowing instant switching between 6 distinct professional templates without modifying the underlying resume data schema.

## 1. Type Definitions (`src/types/template.ts`)
We will introduce strict types for templates and theme variables.

```typescript
export interface ThemeVariables {
  '--primary-color': string;
  '--secondary-color': string;
  '--text-color': string;
  '--text-light': string;
  '--bg-color': string;
  '--heading-font': string;
  '--body-font': string;
  '--page-padding': string;
  '--section-gap': string;
  '--item-gap': string;
  '--border-radius': string;
  '--border-color': string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  variables: ThemeVariables;
}
```

## 2. Template Registry (`src/templates/registry.ts`)
A centralized registry containing the 6 templates:
1.  **Modern Professional**: Blue accents, clear hierarchy, sans-serif.
2.  **Minimal Clean**: Monochrome, spacious, elegant serif headers.
3.  **ATS Friendly**: Standardized, compact, highly legible, black and white.
4.  **Creative Designer**: Vibrant accents, rounded corners, modern geometric fonts.
5.  **Executive Corporate**: Deep navy/slate, conservative spacing, traditional serif.
6.  **Dark Elegant**: Dark background, light text, gold/accent highlights.

## 3. Theme Injection
We will dynamically inject these variables into the `A4Page` component.
```tsx
const activeTemplate = TemplateRegistry[templateId];

return (
  <div 
    className="a4-page" 
    style={activeTemplate.variables as React.CSSProperties}
  >
    {/* content */}
  </div>
);
```

## 4. Dynamic Block Adaptation
Blocks will be updated to use CSS variables via Tailwind's arbitrary value syntax or inline styles, avoiding hardcoded classes.
*   *Before*: `className="text-blue-600 font-bold"`
*   *After*: `className="text-[var(--primary-color)] font-[family-name:var(--heading-font)] font-bold"`

## 5. UI Integration
A new `Sidebar` component will be added to the `Workspace` to display template thumbnails. Clicking a thumbnail updates the `templateId` in Zustand, triggering an instant, real-time re-render of the canvas and recalculation of pagination if spacing variables change.
