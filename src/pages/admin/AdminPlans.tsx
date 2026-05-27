import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Plan {
  id: number;
  tier_code: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: any;
  is_active: boolean;
  created_at: string;
}

const getTierDefaultOrder = (tier: string) => {
  if (tier === 'free') return 1;
  if (tier === 'pro') return 2;
  if (tier === 'career_plus') return 3;
  return 99;
};

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Plan Form State
  const [tierCode, setTierCode] = useState('pro');
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [priceYearly, setPriceYearly] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(2);
  const [featuresJson, setFeaturesJson] = useState('{\n  "ai_credits": 500,\n  "ats_scans": -1,\n  "premium_templates": true\n}');

  // Edit Plan Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editName, setEditName] = useState('');
  const [editPriceMonthly, setEditPriceMonthly] = useState(0);
  const [editPriceYearly, setEditPriceYearly] = useState(0);
  const [editDisplayOrder, setEditDisplayOrder] = useState(2);
  const [editFeaturesJson, setEditFeaturesJson] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

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

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedFeatures = JSON.parse(featuresJson);
      parsedFeatures.order = Number(displayOrder);

      const payload = {
        tier_code: tierCode,
        name: name,
        price_monthly: Math.round(priceMonthly * 100),
        price_yearly: Math.round(priceYearly * 100),
        features: parsedFeatures,
        is_active: true
      };
      await api.post('/v1/admin/plans', payload);
      setShowCreateModal(false);
      fetchPlans();
      // Reset form
      setName('');
      setPriceMonthly(0);
      setPriceYearly(0);
      setDisplayOrder(2);
    } catch (err) {
      alert("Failed to create plan. Check JSON format.");
      console.error(err);
    }
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditPriceMonthly(plan.price_monthly / 100);
    setEditPriceYearly(plan.price_yearly / 100);
    setEditDisplayOrder(plan.features?.order !== undefined ? Number(plan.features.order) : getTierDefaultOrder(plan.tier_code));
    
    // Omit 'order' from JSON editor input to keep it clean, since it has its own dedicated input
    const cleanFeatures = { ...plan.features };
    delete cleanFeatures.order;
    setEditFeaturesJson(JSON.stringify(cleanFeatures, null, 2));
    
    setShowEditModal(true);
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const parsedFeatures = JSON.parse(editFeaturesJson);
      parsedFeatures.order = Number(editDisplayOrder);

      const payload = {
        name: editName,
        price_monthly: Math.round(editPriceMonthly * 100),
        price_yearly: Math.round(editPriceYearly * 100),
        features: parsedFeatures,
        is_active: editingPlan.is_active
      };
      await api.patch(`/v1/admin/plans/${editingPlan.id}`, payload);
      setShowEditModal(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err) {
      alert("Failed to update plan. Check JSON format.");
      console.error(err);
    }
  };

  // Sort plans dynamically based on custom features.order priority
  const sortedPlans = [...plans].sort((a, b) => {
    const orderA = a.features?.order !== undefined ? Number(a.features.order) : getTierDefaultOrder(a.tier_code);
    const orderB = b.features?.order !== undefined ? Number(b.features.order) : getTierDefaultOrder(b.tier_code);
    return orderA - orderB;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-slate-500 text-sm">Manage tiers, pricing, ordering and feature limitations.</p>
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
        ) : sortedPlans.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 italic">No plans found. Create your first plan to start monetizing.</p>
            </div>
        ) : (
          sortedPlans.map((plan) => {
            const displayOrderValue = plan.features?.order !== undefined ? Number(plan.features.order) : getTierDefaultOrder(plan.tier_code);
            return (
              <div key={plan.id} className={`bg-white rounded-2xl border ${plan.is_active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-75'} relative overflow-hidden flex flex-col`}>
                <div className="absolute top-0 right-0 flex gap-1">
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-indigo-100">
                    ORDER: {displayOrderValue}
                  </div>
                  {plan.tier_code === 'free' && (
                    <div className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-slate-200">
                      DEFAULT PLAN
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-b border-slate-50 flex items-center justify-between pt-8">
                  <div>
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{plan.tier_code}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.tier_code === 'free' ? 'bg-slate-100 text-slate-500' : plan.tier_code === 'pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                      <i className={`fa-solid ${plan.tier_code === 'free' ? 'fa-leaf' : plan.tier_code === 'pro' ? 'fa-bolt' : 'fa-crown'}`}></i>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 flex-1">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-slate-900">${(plan.price_monthly / 100).toFixed(2)}</span>
                    <span className="text-xs text-slate-500">/mo</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mb-4">
                    ${(plan.price_yearly / 100).toFixed(2)} / year
                  </div>

                  <div className="space-y-3 mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Feature JSON</p>
                      <pre className="text-[10px] bg-slate-900 text-slate-300 p-3 rounded-xl overflow-x-auto max-h-40">
                          {JSON.stringify(plan.features, null, 2)}
                      </pre>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(plan)}
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
            );
          })
        )}
      </div>

      {/* CREATE PLAN MODAL */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Create New Plan</h3>
                      <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                          <i className="fa-solid fa-xmark"></i>
                      </button>
                  </div>
                  
                  <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Tier Code</label>
                              <select 
                                value={tierCode} 
                                onChange={(e) => setTierCode(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
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

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Display Order (Sorting)</label>
                          <input 
                            type="number" 
                            value={displayOrder} 
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            required
                          />
                          <p className="text-[10px] text-slate-400">Lower order number will be displayed first (e.g. 1 comes before 2).</p>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Feature Configuration (JSON)</label>
                          <textarea 
                            rows={6}
                            value={featuresJson}
                            onChange={(e) => setFeaturesJson(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                            required
                          ></textarea>
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bg-white"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
                          >
                              Create Plan
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* EDIT PLAN MODAL */}
      {showEditModal && editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Edit Plan</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tier: {editingPlan.tier_code}</p>
                      </div>
                      <button onClick={() => { setShowEditModal(false); setEditingPlan(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                          <i className="fa-solid fa-xmark"></i>
                      </button>
                  </div>
                  
                  <form onSubmit={handleUpdatePlan} className="p-6 space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. Pro Monthly" 
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            required
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Monthly Price ($)</label>
                              <input 
                                type="number" 
                                step="0.01" 
                                value={editPriceMonthly} 
                                onChange={(e) => setEditPriceMonthly(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                required
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Yearly Price ($)</label>
                              <input 
                                type="number" 
                                step="0.01" 
                                value={editPriceYearly} 
                                onChange={(e) => setEditPriceYearly(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                required
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Display Order (Sorting)</label>
                          <input 
                            type="number" 
                            value={editDisplayOrder} 
                            onChange={(e) => setEditDisplayOrder(parseInt(e.target.value))}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                            required
                          />
                          <p className="text-[10px] text-slate-400">Lower order number will be displayed first (e.g. 1 comes before 2).</p>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Feature Configuration (JSON)</label>
                          <textarea 
                            rows={6}
                            value={editFeaturesJson}
                            onChange={(e) => setEditFeaturesJson(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                            required
                          ></textarea>
                      </div>

                      <div className="pt-4 flex gap-3">
                          <button 
                            type="button"
                            onClick={() => { setShowEditModal(false); setEditingPlan(null); }}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bg-white"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
                          >
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
