# Custom Elements & Visual Editor Architecture

## Objective
Transform the resume builder from a linear block editor into a rich, Canva-style visual document editor. Users will be able to drag-and-drop advanced custom elements, resize columns, and apply granular, block-level styling, all while retaining schema compatibility and measurement-based A4 pagination.

## 1. Upgraded Schema Design (`src/types/resume.ts`)

To support complex layouts and advanced styling, we must expand `Block` and introduce `ElementStyles` and nested layouts.

```typescript
export interface ElementStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Colors & Background
  color?: string;
  backgroundColor?: string;
  
  // Box Model
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  
  // Dimensions
  width?: string;
  height?: string;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  parentId?: string; // Critical for nested layouts (e.g., inside a column)
  customStyles?: ElementStyles; // Block-level overrides
}

// Layout Blocks
export interface GridBlock extends BaseBlock {
  type: 'grid';
  data: {
    columns: number;
    gap: string;
    // Children are referenced via layout engine or direct child array
  };
}

// Visual Elements
export interface ChartBlock extends BaseBlock {
  type: 'skill_chart';
  data: {
    skills: { name: string; value: number }[];
    chartType: 'bar' | 'circle' | 'radar';
  };
}

export interface PhotoBlock extends BaseBlock {
  type: 'photo';
  data: {
    url: string;
    shape: 'circle' | 'square' | 'rounded' | 'hexagon';
    borderStyle?: string;
    filter?: string; // grayscale, etc.
  };
}
```

## 2. Advanced Layout Engine & DnD

Moving beyond simple vertical sorting requires a nested Drag-and-Drop context using `@dnd-kit/core`.

- **Nested Sortables**: A `GridBlock` or `TwoColumnBlock` acts as a container. It will wrap its children in its own `SortableContext`.
- **Sensors & Modifiers**: We'll add modifiers for snap-to-grid and alignment guides.
- **Resizing**: We can integrate `react-resizable-panels` or raw resize handles on layout columns to adjust flexible ratios (e.g., `flex: 1` vs `flex: 2`).

## 3. Element Sidebar UI (`src/components/editor/ElementSidebar.tsx`)
A new floating or docked sidebar on the left containing categorized draggable presets.

- **Categories**: Text, Shapes, Visuals (Charts, Progress), Portfolio (Image Grids, Case Studies), Badges (QR Code, Social).
- **Interaction**: Users drag from the sidebar into the A4 canvas. The `DndContext` will intercept external drags and instantiate a new block in the schema upon `onDragEnd`.

## 4. Block-Level Styling Engine
While the *Template* provides global CSS variables, users can override them using a floating toolbar.

- **Floating Toolbar**: When a block is clicked (`selectedBlockId` in Zustand), a context-aware toolbar appears above it.
- **CSS Injection**: `ElementStyles` are mapped to inline `style={{ ... }}` on the block's wrapper, overriding the template defaults.

## 5. Photo & Media System
- **Advanced Photo Block**: Replaces the hardcoded header photo logic. A user can place a photo anywhere.
- **Features**: Interactive dragging to reposition the focal point (using `object-position`), zoom slider (using `transform: scale`), and shape masking (using `clip-path` or `border-radius`).

## 6. Pagination Compatibility
Because elements can now have arbitrary heights, paddings, and nested structures, the `PaginationEngine` must measure the DOM *recursively*.
- **Splittable Elements**: Complex layouts (like a 2-column grid) must be measured carefully. If the left column overflows, but the right doesn't, the engine must split the entire grid container across two pages.

## 7. Performance Optimizations
- **Zustand Selectors**: Crucial for ensuring that typing in a text block doesn't re-render the entire grid.
- **Memoized Context**: `SortableContext` will be heavily memoized to prevent lag during dragging.
- **Lazy Rendering**: Complex charts or 3rd-party widgets (e.g., QR Code generators) will be lazy-loaded using `React.lazy`.
