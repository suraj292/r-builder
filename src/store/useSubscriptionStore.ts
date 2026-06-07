import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export type FeatureKey =
  | 'ai_generation'
  | 'ats_scan'
  | 'premium_templates'
  | 'pdf_download'
  | 'docx_download'
  | 'job_description_matcher'
  | 'cover_letter_generator'
  | 'advanced_ats_analysis'
  | 'priority_support'
  | 'resume_creation';

interface PlanLimits {
  ai_credits: number;              // -1 = unlimited
  ats_scans: number;               // -1 = unlimited
  resume_limit: number;            // -1 = unlimited
  premium_templates: boolean;
  pdf_download: boolean;
  docx_download: boolean;
  job_description_matcher: boolean;
  cover_letter_generator: boolean;
  advanced_ats_analysis: boolean;
  priority_support: boolean;
}

const LIMITS: Record<string, PlanLimits> = {
  free: {
    ai_credits: 10,
    ats_scans: 3,
    resume_limit: 1,
    premium_templates: false,
    pdf_download: false,
    docx_download: false,
    job_description_matcher: false,
    cover_letter_generator: false,
    advanced_ats_analysis: false,
    priority_support: false,
  },
  pro: {
    ai_credits: 500,
    ats_scans: -1,
    resume_limit: -1,
    premium_templates: true,
    pdf_download: true,
    docx_download: true,
    job_description_matcher: false,
    cover_letter_generator: false,
    advanced_ats_analysis: false,
    priority_support: true,
  },
  career_plus: {
    ai_credits: -1,
    ats_scans: -1,
    resume_limit: -1,
    premium_templates: true,
    pdf_download: true,
    docx_download: true,
    job_description_matcher: true,
    cover_letter_generator: true,
    advanced_ats_analysis: true,
    priority_support: true,
  },
};

interface SubscriptionState {
  upgradeModalOpen: boolean;
  upgradeFeatureContext: string | null;
  
  // Actions
  openUpgradeModal: (featureContext?: string) => void;
  closeUpgradeModal: () => void;
  
  // Helpers
  getLimits: () => PlanLimits;
  canUseFeature: (feature: FeatureKey, cost?: number) => boolean;
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

    // Boolean features — simple toggle check
    if (feature === 'premium_templates') return limits.premium_templates;
    if (feature === 'pdf_download') return limits.pdf_download;
    if (feature === 'docx_download') return limits.docx_download;
    if (feature === 'job_description_matcher') return limits.job_description_matcher;
    if (feature === 'cover_letter_generator') return limits.cover_letter_generator;
    if (feature === 'advanced_ats_analysis') return limits.advanced_ats_analysis;
    if (feature === 'priority_support') return limits.priority_support;

    // Counted features — check usage against limits
    if (feature === 'ai_generation') {
      if (limits.ai_credits === -1) return true;
      return (user.ai_credits_used + cost) <= limits.ai_credits;
    }

    if (feature === 'ats_scan') {
      if (limits.ats_scans === -1) return true;
      return (user.ats_scans_used + cost) <= limits.ats_scans;
    }

    if (feature === 'resume_creation') {
      // Resume count check is best done server-side, but for UI gating
      // we simply check if the limit is -1 (unlimited)
      if (limits.resume_limit === -1) return true;
      // For client-side, we can't know the exact count, so we allow and let backend reject
      return true;
    }

    return false;
  }
}));
