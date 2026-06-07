# Block Registry & Schema Implementation

The core of the "dynamic" nature is the registry. This decouples the "what" (data) from the "how" (UI).

## 1. Schema Definition (TypeScript)
```typescript
type BlockType = 'text' | 'section' | 'list' | 'header' | 'group';

interface BaseBlock {
  id: string;
  type: BlockType;
  parentId?: string;
  isLocked?: boolean; // Cannot be deleted
}

interface TextBlock extends BaseBlock {
  type: 'text';
  data: {
    content: string;
    variant: 'p' | 'h1' | 'h2';
  };
}

interface ListBlock extends BaseBlock {
  type: 'list';
  data: {
    items: string[];
    bulletType: 'disc' | 'number' | 'none';
  };
}

type Block = TextBlock | ListBlock | SectionBlock | ...;
```

## 2. Component Registry
We use a centralized registry to look up components.

```tsx
// src/components/blocks/registry.tsx
import { TextBlock } from './TextBlock';
import { ListBlock } from './ListBlock';

export const BLOCK_COMPONENTS: Record<BlockType, React.FC<any>> = {
  text: TextBlock,
  list: ListBlock,
  header: HeaderBlock,
  // ...
};

// src/components/blocks/BlockRenderer.tsx
export const BlockRenderer: React.FC<{ id: string }> = ({ id }) => {
  const block = useResumeStore(state => state.blocks[id]);
  const Component = BLOCK_COMPONENTS[block.type];

  if (!Component) return null;

  return (
    <BlockWrapper id={id} type={block.type}>
      <Component {...block.data} id={id} />
    </BlockWrapper>
  );
};
```

## 3. The `BlockWrapper` (Interaction Layer)
Every block is wrapped in a UI layer that handles:
- **Hover States**: Showing "Add" buttons or "Drag" handles.
- **Selection**: Highlighting the block when clicked.
- **DnD Hooks**: Using `useSortable` from `dnd-kit`.

```tsx
const BlockWrapper = ({ children, id, type }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Drag Handle - only visible on hover */}
      <div {...attributes} {...listeners} className="absolute -left-6 opacity-0 group-hover:opacity-100 cursor-grab">
        <DragIcon />
      </div>
      
      {children}
      
      {/* Quick Actions */}
      <div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1">
        <button onClick={() => deleteBlock(id)}><TrashIcon /></button>
        <button onClick={() => duplicateBlock(id)}><CopyIcon /></button>
      </div>
    </div>
  );
};
```

## 4. Layout Strategy
The `layout` in the schema can support nested structures (columns).

```json
{
  "layout": [
    { "type": "single", "blocks": ["b1", "b2"] },
    { 
      "type": "columns", 
      "config": { "ratio": "2:1" },
      "columns": [
        ["b3", "b4"],
        ["b5"]
      ]
    }
  ]
}
```
The root renderer iterates through these layout groups, rendering columns or single-column stacks as needed.
