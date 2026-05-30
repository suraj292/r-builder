import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';

export default function UpgradeModal() {
  const { upgradeModalOpen, closeUpgradeModal, upgradeFeatureContext } = useSubscriptionStore();
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (upgradeModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [upgradeModalOpen]);

  if (!upgradeModalOpen) return null;

  const handleUpgrade = async (tier: string) => {
    try {
      // In production, this would initialize Razorpay
      await api.post(`/v1/subscriptions/mock-upgrade?tier=${tier}`);
      await fetchUser();
      closeUpgradeModal();
      // Optional toast notification
    } catch (err) {
      console.error("Upgrade failed", err);
    }
  };

  const featureMessages: Record<string, string> = {
    premium_templates: "Unlock premium, ATS-optimized templates designed by recruiters.",
    ai_generation: "You've reached your AI credit limit. Upgrade for powerful AI resume generation.",
    ats_scan: "Get unlimited deep ATS analysis to guarantee your resume passes the filters.",
    pdf_download: "Upgrade to Pro to download your resume as a polished, ATS-friendly PDF.",
    docx_download: "Upgrade to Pro to export your resume as DOCX for easy editing.",
    job_description_matcher: "Upgrade to Career+ to match your resume against specific job descriptions for maximum relevance.",
    cover_letter_generator: "Upgrade to Career+ to auto-generate tailored cover letters that complement your resume.",
    advanced_ats_analysis: "Upgrade to Career+ for in-depth ATS analysis with keyword strategies and advanced insights.",
    resume_creation: "You've reached your resume limit. Upgrade for unlimited resumes.",
    priority_support: "Upgrade to Pro to get priority support from our team."
  };

  const contextMessage = featureMessages[upgradeFeatureContext || ''] || "Upgrade your plan to unlock powerful features.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
        onClick={closeUpgradeModal}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slide-up flex flex-col md:flex-row">
        
        {/* Left Side: Context */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl mb-6 shadow-inner border border-white/20">
              <i className="fa-solid fa-crown text-amber-300"></i>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Level Up Your Career</h2>
            <p className="text-indigo-100 mb-8">{contextMessage}</p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-1"></i>
                <span className="text-sm">Land interviews 3x faster</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-1"></i>
                <span className="text-sm">Bypass strict ATS filters</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-1"></i>
                <span className="text-sm">Stand out with premium designs</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 text-xs text-indigo-200 opacity-80">
            Cancel anytime. Secure payment via Razorpay.
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="md:w-7/12 p-8 bg-slate-50 relative">
          <button 
            onClick={closeUpgradeModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <h3 className="text-xl font-bold text-slate-800 mb-6">Choose your plan</h3>

          <div className="space-y-4">
            
            {/* Pro Plan */}
            <div className="border-2 border-indigo-600 bg-white rounded-2xl p-5 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-slate-900">Pro</h4>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">$9</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">Perfect for active job seekers.</p>
              <button 
                onClick={() => handleUpgrade('pro')}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {user?.tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
              </button>
            </div>

            {/* Career+ Plan */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-slate-900">Career+</h4>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">$19</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">Unlimited power and AI career coaching.</p>
              <button 
                onClick={() => handleUpgrade('career_plus')}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors"
              >
                 {user?.tier === 'career_plus' ? 'Current Plan' : 'Upgrade to Career+'}
              </button>
            </div>

          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                closeUpgradeModal();
                navigate('/pricing');
              }}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Compare all features &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
