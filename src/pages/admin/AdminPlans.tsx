import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { showAlert } from '../../lib/alerts';

interface Plan {
  id: number;
  tier_code: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  regional_prices: any;
  features: any;
  is_active: boolean;
  created_at: string;
}

// Feature definitions for structured editing
const BOOLEAN_FEATURES = [
  { key: 'premium_templates', label: 'Premium Templates', icon: 'fa-palette', description: 'Access to all premium resume templates' },
  { key: 'pdf_download', label: 'PDF Download', icon: 'fa-file-pdf', description: 'Export resumes as PDF' },
  { key: 'docx_download', label: 'DOCX Download', icon: 'fa-file-word', description: 'Export resumes as DOCX' },
  { key: 'job_description_matcher', label: 'Job Description Matcher', icon: 'fa-crosshairs', description: 'Match resume against job descriptions' },
  { key: 'cover_letter_generator', label: 'Cover Letter Generator', icon: 'fa-envelope-open-text', description: 'AI-powered cover letter generation' },
  { key: 'advanced_ats_analysis', label: 'Advanced ATS Analysis', icon: 'fa-chart-line', description: 'Deep ATS keyword strategy analysis' },
  { key: 'priority_support', label: 'Priority Support', icon: 'fa-headset', description: 'Priority customer support access' },
];

const COUNTED_FEATURES = [
  { key: 'ai_credits', label: 'AI Credits', icon: 'fa-wand-magic-sparkles', description: '-1 for unlimited' },
  { key: 'ats_scans', label: 'ATS Scans', icon: 'fa-magnifying-glass-chart', description: '-1 for unlimited' },
  { key: 'resume_limit', label: 'Resume Limit', icon: 'fa-file-invoice', description: '-1 for unlimited' },
];

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { config, detectCurrency, formatPrice } = useCurrencyStore();

  // Form State
  const [tierCode, setTierCode] = useState('pro');
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [priceYearly, setPriceYearly] = useState(0);
  const [regionalPricesJson, setRegionalPricesJson] = useState('{\n  "INR": { "monthly": 49900, "yearly": 499000 },\n  "EUR": { "monthly": 900, "yearly": 9000 }\n}');

  // Structured feature state
  const [aiCredits, setAiCredits] = useState(500);
  const [atsScans, setAtsScans] = useState(-1);
  const [resumeLimit, setResumeLimit] = useState(-1);
  const [premiumTemplates, setPremiumTemplates] = useState(true);
  const [pdfDownload, setPdfDownload] = useState(true);
  const [docxDownload, setDocxDownload] = useState(true);
  const [jobDescriptionMatcher, setJobDescriptionMatcher] = useState(false);
  const [coverLetterGenerator, setCoverLetterGenerator] = useState(false);
  const [advancedAtsAnalysis, setAdvancedAtsAnalysis] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(true);

  // Advanced JSON for extra fields
  const [showAdvancedJson, setShowAdvancedJson] = useState(false);
  const [extraFeaturesJson, setExtraFeaturesJson] = useState('{}');

  useEffect(() => {
    detectCurrency();
    fetchPlans();
  }, [detectCurrency]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.get<Plan[]>('/v1/admin/plans');
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await api.patch(`/v1/admin/plans/${plan.id}`, { is_active: !plan.is_active });
      fetchPlans();
    } catch (err) {
      console.error('Failed to update plan status', err);
    }
  };

  const getFeatureSetters = () => ({
    ai_credits: aiCredits,
    ats_scans: atsScans,
    resume_limit: resumeLimit,
    premium_templates: premiumTemplates,
    pdf_download: pdfDownload,
    docx_download: docxDownload,
    job_description_matcher: jobDescriptionMatcher,
    cover_letter_generator: coverLetterGenerator,
    advanced_ats_analysis: advancedAtsAnalysis,
    priority_support: prioritySupport,
  });

  const setFeatureFromPlan = (features: any) => {
    setAiCredits(features?.ai_credits ?? 500);
    setAtsScans(features?.ats_scans ?? -1);
    setResumeLimit(features?.resume_limit ?? -1);
    setPremiumTemplates(features?.premium_templates ?? true);
    setPdfDownload(features?.pdf_download ?? true);
    setDocxDownload(features?.docx_download ?? true);
    setJobDescriptionMatcher(features?.job_description_matcher ?? false);
    setCoverLetterGenerator(features?.cover_letter_generator ?? false);
    setAdvancedAtsAnalysis(features?.advanced_ats_analysis ?? false);
    setPrioritySupport(features?.priority_support ?? true);

    // Extract extra keys not in our structured list
    const knownKeys = new Set([
      'ai_credits', 'ats_scans', 'resume_limit', 'premium_templates',
      'pdf_download', 'docx_download', 'job_description_matcher',
      'cover_letter_generator', 'advanced_ats_analysis', 'priority_support',
      'order'
    ]);
    const extra: any = {};
    if (features) {
      for (const [k, v] of Object.entries(features)) {
        if (!knownKeys.has(k)) extra[k] = v;
      }
    }
    setExtraFeaturesJson(Object.keys(extra).length > 0 ? JSON.stringify(extra, null, 2) : '{}');
  };

  const resetForm = () => {
    setTierCode('pro');
    setName('');
    setPriceMonthly(0);
    setPriceYearly(0);
    setRegionalPricesJson('{\n  "INR": { "monthly": 49900, "yearly": 499000 },\n  "EUR": { "monthly": 900, "yearly": 9000 }\n}');
    setAiCredits(500);
    setAtsScans(-1);
    setResumeLimit(-1);
    setPremiumTemplates(true);
    setPdfDownload(true);
    setDocxDownload(true);
    setJobDescriptionMatcher(false);
    setCoverLetterGenerator(false);
    setAdvancedAtsAnalysis(false);
    setPrioritySupport(true);
    setExtraFeaturesJson('{}');
    setShowAdvancedJson(false);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPlan(null);
    resetForm();
  };

  const handleStartEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setTierCode(plan.tier_code);
    setName(plan.name);
    setPriceMonthly(plan.price_monthly / 100);
    setPriceYearly(plan.price_yearly / 100);
    setRegionalPricesJson(plan.regional_prices ? JSON.stringify(plan.regional_prices, null, 2) : '{}');
    setFeatureFromPlan(plan.features);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedRegionalPrices = regionalPricesJson.trim() ? JSON.parse(regionalPricesJson) : null;
      let extraFeatures = {};
      try {
        extraFeatures = extraFeaturesJson.trim() ? JSON.parse(extraFeaturesJson) : {};
      } catch {
        extraFeatures = {};
      }

      const features = {
        ...extraFeatures,
        ...getFeatureSetters(),
      };

      const payload = {
        tier_code: tierCode,
        name: name,
        price_monthly: Math.round(priceMonthly * 100),
        price_yearly: Math.round(priceYearly * 100),
        regional_prices: parsedRegionalPrices,
        features: features
      };

      if (editingPlan) {
        await api.patch(`/v1/admin/plans/${editingPlan.id}`, payload);
      } else {
        await api.post('/v1/admin/plans', { ...payload, is_active: true });
      }

      handleCloseModal();
      fetchPlans();
    } catch (err: any) {
      const errorMsg = err?.message || "Check JSON formats.";
      showAlert.error("Failed to Save Plan", errorMsg);
      console.error(err);
    }
  };


  const getPriceForCurrency = (plan: Plan) => {
    if (plan.tier_code === 'free') return 0;
    if (plan.regional_prices && plan.regional_prices[config.currency]) {
      return plan.regional_prices[config.currency].monthly;
    }
    return plan.price_monthly;
  };

  const getFeatureIcon = (_key: string, value: any) => {
    if (typeof value === 'boolean') {
      return value 
        ? <i className="fa-solid fa-circle-check text-emerald-500"></i>
        : <i className="fa-solid fa-circle-xmark text-slate-300"></i>;
    }
    if (value === -1) {
      return <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">∞</span>;
    }
    return <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{value}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-slate-500 text-sm">Manage tiers, regional pricing, and features.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <i className="fa-solid fa-plus mr-2"></i> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {loading ? (
            <div className="col-span-full py-20 flex justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : plans.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 italic">No plans found.</p>
            </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-2xl border ${plan.is_active ? 'border-slate-200' : 'border-slate-100 opacity-75'} shadow-sm overflow-hidden flex flex-col`}>
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{plan.tier_code}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.tier_code === 'free' ? 'bg-slate-100 text-slate-500' : plan.tier_code === 'pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                    <i className={`fa-solid ${plan.tier_code === 'free' ? 'fa-leaf' : plan.tier_code === 'pro' ? 'fa-bolt' : 'fa-crown'}`}></i>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 flex-1 space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">{formatPrice(getPriceForCurrency(plan))}</span>
                  <span className="text-xs text-slate-500">/mo ({config.currency})</span>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Base Price (USD)</p>
                    <p className="text-xs text-slate-500">
                        ${(plan.price_monthly / 100).toFixed(2)} monthly | ${(plan.price_yearly / 100).toFixed(2)} yearly
                    </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Regional Overrides</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.regional_prices && Object.entries(plan.regional_prices).map(([curr, p]: [string, any]) => (
                      <span key={curr} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                        {curr}: {(p.monthly / 100).toFixed(0)}/mo
                      </span>
                    ))}
                  </div>
                </div>

                {/* Structured Feature Display */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Features</p>
                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
                      {COUNTED_FEATURES.map(f => (
                        <div key={f.key} className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2">
                            <i className={`fa-solid ${f.icon} text-[10px] text-slate-400 w-4 text-center`}></i>
                            <span className="text-[11px] font-semibold text-slate-600">{f.label}</span>
                          </div>
                          {getFeatureIcon(f.key, plan.features?.[f.key])}
                        </div>
                      ))}
                      {BOOLEAN_FEATURES.map(f => (
                        <div key={f.key} className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2">
                            <i className={`fa-solid ${f.icon} text-[10px] text-slate-400 w-4 text-center`}></i>
                            <span className="text-[11px] font-semibold text-slate-600">{f.label}</span>
                          </div>
                          {getFeatureIcon(f.key, plan.features?.[f.key])}
                        </div>
                      ))}
                    </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                    <button 
                      onClick={() => handleStartEdit(plan)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer" 
                      title="Edit Plan"
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                        onClick={() => handleToggleActive(plan)}
                        className={`p-2 rounded-lg transition-all ${plan.is_active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'} cursor-pointer`} 
                        title={plan.is_active ? "Deactivate Plan" : "Activate Plan"}
                    >
                        <i className={`fa-solid ${plan.is_active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                    </button>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${plan.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE/EDIT PLAN MODAL */}
      {(showCreateModal || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Plan'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tier Code</label>
                  <select
                    value={tierCode}
                    onChange={(e) => setTierCode(e.target.value)}
                    disabled={!!editingPlan}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="career_plus">career_plus</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pro Monthly"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Monthly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceMonthly}
                    onChange={(e) => setPriceMonthly(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Yearly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceYearly}
                    onChange={(e) => setPriceYearly(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Counted Features */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <p className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
                  <i className="fa-solid fa-sliders"></i> Usage Limits
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {COUNTED_FEATURES.map(f => {
                    const value = f.key === 'ai_credits' ? aiCredits : f.key === 'ats_scans' ? atsScans : resumeLimit;
                    const setter = f.key === 'ai_credits' ? setAiCredits : f.key === 'ats_scans' ? setAtsScans : setResumeLimit;
                    return (
                      <div key={f.key} className="space-y-1">
                        <label className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                          <i className={`fa-solid ${f.icon}`}></i> {f.label}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setter(parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-white bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <p className="text-[9px] text-slate-400">{f.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Boolean Feature Toggles */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                <p className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-2">
                  <i className="fa-solid fa-toggle-on"></i> Feature Access
                </p>
                <div className="space-y-2">
                  {BOOLEAN_FEATURES.map(f => {
                    const value = 
                      f.key === 'premium_templates' ? premiumTemplates :
                      f.key === 'pdf_download' ? pdfDownload :
                      f.key === 'docx_download' ? docxDownload :
                      f.key === 'job_description_matcher' ? jobDescriptionMatcher :
                      f.key === 'cover_letter_generator' ? coverLetterGenerator :
                      f.key === 'advanced_ats_analysis' ? advancedAtsAnalysis :
                      prioritySupport;
                    const setter = 
                      f.key === 'premium_templates' ? setPremiumTemplates :
                      f.key === 'pdf_download' ? setPdfDownload :
                      f.key === 'docx_download' ? setDocxDownload :
                      f.key === 'job_description_matcher' ? setJobDescriptionMatcher :
                      f.key === 'cover_letter_generator' ? setCoverLetterGenerator :
                      f.key === 'advanced_ats_analysis' ? setAdvancedAtsAnalysis :
                      setPrioritySupport;

                    return (
                      <label key={f.key} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-colors group">
                        <div className="flex items-center gap-3">
                          <i className={`fa-solid ${f.icon} text-sm ${value ? 'text-emerald-600' : 'text-slate-300'} w-5 text-center transition-colors`}></i>
                          <div>
                            <span className="text-sm font-semibold text-slate-700 block">{f.label}</span>
                            <span className="text-[10px] text-slate-400">{f.description}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setter(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-1 ${value ? 'translate-x-5 ml-0' : 'translate-x-1'}`}></div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Regional Prices */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Regional Prices (JSON)</label>
                <textarea
                  rows={4}
                  value={regionalPricesJson}
                  onChange={(e) => setRegionalPricesJson(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  required
                ></textarea>
              </div>

              {/* Advanced JSON (collapsible) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedJson(!showAdvancedJson)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 cursor-pointer"
                >
                  <i className={`fa-solid fa-chevron-${showAdvancedJson ? 'down' : 'right'} text-[8px]`}></i>
                  Advanced: Extra Feature Config (JSON)
                </button>
                {showAdvancedJson && (
                  <textarea
                    rows={4}
                    value={extraFeaturesJson}
                    onChange={(e) => setExtraFeaturesJson(e.target.value)}
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  ></textarea>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
