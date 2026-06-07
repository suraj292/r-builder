import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../../lib/alerts';
import { History, Clock, CheckCircle2, XCircle, Globe, Monitor, Mail, FileText, Settings, X, Send, Calendar, ExternalLink } from 'lucide-react';

interface Transaction {
  id: number;
  user_email: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  payment_id: string | null;
  country: string | null;
  device: string | null;
  created_at: string;
}

interface Subscription {
  id: number;
  user_id: number;
  user_email: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  is_expired: boolean;
}

export default function AdminSubscriptions() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'validity'>('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [manageSub, setManageSub] = useState<Subscription | null>(null);
  const [mailUser, setMailUser] = useState<{email: string; subject: string; message: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'transactions') {
        const data = await api.get<Transaction[]>('/v1/admin/transactions');
        setTransactions(data);
      } else {
        const data = await api.get<Subscription[]>('/v1/admin/subscriptions');
        setSubscriptions(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValidity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageSub) return;
    try {
        setIsProcessing(true);
        await api.patch(`/v1/admin/subscriptions/${manageSub.id}/validity`, { end_date: manageSub.end_date });
        showAlert.success("Success", "Subscription validity updated successfully.");
        setManageSub(null);
        fetchData();
    } catch (err) {
        showAlert.error("Failed", "Failed to update subscription validity.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailUser) return;
    try {
        setIsProcessing(true);
        await api.post('/v1/admin/users/send-email', mailUser);
        showAlert.success("Email Sent", "Email sent to user successfully.");
        setMailUser(null);
    } catch (err) {
        showAlert.error("Failed", "Failed to send email.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleViewInvoice = (id: number) => {
    window.open(`/api/v1/admin/transactions/${id}/invoice`, '_blank');
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription & Revenue</h1>
          <p className="text-slate-500 text-sm">Track payments, invoices, and user validity.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'transactions' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <History className="w-4 h-4" /> Transactions
          </button>
          <button 
            onClick={() => setActiveTab('validity')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'validity' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Clock className="w-4 h-4" /> User Validity
          </button>
        </div>
      </div>

      {activeTab === 'transactions' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Plan & Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Platform & Meta</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading transactions...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">No transactions recorded yet.</td></tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{t.user_email}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Ord: {t.order_id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-slate-700">{t.plan_name}</span>
                           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{formatPrice(t.amount, t.currency)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            t.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                            t.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                        )}>
                            {t.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {t.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <Globe className="w-3 h-3" /> {t.country || 'Unknown'}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <Monitor className="w-3 h-3" /> {t.device?.split('-')[0] || 'Web'}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => handleViewInvoice(t.id)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer" 
                                title="View Invoice"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setMailUser({email: t.user_email, subject: '', message: ''})}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer" 
                                title="Mail User"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Active Plan</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading subscriptions...</td></tr>
                ) : subscriptions.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">No active subscriptions found.</td></tr>
                ) : (
                  subscriptions.map(s => {
                    const daysLeft = Math.ceil((new Date(s.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => navigate(`/admin/subscriptions/${s.user_id}`)}
                                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300 cursor-pointer"
                                >
                                    {s.user_email}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black uppercase rounded-lg border border-indigo-100">
                                    {s.plan_name}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-medium text-slate-600">
                                    {new Date(s.start_date).toLocaleDateString()} - {new Date(s.end_date).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 font-bold text-xs",
                                    s.is_expired ? "text-rose-500" : "text-emerald-500"
                                )}>
                                    {s.is_expired ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {s.is_expired ? 'Expired' : 'Active'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setManageSub(s)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer" 
                                        title="Manage Validity"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setMailUser({email: s.user_email, subject: '', message: ''})}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer" 
                                        title="Mail User"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className={cn("text-[9px] font-bold mt-1", daysLeft < 5 ? "text-rose-500" : "text-slate-400")}>
                                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                </p>
                            </td>
                        </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1. MANAGE VALIDITY MODAL */}
      {manageSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setManageSub(null)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" /> Manage Validity
                    </h3>
                    <button onClick={() => setManageSub(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                
                <p className="text-sm text-slate-500 mb-6">Update the subscription end date for <strong>{manageSub.user_email}</strong>.</p>
                
                <form onSubmit={handleUpdateValidity} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Expiry Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="date"
                                value={manageSub.end_date.split('T')[0]}
                                onChange={e => setManageSub({...manageSub, end_date: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setManageSub(null)} className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isProcessing ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Update Validity
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* 2. MAIL USER MODAL */}
      {mailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setMailUser(null)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" /> Send Message
                    </h3>
                    <button onClick={() => setMailUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                
                <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">To</label>
                        <input type="text" value={mailUser.email} readOnly className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Action required: Your subscription"
                            value={mailUser.subject}
                            onChange={e => setMailUser({...mailUser, subject: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Message</label>
                        <textarea 
                            rows={6}
                            placeholder="Type your message here..."
                            value={mailUser.message}
                            onChange={e => setMailUser({...mailUser, message: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isProcessing ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send Email
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
