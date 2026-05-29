import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface Plan {
  id: number;
  tier_code: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  regional_prices: any;
  features: any;
  is_active: boolean;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();

  const planTier = searchParams.get('plan') || 'pro';
  const billingPeriod = searchParams.get('period') || 'monthly';
  const currencyParam = searchParams.get('currency') || 'USD';

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [location, setLocation] = useState(user?.location || '');

  useEffect(() => {
    fetchPlans();
    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.get<Plan[]>('/v1/subscriptions/plans');
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans', err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.tier_code === planTier) || {
    name: planTier.toUpperCase(),
    price_monthly: 900,
    price_yearly: 9000,
    tier_code: planTier,
    regional_prices: {
      INR: { monthly: 49900, yearly: 499000 },
      EUR: { monthly: 900, yearly: 9000 }
    }
  };

  // Resolve base price using regional currency if available
  const getPriceForCurrency = () => {
    if (selectedPlan.tier_code === 'free') return 0;
    if (selectedPlan.regional_prices && selectedPlan.regional_prices[currencyParam]) {
      return billingPeriod === 'yearly' 
        ? selectedPlan.regional_prices[currencyParam].yearly 
        : selectedPlan.regional_prices[currencyParam].monthly;
    }
    return billingPeriod === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly;
  };

  const basePrice = getPriceForCurrency();
  const basePriceInCurrency = basePrice / 100;
  const gstRate = 0.18; // 18% GST
  const discountRate = discountApplied ? (discountPercent / 100) : 0.0;

  const discountAmount = basePriceInCurrency * discountRate;
  const subtotalAfterDiscount = basePriceInCurrency - discountAmount;
  const gstAmount = subtotalAfterDiscount * gstRate;
  const totalPayable = subtotalAfterDiscount + gstAmount;

  const formatCheckoutPrice = (amount: number) => {
    const symbol = currencyParam === 'INR' ? '₹' : currencyParam === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      const data = await api.get<{valid: boolean; discount_percent: number; message: string}>(
        `/v1/subscriptions/validate-coupon?code=${encodeURIComponent(couponCode)}&plan_tier=${planTier}&amount=${basePrice}`
      );
      
      if (data.valid) {
        setDiscountApplied(true);
        setDiscountPercent(data.discount_percent);
        alert(data.message);
      } else {
        setDiscountApplied(false);
        setDiscountPercent(0);
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to validate coupon.");
    }
  };

  const handlePayment = async () => {
    if (!phone || !location) {
        alert("Please provide your phone number and location to continue.");
        return;
    }

    try {
      setProcessing(true);
      
      // 1. Create Order in Backend
      const order = await api.post<{order_id: string; amount: number; currency: string; key_id: string}>(
        `/v1/payments/create-order?plan_tier=${planTier}&period=${billingPeriod}&currency=${currencyParam}${discountApplied ? `&coupon_code=${encodeURIComponent(couponCode)}` : ''}`
      );

      // 2. Open Razorpay Checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "ResumeAI Premium",
        description: `${selectedPlan.name} Plan - ${billingPeriod}`,
        order_id: order.order_id,
        handler: async (response: any) => {
          // 3. Verify Payment on Backend
          try {
            await api.post('/v1/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              phone,
              location,
              country: currencyParam === 'INR' ? 'India' : 'International',
              device: `${navigator.platform} - ${navigator.vendor}`
            });
            
            await fetchUser();
            setSuccess(true);
            setTimeout(() => {
              navigate('/user/resumes');
            }, 3000);
          } catch (err) {
            console.error('Verification failed', err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.full_name || '',
          email: user?.email || '',
          contact: phone
        },
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: () => setProcessing(false)
        }
      };

      if (!(window as any).Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      const rzp = (window as any).Razorpay(options);
      rzp.open();
      
    } catch (err) {
      console.error('Failed to initiate payment', err);
      alert('Failed to start payment process. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
            <p className="text-sm text-slate-500">Your account has been upgraded to <strong>{selectedPlan.name}</strong>.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 text-left text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Selected Plan:</span>
              <span className="font-semibold text-slate-900">{selectedPlan.name} ({billingPeriod})</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold text-slate-900">{formatCheckoutPrice(totalPayable)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction status:</span>
              <span className="font-semibold text-emerald-600">Completed</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 animate-pulse">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="glass-header sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-sm shadow-md">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <span className="text-lg font-display font-bold text-slate-800 tracking-tight">Resume<span className="text-indigo-600">AI</span></span>
          </Link>

          <div className="flex items-center gap-2 text-emerald-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-xs font-bold">
            <i className="fa-solid fa-lock"></i>
            <span>SSL Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Complete Your Purchase</h1>
          <p className="text-slate-500">Unlock premium features and land your dream job faster.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: PAYMENT DETAILS */}
          <div className="lg:col-span-7 space-y-8 animate-slide-up">
            {/* Selected Plan Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                SELECTED
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedPlan.name} Plan <span className="text-slate-400 font-normal mx-2">|</span> {billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}</h3>
                  <p className="text-sm text-slate-500">Includes all premium features, templates, and full access.</p>
                </div>
                <Link to="/pricing" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  Change Plan
                </Link>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
                Billing Information
              </h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={user?.full_name || 'Anonymous User'}
                      className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none bg-slate-50"
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none bg-slate-50"
                      readOnly 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City / Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">GST Number <span className="text-slate-400 font-normal lowercase">(optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter GST Number for business invoice"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-400" 
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 payment-card group">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                Payment Method
              </h3>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                <div className="flex justify-center items-center gap-4 mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <i className="fa-brands fa-google-pay text-3xl"></i>
                  <i className="fa-brands fa-cc-visa text-3xl"></i>
                  <i className="fa-brands fa-cc-mastercard text-3xl"></i>
                  <i className="fa-solid fa-building-columns text-2xl"></i>
                </div>
                <h4 className="font-bold text-indigo-900 mb-1">Pay Securely with Razorpay</h4>
                <p className="text-xs text-indigo-600 mb-6">Supports UPI, Credit/Debit Cards, Net Banking, and Wallets</p>

                <button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock text-xs"></i> Proceed to Pay
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-400 mt-4">
                <i className="fa-solid fa-shield-halved text-green-500 mr-1"></i> Your payment information is encrypted and secure.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-6 animate-slide-up">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{selectedPlan.name} Plan ({billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'})</span>
                  <span className="font-medium text-slate-900">{formatCheckoutPrice(basePriceInCurrency)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Coupon Discount (20%)</span>
                    <span>-{formatCheckoutPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-slate-900">{formatCheckoutPrice(gstAmount)}</span>
                </div>
              </div>

              {/* COUPON CODE */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Have a coupon code? (SAVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="form-input w-full pl-4 pr-24 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 uppercase placeholder-slate-400" 
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </form>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 font-medium">Total Payable</span>
                  <div className="text-right">
                    <span className="block text-3xl font-display font-bold text-slate-900">{formatCheckoutPrice(totalPayable)}</span>
                    <span className="text-[10px] text-slate-400">Includes all taxes</span>
                  </div>
                </div>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <i className="fa-solid fa-award text-indigo-500"></i>
                  <div className="text-[10px] leading-tight text-slate-600">
                    <span className="font-bold block text-slate-800">Money Back</span>
                    7-day guarantee
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <i className="fa-solid fa-headset text-indigo-500"></i>
                  <div className="text-[10px] leading-tight text-slate-600">
                    <span className="font-bold block text-slate-800">Support</span>
                    24/7 Assistance
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
                By proceeding, you agree to our <Link to="/legal/terms" className="underline hover:text-slate-600">Terms of Service</Link> and <Link to="/legal/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>. Subscriptions auto-renew but can be cancelled anytime.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
