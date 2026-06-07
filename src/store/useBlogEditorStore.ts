import { create } from 'zustand';

export type BlockType = 'heading' | 'paragraph' | 'image' | 'list' | 'quote' | 'divider' | 'cta' | 'code';

export interface BlogBlock {
  id: string;
  type: BlockType;
  data: any;
}

interface BlogEditorState {
  title: string;
  slug: string;
  excerpt: string;
  category_id: number | null;
  status: string;
  featured_image: string | null;
  blocks: BlogBlock[];
  
  // Actions
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setExcerpt: (excerpt: string) => void;
  setCategoryId: (id: number | null) => void;
  setStatus: (status: string) => void;
  setFeaturedImage: (url: string | null) => void;
  
  // Block Actions
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, data: any) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  setBlocks: (blocks: BlogBlock[]) => void;
  
  // Load/Reset
  loadPost: (post: any) => void;
  reset: () => void;
}

const generateId = () => crypto.randomUUID();

const DEFAULT_BLOCKS: BlogBlock[] = [
    { id: generateId(), type: 'heading', data: { level: 2, text: '' } },
    { id: generateId(), type: 'paragraph', data: { text: '' } }
];

export const useBlogEditorStore = create<BlogEditorState>((set) => ({
  title: '',
  slug: '',
  excerpt: '',
  category_id: null,
  status: 'draft',
  featured_image: null,
  blocks: DEFAULT_BLOCKS,

  setTitle: (title) => set({ title }),
  setSlug: (slug) => set({ slug }),
  setExcerpt: (excerpt) => set({ excerpt }),
  setCategoryId: (category_id) => set({ category_id }),
  setStatus: (status) => set({ status }),
  setFeaturedImage: (featured_image) => set({ featured_image }),

  addBlock: (type, index) => set((state) => {
    const newBlock: BlogBlock = {
      id: generateId(),
      type,
      data: getDefaultDataForType(type)
    };
    
    const newBlocks = [...state.blocks];
    if (typeof index === 'number') {
      newBlocks.splice(index + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    
    return { blocks: newBlocks };
  }),

  updateBlock: (id, data) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b)
  })),

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id)
  })),

  moveBlock: (id, direction) => set((state) => {
    const index = state.blocks.findIndex(b => b.id === id);
    if (index === -1) return state;
    
    const newBlocks = [...state.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    }
    
    return { blocks: newBlocks };
  }),

  setBlocks: (blocks) => set({ blocks }),

  loadPost: (post) => set({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    category_id: post.category_id,
    status: post.status,
    featured_image: post.featured_image,
    blocks: post.content_blocks && post.content_blocks.length > 0 ? post.content_blocks : DEFAULT_BLOCKS
  }),

  reset: () => set({
    title: '',
    slug: '',
    excerpt: '',
    category_id: null,
    status: 'draft',
    featured_image: null,
    blocks: DEFAULT_BLOCKS
  })
}));

function getDefaultDataForType(type: BlockType): any {
  switch (type) {
    case 'heading': return { level: 2, text: '' };
    case 'paragraph': return { text: '' };
    case 'image': return { url: '', alt: '', caption: '' };
    case 'list': return { style: 'bullet', items: [''] };
    case 'quote': return { text: '', author: '' };
    case 'code': return { language: 'javascript', code: '' };
    case 'cta': return { title: '', description: '', buttonText: '', buttonUrl: '' };
    default: return {};
  }
}
