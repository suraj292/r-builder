import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { 
  ArrowLeft, CreditCard, User, Calendar, CheckCircle2, 
  XCircle, Clock, Mail, Send, FileText, Download, 
  ExternalLink, ShieldCheck, Activity, Landmark
} from 'lucide-react';

interface SubDetail {
  subscription: {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    is_expired: boolean;
    cancel_at_period_end: boolean;
    razorpay_id: string | null;
  };
  user: {
    id: number;
    email: string;
    full_name: string | null;
    role: string;
    is_premium: boolean;
    phone_number: string | null;
    location: string | null;
  };
  plan: {
    id: number;
    name: string;
    tier_code: string;
  };
  transactions: {
    id: number;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    created_at: string;
    plan_name: string;
  }[];
}

export default function AdminSubscriptionDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<SubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [includeInvoice, setIncludeInvoice] = useState(false);
  const [isSending, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [userId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get<SubDetail>(`/v1/admin/users/${userId}/subscription-detail`);
      setData(res);
      setEmailSubject(`Update regarding your ${res.plan?.name || 'ResumeAI'} Subscription`);
    } catch (err) {
      console.error('Failed to fetch sub detail', err);
      navigate('/admin/subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    
    let finalMessage = emailMessage;
    if (includeInvoice && data.transactions.length > 0) {
        const latestTx = data.transactions[0];
        finalMessage += `\n\nYou can view your latest invoice here: http://localhost:8000/api/v1/admin/transactions/${latestTx.id}/invoice`;
    }

    try {
      setIsProcessing(true);
      await api.post('/v1/admin/users/send-email', {
        email: data.user.email,
        subject: emailSubject,
        message: finalMessage
      });
      alert("Support email sent successfully!");
      setEmailMessage('');
    } catch (err) {
      alert("Failed to send email.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return null;

  const daysLeft = Math.ceil((new Date(data.subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/subscriptions')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Subscription Detail</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Management for ID: <span className="font-mono text-indigo-600 font-bold">{data.subscription.razorpay_id || 'manual_override'}</span>
            </p>
          </div>
        </div>
        
        <div className={cn(
            "px-6 py-2 rounded-2xl font-black uppercase text-xs tracking-widest border shadow-sm flex items-center gap-2",
            data.subscription.is_expired ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
        )}>
            {data.subscription.is_expired ? <XCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            {data.subscription.is_expired ? 'Expired' : 'Active Subscription'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User & Plan Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{data.user.full_name || 'Anonymous'}</h3>
                        <p className="text-sm text-slate-500">{data.user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Plan</span>
                        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase">{data.plan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starts</span>
                        <span className="text-sm font-bold text-slate-700">{new Date(data.subscription.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ends</span>
                        <span className="text-sm font-bold text-slate-700">{new Date(data.subscription.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto-Renew</span>
                        <span className="text-sm font-bold text-slate-700">{data.subscription.cancel_at_period_end ? 'No' : 'Yes'}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                            <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Time Remaining</p>
                            <p className="text-2xl font-black text-indigo-700">{daysLeft > 0 ? daysLeft : 0} Days</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl shadow-slate-200">
                <h3 className="font-bold flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-indigo-400" /> Billing Details
                </h3>
                <div className="space-y-4 opacity-80">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Phone</p>
                        <p className="text-sm font-medium">{data.user.phone_number || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Location</p>
                        <p className="text-sm font-medium">{data.user.location || 'Not provided'}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Transaction History & Email Tool */}
        <div className="lg:col-span-2 space-y-8">
            {/* Email Tool */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <Mail className="w-5 h-5 text-indigo-600" /> Support Hub
                </h3>
                
                <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subject</label>
                            <input 
                                type="text"
                                value={emailSubject}
                                onChange={e => setEmailSubject(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Email subject..."
                                required
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-6 px-4">
                            <button 
                                type="button"
                                onClick={() => setIncludeInvoice(!includeInvoice)}
                                className={cn(
                                    "w-10 h-5 rounded-full relative transition-all duration-300 cursor-pointer",
                                    includeInvoice ? "bg-indigo-600" : "bg-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all",
                                    includeInvoice ? "translate-x-5" : ""
                                )}></div>
                            </button>
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> Include Latest Invoice Link
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Support Message</label>
                        <textarea 
                            rows={5}
                            value={emailMessage}
                            onChange={e => setEmailMessage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Type your message to the user here..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={isSending}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {isSending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send Response
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-indigo-600" /> Payment History
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {data.transactions.map(t => (
                        <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    t.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                )}>
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{t.plan_name} Renewal</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">{formatPrice(t.amount, t.currency)}</p>
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        t.status === 'completed' ? "text-emerald-500" : "text-amber-500"
                                    )}>{t.status}</p>
                                </div>
                                <button 
                                    onClick={() => window.open(`/api/v1/admin/transactions/${t.id}/invoice`, '_blank')}
                                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
                                    title="Download Invoice"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {data.transactions.length === 0 && (
                        <div className="p-12 text-center text-slate-400 italic">No transactions found.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
