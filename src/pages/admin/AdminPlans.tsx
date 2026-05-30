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
  const [resumeLimit, setResumeLimit] = useState(3);
  const [atsScans, setAtsScans] = useState(5);
  const [regionalPricesJson, setRegionalPricesJson] = useState('{\n  "INR": { "monthly": 49900, "yearly": 499000 },\n  "EUR": { "monthly": 900, "yearly": 9000 }\n}');
  const [featuresJson, setFeaturesJson] = useState('{\n  "ai_credits": 500,\n  "ats_scans": -1,\n  "premium_templates": true\n}');

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

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPlan(null);
    // Reset form
    setTierCode('pro');
    setName('');
    setPriceMonthly(0);
    setPriceYearly(0);
    setResumeLimit(3);
    setAtsScans(5);
    setRegionalPricesJson('{\n  "INR": { "monthly": 49900, "yearly": 499000 },\n  "EUR": { "monthly": 900, "yearly": 9000 }\n}');
    setFeaturesJson('{\n  "ai_credits": 500,\n  "ats_scans": -1,\n  "premium_templates": true\n}');
  };

  const handleStartEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setTierCode(plan.tier_code);
    setName(plan.name);
    setPriceMonthly(plan.price_monthly / 100);
    setPriceYearly(plan.price_yearly / 100);
    setResumeLimit(plan.features?.resume_limit ?? 3);
    setAtsScans(plan.features?.ats_scans ?? 5);
    setRegionalPricesJson(plan.regional_prices ? JSON.stringify(plan.regional_prices, null, 2) : '{}');
    setFeaturesJson(plan.features ? JSON.stringify(plan.features, null, 2) : '{}');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedRegionalPrices = regionalPricesJson.trim() ? JSON.parse(regionalPricesJson) : null;
      let parsedFeatures = featuresJson.trim() ? JSON.parse(featuresJson) : {};

      // Sync explicit fields into features object
      parsedFeatures = {
        ...parsedFeatures,
        resume_limit: resumeLimit,
        ats_scans: atsScans
      };

      const payload = {
        tier_code: tierCode,
        name: name,
        price_monthly: Math.round(priceMonthly * 100),
        price_yearly: Math.round(priceYearly * 100),
        regional_prices: parsedRegionalPrices,
        features: parsedFeatures
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

                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Feature JSON</p>
                    <pre className="text-[10px] bg-slate-900 text-slate-300 p-3 rounded-xl overflow-x-auto max-h-32">
                        {JSON.stringify(plan.features, null, 2)}
                    </pre>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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

              <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
                    <i className="fa-solid fa-file-invoice"></i> Resume Limit
                  </label>
                  <input
                    type="number"
                    value={resumeLimit}
                    onChange={(e) => setResumeLimit(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-white bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                  <p className="text-[10px] text-slate-400">(-1 for unlimited)</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
                    <i className="fa-solid fa-magnifying-glass-chart"></i> ATS Scans
                  </label>
                  <input
                    type="number"
                    value={atsScans}
                    onChange={(e) => setAtsScans(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-white bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                  <p className="text-[10px] text-slate-400">(-1 for unlimited)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Regional Prices (JSON)</label>
                  <textarea
                    rows={6}
                    value={regionalPricesJson}
                    onChange={(e) => setRegionalPricesJson(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                    required
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Feature Config (JSON)</label>
                  <textarea
                    rows={6}
                    value={featuresJson}
                    onChange={(e) => setFeaturesJson(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                    required
                  ></textarea>
                </div>
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
