import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

interface PlanLimits {
  ai_credits: number;
  ats_scans: number;
  premium_templates: boolean;
}

const LIMITS: Record<string, PlanLimits> = {
  free: { ai_credits: 10, ats_scans: 3, premium_templates: false },
  pro: { ai_credits: 500, ats_scans: -1, premium_templates: true },
  career_plus: { ai_credits: -1, ats_scans: -1, premium_templates: true },
};

interface SubscriptionState {
  upgradeModalOpen: boolean;
  upgradeFeatureContext: string | null;
  
  // Actions
  openUpgradeModal: (featureContext?: string) => void;
  closeUpgradeModal: () => void;
  
  // Helpers
  getLimits: () => PlanLimits;
  canUseFeature: (feature: 'ai_generation' | 'ats_scan' | 'premium_templates', cost?: number) => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  upgradeModalOpen: false,
  upgradeFeatureContext: null,

  openUpgradeModal: (featureContext = 'premium_feature') => {
    set({ upgradeModalOpen: true, upgradeFeatureContext: featureContext });
  },

  closeUpgradeModal: () => {
    set({ upgradeModalOpen: false, upgradeFeatureContext: null });
  },

  getLimits: () => {
    const user = useAuthStore.getState().user;
    const tier = user?.tier || 'free';
    return LIMITS[tier] || LIMITS['free'];
  },

  canUseFeature: (feature, cost = 1) => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    
    const limits = get().getLimits();

    if (feature === 'premium_templates') {
      return limits.premium_templates;
    }

    if (feature === 'ai_generation') {
      if (limits.ai_credits === -1) return true;
      return (user.ai_credits_used + cost) <= limits.ai_credits;
    }

    if (feature === 'ats_scan') {
      if (limits.ats_scans === -1) return true;
      return (user.ats_scans_used + cost) <= limits.ats_scans;
    }

    return false;
  }
}));
