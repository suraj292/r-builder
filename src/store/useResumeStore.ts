import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ResumeSchema, Block, BlockType } from '../types/resume';
import type { ThemeTokens } from '../types/theme';

interface ResumeState {
  resume: ResumeSchema;
  resumeId: number | null; // Database ID of the resume
  pages: string[][]; // Array of pages, each containing block IDs
  
  // Actions
  setResumeId: (id: number | null) => void;
  updateBlock: (id: string, data: Partial<Block['data']>) => void;
  addBlock: (type: BlockType, targetIndex?: number) => void;
  insertBlock: (block: Block, targetIndex?: number) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, targetIndex: number) => void;
  setPages: (pages: string[][]) => void;
  setTheme: (theme: Partial<ResumeSchema['theme']>) => void;
  setTemplate: (templateId: string) => void;
  setThemeId: (themeId: string) => void;
  updateMetadata: (metadata: Partial<ResumeSchema['metadata']>) => void;
  updateDesignOverrides: (overrides: Partial<ThemeTokens>) => void;
  reorderBlocks: (sectionIds: string[]) => void;
  setFullResume: (resume: ResumeSchema) => void;
  addOrUpdateBlock: (block: Block) => void;
}

const initialData: ResumeSchema = {
  version: '1.0',
  metadata: {
    title: 'My Professional Resume',
    templateId: 'modern-professional',
    themeId: 'clean-white',
    updatedAt: Date.now(),
    targetOccupation: 'Software Engineer',
    experienceLevel: 'mid',
  },
  theme: {
    primary: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  blocks: {
    'block-header': {
      id: 'block-header',
      type: 'header',
      data: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA',
        website: 'johndoe.dev',
      },
    },
    'block-summary': {
      id: 'block-summary',
      type: 'text',
      data: {
        content: 'Passionate software engineer with 10+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-quality software solutions.',
        variant: 'p',
      },
    },
    'block-sec-exp': {
      id: 'block-sec-exp',
      type: 'section',
      data: { title: 'Experience' },
    },
    'block-exp-1': {
      id: 'block-exp-1',
      type: 'experience_item',
      data: {
        company: 'Tech Corp',
        role: 'Lead Developer',
        location: 'San Francisco, CA',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: '• Led the development of a flagship SaaS product using React and Go.\n• Optimized application performance, reducing load times by 40%.\n• Mentored junior developers and established best practices for code quality.',
      },
    },
    'block-exp-2': {
      id: 'block-exp-2',
      type: 'experience_item',
      data: {
        company: 'Web Solutions Inc.',
        role: 'Senior Developer',
        location: 'Remote',
        startDate: 'Jun 2015',
        endDate: 'Dec 2019',
        description: '• Developed and maintained multiple high-traffic client websites.\n• Implemented responsive designs and integrated complex third-party APIs.',
      },
    },
    'block-sec-edu': {
      id: 'block-sec-edu',
      type: 'section',
      data: { title: 'Education' },
    },
    'block-edu-1': {
      id: 'block-edu-1',
      type: 'text',
      data: {
        content: 'Bachelor of Science in Computer Science - State University, 2014',
        variant: 'p',
      },
    },
    'block-sec-skills': {
      id: 'block-sec-skills',
      type: 'section',
      data: { title: 'Skills' },
    },
    'block-skills-1': {
      id: 'block-skills-1',
      type: 'text',
      data: {
        content: 'React, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes, CI/CD, Agile Methodology',
        variant: 'p',
      },
    },
  },
  layout: ['block-header', 'block-summary', 'block-sec-exp', 'block-exp-1', 'block-exp-2', 'block-sec-edu', 'block-edu-1', 'block-sec-skills', 'block-skills-1'],
};

export const useResumeStore = create<ResumeState>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        resume: initialData,
        resumeId: null,
        pages: [['header-1', 'summary-1', 'sec-exp', 'exp-1']], // Initial single page
        
        setResumeId: (id) => set((state) => {
          state.resumeId = id;
        }),

        updateBlock: (id, data) => set((state) => {
          if (state.resume.blocks[id]) {
            state.resume.blocks[id].data = { ...state.resume.blocks[id].data, ...data } as any;
            state.resume.metadata.updatedAt = Date.now();
          }
        }),
        
        addBlock: (type, targetIndex) => set((state) => {
          const id = `block-${Math.random().toString(36).substr(2, 9)}`;
          const newBlock = {
            id,
            type,
            data: {} as any, 
          } as Block;
          
          state.resume.blocks[id] = newBlock;
          if (typeof targetIndex === 'number') {
            state.resume.layout.splice(targetIndex, 0, id);
          } else {
            state.resume.layout.push(id);
          }
        }),

        insertBlock: (block, targetIndex) => set((state) => {
          state.resume.blocks[block.id] = block;
          if (typeof targetIndex === 'number') {
            state.resume.layout.splice(targetIndex, 0, block.id);
          } else {
            state.resume.layout.push(block.id);
          }
        }),
        
        deleteBlock: (id) => set((state) => {
          delete state.resume.blocks[id];
          state.resume.layout = state.resume.layout.filter(item => item !== id);
        }),
        
        moveBlock: (id, targetIndex) => set((state) => {
          const currentIndex = state.resume.layout.indexOf(id);
          if (currentIndex !== -1) {
            state.resume.layout.splice(currentIndex, 1);
            state.resume.layout.splice(targetIndex, 0, id);
          }
        }),
        
        setPages: (pages) => set((state) => {
          state.pages = pages;
        }),
        
        setTheme: (theme) => set((state) => {
          state.resume.theme = { ...state.resume.theme, ...theme };
        }),
        
        setTemplate: (templateId) => set((state) => {
          state.resume.metadata.templateId = templateId;
          state.resume.metadata.updatedAt = Date.now();
        }),

        setThemeId: (themeId) => set((state) => {
          state.resume.metadata.themeId = themeId;
          state.resume.metadata.updatedAt = Date.now();
        }),

        updateMetadata: (metadata) => set((state) => {
          state.resume.metadata = { ...state.resume.metadata, ...metadata };
          state.resume.metadata.updatedAt = Date.now();
        }),

        updateDesignOverrides: (overrides) => set((state) => {
          const current = state.resume.metadata.designOverrides || {};
          state.resume.metadata.designOverrides = {
            ...current,
            ...overrides,
            colors: { ...(current.colors || {}), ...overrides.colors } as any,
            typography: { ...(current.typography || {}), ...overrides.typography } as any,
            spacing: { ...(current.spacing || {}), ...overrides.spacing } as any,
            visuals: { ...(current.visuals || {}), ...overrides.visuals } as any,
          };
          state.resume.metadata.updatedAt = Date.now();
        }),

        reorderBlocks: (sectionIds) => set((state) => {
          // Reorder the layout array based on the provided IDs
          // Items not in sectionIds remain at the bottom
          const newLayout = [...sectionIds];
          state.resume.layout.forEach(id => {
            if (typeof id === 'string' && !newLayout.includes(id)) {
              newLayout.push(id);
            }
          });
          state.resume.layout = newLayout as any;
          state.resume.metadata.updatedAt = Date.now();
        }),

        setFullResume: (resume) => set((state) => {
          state.resume = {
            ...resume,
            blocks: resume.blocks || {},
            layout: resume.layout || []
          };
          // Reset pages to a single page containing all block IDs to force re-pagination
          const allBlockIds = (resume.layout || [])
            .filter(id => typeof id === 'string') as string[];
          state.pages = [allBlockIds];
          state.resume.metadata.updatedAt = Date.now();
        }),

        addOrUpdateBlock: (block) => set((state) => {
          state.resume.blocks[block.id] = block;
          if (!state.resume.layout.includes(block.id)) {
            state.resume.layout.push(block.id);
          }
          state.resume.metadata.updatedAt = Date.now();
        }),
      })),
      { name: 'resume-storage' }
    )
  )
);
