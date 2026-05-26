# Custom Theme Editor System Rebuild

## 1. Problem Analysis
Currently, the system relies on predefined presets (`ThemeRegistry`). The `designOverrides` object in Zustand exists but lacks a UI and robust integration. Customizations are not natively supported, meaning users cannot fine-tune colors, fonts, or spacing.

## 2. Store Updates (`src/store/useResumeStore.ts`)
Add a new action: `updateDesignOverrides(overrides: Partial<ThemeTokens>)`.
This action will deeply merge new overrides into `state.resume.metadata.designOverrides` and update the `updatedAt` timestamp. 
It must be fast and trigger minimal React re-renders, relying on CSS variable injection for visual updates.

## 3. Pagination Synchronization
Any change to typography (fonts) or spacing (padding, gaps) must trigger the `MeasuringCanvas` and `PaginationEngine`.
We will add `designOverrides` (specifically the `spacing` and `typography` parts) to the dependency arrays of `MeasuringCanvas` and `usePagination` to ensure live reflow when a user adjusts layout density.

## 4. Theme Editor UI (`src/components/editor/ThemeEditor.tsx`)
A new sidebar view that allows manual editing of the `designOverrides`.

### Sections:
- **Colors**: Primary, Background, Text (using native `<input type="color">` and preset palettes).
- **Typography**: Dropdowns for Heading Font, Body Font, and a Slider for Base Scale.
- **Spacing (Density)**: Presets or sliders for `Compact`, `Comfortable`, and `Spacious` layouts (updating `sectionGap` and `itemGap`).
- **Visuals**: Border radius slider, shadow toggles.
- **Actions**: "Reset to Preset" (clears `designOverrides`).

## 5. UI Flow Integration
In `Workspace.tsx`, we will add `theme-editor` to the `activeSidebar` state.
The "Custom Theme Editor" button in `ThemeGallery` will switch the view to `ThemeEditor`. A "Back" button in the `ThemeEditor` will return to the `ThemeGallery`.
