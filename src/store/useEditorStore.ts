import { create } from 'zustand';

interface EditorState {
  selectedBlockId: string | null;
  zoom: number;
  isUploading: boolean;
  isAnalyzing: boolean;
  isOptimizing: boolean;
  atsAnalysis: any | null;
  
  setSelectedBlock: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setAIState: (state: Partial<Pick<EditorState, 'isUploading' | 'isAnalyzing' | 'isOptimizing' | 'atsAnalysis'>>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedBlockId: null,
  zoom: 0.85,
  isUploading: false,
  isAnalyzing: false,
  isOptimizing: false,
  atsAnalysis: null,
  
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  setZoom: (zoom) => set({ zoom }),
  setAIState: (newState) => set((state) => ({ ...state, ...newState })),
}));
