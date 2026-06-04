import { create } from 'zustand';
import { api } from '../lib/api';

interface VisibilityConfig {
    business_info: any;
    social_links: any;
    google_settings: any;
    ai_discovery: any;
    trust_center: any;
    branding_settings: any;
}

interface VisibilityStore {
    config: VisibilityConfig | null;
    isLoading: boolean;
    fetchConfig: () => Promise<void>;
}

export const useVisibilityStore = create<VisibilityStore>((set) => ({
    config: null,
    isLoading: false,
    fetchConfig: async () => {
        set({ isLoading: true });
        try {
            // Public endpoint for visibility config (minimal data)
            const data = await api.get<VisibilityConfig>('/v1/system/visibility'); 
            set({ config: data });
        } catch (error) {
            console.error('Failed to fetch visibility config');
        } finally {
            set({ isLoading: false });
        }
    },
}));
