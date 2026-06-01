import { create } from 'zustand';
import { api } from '../lib/api';
import type { SystemSettings } from '../types/system';

interface SystemState {
  settings: SystemSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
  settings: null,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<SystemSettings>('/v1/system/settings');
      set({ settings: data });
      
      // Apply favicon if available
      if (data.site_icon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = data.site_icon;
      }
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
