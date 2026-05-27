import { ReactNode } from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';

interface FeatureGateProps {
  feature: 'ai_generation' | 'ats_scan' | 'premium_templates';
  cost?: number;
  children: ReactNode;
  fallback?: ReactNode;
  onClickUpgrade?: () => void;
}

export default function FeatureGate({ 
  feature, 
  cost = 1, 
  children, 
  fallback,
  onClickUpgrade 
}: FeatureGateProps) {
  const { canUseFeature, openUpgradeModal } = useSubscriptionStore();

  if (canUseFeature(feature, cost)) {
    return <>{children}</>;
  }

  if (fallback) {
    return (
      <div 
        onClick={onClickUpgrade ? onClickUpgrade : () => openUpgradeModal(feature)}
        className="cursor-pointer"
      >
        {fallback}
      </div>
    );
  }

  // Default locked view
  return (
    <div 
      onClick={() => openUpgradeModal(feature)}
      className="relative group overflow-hidden rounded-xl cursor-pointer"
    >
      <div className="opacity-50 pointer-events-none filter blur-[2px] transition-all group-hover:blur-[4px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-[1px]">
        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2 shadow-lg">
          <i className="fa-solid fa-lock"></i>
        </div>
        <span className="text-white font-bold text-sm shadow-sm">Unlock Pro Feature</span>
      </div>
    </div>
  );
}
