import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { Ticket, Plus, Trash2, CheckCircle2, XCircle, Clock, Calendar, Percent, X } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  valid_until: string | null;
  max_uses_total: number | null;
  used_count_total: number;
  per_user_limit: number;
  min_purchase_amount: number | null;
  restricted_to_plan: string | null;
  created_at: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Coupon Form
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(20);
  const [newMaxUses, setNewMaxUses] = useState<number | ''>('');
  const [newPerUserLimit, setNewPerUserLimit] = useState(1);
  const [newMinAmount, setNewMinAmount] = useState<number | ''>('');
  const [newRestrictedPlan, setNewRestrictedPlan] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.get<Coupon[]>('/v1/admin/coupons');
      console.log("Fetched coupons:", data);
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/admin/coupons', {
        code: newCode.toUpperCase(),
        discount_percent: newDiscount,
        max_uses_total: newMaxUses === '' ? null : newMaxUses,
        per_user_limit: newPerUserLimit,
        min_purchase_amount: newMinAmount === '' ? null : Math.round(Number(newMinAmount) * 100),
        restricted_to_plan: newRestrictedPlan === '' ? null : newRestrictedPlan,
        valid_until: newExpiry === '' ? null : new Date(newExpiry).toISOString()
      });
      alert("Coupon created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert("Failed to create coupon. Code might already exist.");
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/v1/admin/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to delete coupon.");
    }
  };

  const resetForm = () => {
    setNewCode('');
    setNewDiscount(20);
    setNewMaxUses('');
    setNewPerUserLimit(1);
    setNewMinAmount('');
    setNewRestrictedPlan('');
    setNewExpiry('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupon Management</h1>
          <p className="text-slate-500 text-sm">Create and manage discount codes for checkout.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Restrictions</th>
                <th className="px-6 py-4">Status & Validity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">No coupons created yet.</td></tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg border border-emerald-100">
                        {coupon.discount_percent}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700 space-y-1">
                        <p>Total: {coupon.used_count_total} / {coupon.max_uses_total || '∞'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Per User: {coupon.per_user_limit}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-xs space-y-1">
                          {coupon.restricted_to_plan && (
                            <p className="font-bold text-indigo-600 uppercase text-[9px] bg-indigo-50 px-1.5 py-0.5 rounded w-max">
                              {coupon.restricted_to_plan} Only
                            </p>
                          )}
                          {coupon.min_purchase_amount ? (
                            <p className="text-slate-500 font-medium italic text-[10px]">
                              Min: ₹{(coupon.min_purchase_amount / 100).toFixed(2)}
                            </p>
                          ) : <p className="text-slate-400 text-[10px]">No min amount</p>}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold uppercase",
                          coupon.is_active ? "text-emerald-600" : "text-slate-400"
                        )}>
                          {coupon.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </div>
                        {coupon.valid_until && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="w-3 h-3" />
                            Expires: {new Date(coupon.valid_until).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> New Coupon
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Coupon Code</label>
                <input 
                  type="text" 
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE50"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      min="1" max="100"
                      value={newDiscount}
                      onChange={e => setNewDiscount(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Global Max Uses</label>
                  <input 
                    type="number" 
                    placeholder="Unlimited"
                    value={newMaxUses}
                    onChange={e => setNewMaxUses(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Per User Limit</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newPerUserLimit}
                    onChange={e => setNewPerUserLimit(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Min Order (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="None"
                    value={newMinAmount}
                    onChange={e => setNewMinAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Restrict to Plan</label>
                <select 
                  value={newRestrictedPlan}
                  onChange={e => setNewRestrictedPlan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                >
                  <option value="">All Plans</option>
                  <option value="pro">Pro Plan Only</option>
                  <option value="career_plus">Career+ Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Expiry Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date"
                    value={newExpiry}
                    onChange={e => setNewExpiry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
