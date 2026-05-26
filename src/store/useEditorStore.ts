import { create } from 'zustand';

interface EditorState {
  selectedBlockId: string | null;
  zoom: number;
  setSelectedBlock: (id: string | null) => void;
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedBlockId: null,
  zoom: 0.85,
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  setZoom: (zoom) => set({ zoom }),
}));
