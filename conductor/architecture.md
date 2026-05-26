# Resume Builder Frontend Architecture

## 1. Complete Frontend Architecture
The architecture is designed as a **Schema-Driven, Block-Based Document Editor**. It separates data (State), presentation (Templates/Renderers), and interaction (Editor/DnD).

### Core Pillars
1. **Schema-Driven Store**: The source of truth is a normalized JSON object representing the resume structure, decoupled from the visual layout.
2. **Block Rendering Engine**: A registry pattern mapping block types (e.g., `text`, `list`, `section`) to React components.
3. **Pagination Engine**: An asynchronous DOM-measurement system that partitions the rendered blocks across multiple A4 pages when content overflows.
4. **Action-Based State**: A Redux-like action system inside Zustand for predictable state mutations, enabling Undo/Redo.

## 2. Folder Structure
```text
src/
├── core/                   # Framework-agnostic logic
│   ├── engine/             # Pagination & Measurement logic
│   ├── schema/             # TypeScript interfaces for JSON schema
│   └── templates/          # Template configurations & CSS variable definitions
├── store/                  # Zustand stores
│   ├── useResumeStore.ts   # Main data store (Drafts, History)
│   ├── useEditorStore.ts   # UI state (Zoom, Selected Element, Mode)
│   └── actions/            # Reusable state mutation functions
├── components/
│   ├── editor/             # Editor-specific UI (Toolbar, Zoom Controls, Page Canvas)
│   ├── blocks/             # Concrete block renderers (TextBlock, ListBlock)
│   │   ├── base/           # Base block wrappers (DnD handles, Hover states)
│   │   └── registry.tsx    # Maps block types to components
│   └── shared/             # Generic UI components (Buttons, Modals)
├── hooks/
│   ├── usePagination.ts    # Hook bridging React and Pagination Engine
│   ├── useHistory.ts       # Undo/Redo hook connected to Zustand
│   └── useBlockEditor.ts   # Bridge for ContentEditable
├── lib/                    # Utilities
│   ├── dnd.ts              # dnd-kit custom sensors and modifiers
│   └── utils.ts            # Tailwind merge, formatting
└── types/                  # Global TypeScript definitions
```

## 3. Rendering Engine Design
The Rendering Engine uses a **Registry Pattern**. The frontend does not hardcode `<Experience />` or `<Education />` components. Instead, the schema defines an array of blocks.

```tsx
// registry.tsx
const BlockRegistry = {
  text: TextBlock,
  list: ListBlock,
  group: GroupBlock, // Can hold child blocks
  spacer: SpacerBlock,
};

// RenderBlock.tsx
export const RenderBlock = ({ blockId }) => {
  const block = useResumeStore(state => state.blocks[blockId]);
  const Component = BlockRegistry[block.type];
  
  return <Component {...block.data} id={blockId} />;
};
```
This enables the backend to introduce new block types without frontend code changes, as long as the base block primitives exist.

## 4. Pagination Engine Strategy
Pagination is the hardest part of a web-based document editor. We will use a **Virtual DOM Measurement + Flow layout** approach.

**Strategy:**
1. **Render into an off-screen measuring container**: Render the entire resume in a hidden, fixed-width A4 container.
2. **Measure Heights**: Use `ResizeObserver` or `getBoundingClientRect` to measure the height of every block.
3. **Partitioning Algorithm**: Iterate through the blocks. Accumulate heights until it exceeds the A4 page height limit (e.g., 1123px at 96 DPI).
4. **Splitting Blocks**: If a block (like a list) spans across the page break, the engine must split it. We implement `splittable` blocks. If a list overflows, we split its children into `Page N` and `Page N+1`.
5. **Re-render**: Update the Redux/Zustand UI state with an array of `Pages`, each containing a list of `blockIds`. React renders the visible pages based on this partition data.
6. **Debouncing**: Since measuring is expensive, the pagination recalculation is debounced by 300ms during typing.

## 5. Editable Block Strategy
Instead of swapping a `<p>` for an `<input>`, we use `<div contentEditable>`.

1. **RichText Component**: A lightweight wrapper around `contentEditable`.
2. **Synchronization**: On `input` or `blur`, it pushes the raw text (or lightweight HTML/Markdown) back to Zustand.
3. **Selection Restoration**: When typing triggers a re-render (or pagination), the cursor position (Selection API) must be saved and restored to prevent jumping.
4. **Formatting**: For bold/italic, intercept keyboard shortcuts (Cmd+B) and apply `document.execCommand` (or a modern equivalent like Prosemirror/Slate if complex formatting is later needed, but simple `contentEditable` is preferred for lightness).

## 6. Dynamic Template System
Templates are **Data + CSS Variables**, not unique React components.

- **Structure**: The backend provides a `layout` array (defining a two-column layout, single column, etc.) and a `theme` object.
- **Styling**: The `theme` is injected as CSS Variables into the root wrapper of the document:
  `--primary-color: #2563eb; --heading-font: 'Roboto'; --body-font: 'Open Sans';`
- Tailwind is configured to consume these CSS variables.
- Switching templates simply means swapping the layout structure array in the JSON and updating the CSS variables.

## 7. Component Hierarchy
```text
<EditorProvider> (Zustand)
  <Workspace>
    <Toolbar /> (Zoom, Undo, Export)
    <CanvasArea style={{ transform: `scale(${zoom})` }}>
      <DndContext>
        {pages.map(page => (
          <A4Page key={page.id}>
             <SortableContext>
               {page.blocks.map(blockId => (
                 <SortableBlockWrapper id={blockId}>
                    <RenderBlock blockId={blockId} />
                 </SortableBlockWrapper>
               ))}
             </SortableContext>
          </A4Page>
        ))}
      </DndContext>
    </CanvasArea>
  </Workspace>
</EditorProvider>
```

## 8. State Management Structure (Zustand)
We use a normalized state to easily move blocks and avoid deep nesting updates.

```typescript
interface ResumeState {
  metadata: { title: string, templateId: string },
  theme: { primaryColor: string, font: string },
  // Normalized Blocks
  blocks: Record<string, Block>; 
  // Layout defines the order
  layout: {
    root: string[]; // Array of block IDs representing main sections
  };
  // History for Undo/Redo
  past: ResumeState[];
  future: ResumeState[];
}
```

## 9. Resume Schema Design
The schema acts as the API contract and internal state format.

```json
{
  "version": "1.0",
  "template": "modern-minimalist",
  "theme": { "primary": "#000", "font": "Inter" },
  "blocks": {
    "b1": { "type": "header", "data": { "name": "John Doe", "title": "Engineer" } },
    "b2": { "type": "section", "data": { "title": "Experience" } },
    "b3": { "type": "experience_item", "data": { "company": "Google", "role": "Dev" } },
    "b4": { "type": "list", "data": { "items": ["Item 1", "Item 2"] } }
  },
  "layout": [
    "b1",
    {
      "type": "columns",
      "columns": [
        ["b2", "b3"],
        ["b4"]
      ]
    }
  ]
}
```

## 10. Performance Optimization Strategy
- **Memoization**: Heavy use of `React.memo` on blocks so only edited blocks re-render.
- **Granular Subscriptions**: Using Zustand's selector pattern (`useStore(state => state.blocks[id])`) ensures components only render when their specific data changes.
- **Throttled Pagination**: Pagination logic is pushed to a Web Worker or heavily debounced using `requestAnimationFrame` to prevent layout thrashing while typing.
- **Virtualization**: Not necessary for the canvas (resumes are max 3-5 pages), but necessary for the undo/redo history stack (limit to 50 entries).

## 11. Recommended Libraries
- **React 18+**: For concurrent rendering.
- **Zustand**: Lightweight, unopinionated, fast state management.
- **dnd-kit**: Highly accessible, flexible drag-and-drop toolkit. Doesn't force DOM structures like react-beautiful-dnd.
- **Tailwind CSS**: Utility-first styling.
- **uuid / nanoid**: Fast ID generation for new blocks.
- **zod**: Schema validation for incoming backend data.
- **immer**: (Optional) For simpler immutable state updates in Zustand if the schema gets complex.

## 12. Suggested Custom Hooks
- `useAutoSave(interval)`: Debounces and saves drafts to localStorage/IndexedDB.
- `usePaginationEngine(blocks, layout)`: Handles the off-screen measurement and returns paginated block slices.
- `useBlockSortable(id)`: Wraps `useSortable` from dnd-kit with resume-specific constraints (e.g., restricting lists to specific columns).
- `useCaretPosition()`: Utility to save/restore caret position across re-renders in `contentEditable`.

## 13. Scaling Strategy
- **Extensible Registry**: To add a "Chart" block later, you simply add it to the BlockRegistry. No core logic changes.
- **Multi-tenant**: The schema strictly isolates layout from data, making it easy to support user-defined custom blocks or organization-specific templates in the future.
- **i18n**: The schema contains the text; localization happens purely on the data layer before reaching the UI.

## 14. Clean Code Architecture
- **Dependency Inversion**: UI components depend on abstract Block types, not concrete implementations.
- **Separation of Concerns**: The Editor Workspace (Zoom, Toolbar) is completely isolated from the Document Rendering logic.
- **Pure Functions**: State mutations (moving an item up, splitting a page) are written as pure, testable functions outside of React components.

## 15. Best Practices for Future Backend Integration
- **Optimistic Updates**: Save locally immediately, sync in the background.
- **CRDT / Operational Transformation readiness**: Using normalized IDs (`blocks: Record<string, Block>`) instead of nested arrays prepares the architecture for real-time collaboration (e.g., Yjs or Automerge).
- **Snapshot Versioning**: Backend should store schema versions to gracefully migrate older resume formats to newer structures without breaking the UI.
- **Debounced Sync**: Batch edit operations into a single API call every few seconds to reduce server load.
