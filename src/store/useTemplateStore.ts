import { create } from 'zustand';
import { api } from '../lib/api';

interface TemplateSettings {
  isActive: boolean;
  requiredTier: 'free' | 'pro' | 'career_plus';
}

interface TemplateStoreState {
  settings: Record<string, TemplateSettings>;
  isLoading: boolean;
  
  fetchSettings: () => Promise<void>;
  updateSetting: (templateId: string, updates: Partial<TemplateSettings>) => Promise<void>;
}

export const useTemplateStore = create<TemplateStoreState>((set) => ({
  settings: {},
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<Record<string, TemplateSettings>>('/v1/templates/settings');
      set({ settings: data });
    } catch (error) {
      console.error('Failed to fetch template settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSetting: async (templateId, updates) => {
    try {
      const data = await api.patch<TemplateSettings>(`/v1/admin/templates/${templateId}/settings`, {
        is_active: updates.isActive,
        required_tier: updates.requiredTier
      });
      set((state) => ({
        settings: {
          ...state.settings,
          [templateId]: data
        }
      }));
    } catch (error) {
      console.error('Failed to update template setting:', error);
      throw error;
    }
  }
}));
