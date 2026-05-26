# State Management & Store Design

We use **Zustand** for its performance and simplicity. The store is split into `data` (the resume) and `ui` (editor state).

## 1. The Resume Store (Data)
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ResumeStore {
  resume: ResumeSchema;
  
  // Actions
  updateBlock: (id: string, data: any) => void;
  moveBlock: (id: string, targetIndex: number, targetColumn?: number) => void;
  addBlock: (type: BlockType, parentId?: string) => void;
  deleteBlock: (id: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector(
    immer((set) => ({
      resume: initialData,
      
      updateBlock: (id, data) => set(state => {
        state.resume.blocks[id].data = { ...state.resume.blocks[id].data, ...data };
      }),
      
      moveBlock: (id, targetIndex) => set(state => {
        // Implementation of array move logic
      }),
      
      // ... other actions
    }))
  )
);
```

## 2. The Editor Store (UI)
```typescript
interface EditorStore {
  zoom: number;
  selectedBlockId: string | null;
  isDragging: boolean;
  
  setZoom: (zoom: number) => void;
  setSelectedBlock: (id: string | null) => void;
}
```

## 3. Undo/Redo Implementation
Instead of complex delta-patching, we store snapshots of the `resume` object.
- **Max History**: 50 snapshots.
- **Optimization**: Only push to history on `blur` or after a 1-second debounce of typing, to avoid saving every keystroke as a history state.

## 4. Local Persistence
Use Zustand's `persist` middleware to save the state to `localStorage`. This ensures the user doesn't lose work on page refresh.

```typescript
persist(
  (set) => ({ ... }),
  { name: 'resume-draft-storage' }
)
```

## 5. Performance Context
By using `subscribeWithSelector`, we can trigger the **Pagination Engine** only when relevant parts of the state change.

```typescript
useResumeStore.subscribe(
  state => state.resume.blocks,
  (blocks) => {
    // Re-calculate pagination heights
    recalculatePagination(blocks);
  },
  { fireImmediately: true }
);
```
