import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';

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

const getTierDefaultOrder = (tier: string) => {
  if (tier === 'free') return 1;
  if (tier === 'pro') return 2;
  if (tier === 'career_plus') return 3;
  return 99;
};

export default function Pricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isYearly, setIsYearly] = useState(false);
    const { user } = useAuthStore();
    const { config, setCurrency, detectCurrency, formatPrice } = useCurrencyStore();
    const navigate = useNavigate();

    useEffect(() => {
        detectCurrency();
        fetchPlans();
    }, [detectCurrency]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await api.get<Plan[]>('/v1/subscriptions/plans');
            setPlans(data);
        } catch (err) {
            console.error('Failed to fetch plans', err);
            // Minimal fallback
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const getPriceForCurrency = (plan: Plan, isYearly: boolean) => {
        if (plan.tier_code === 'free') return 0;
        
        // Try regional pricing first
        if (plan.regional_prices && plan.regional_prices[config.currency]) {
            return isYearly 
                ? plan.regional_prices[config.currency].yearly 
                : plan.regional_prices[config.currency].monthly;
        }

        // Fallback to base price (USD)
        // If the current currency is NOT USD, we should ideally convert, but for now we fallback to base.
        return isYearly ? plan.price_yearly : plan.price_monthly;
    };

    const getPlanFeatures = (tierCode: string) => {
        switch (tierCode) {
            case 'free':
                return [
                    { name: '1 Active Resume', active: true },
                    { name: 'Basic AI Rewrites (10 credits)', active: true },
                    { name: 'Limited Templates', active: true },
                    { name: 'Basic ATS Score', active: true },
                    { name: 'Resume Upload', active: true },
                    { name: 'Premium Templates', active: false },
                    { name: 'PDF Downloads', active: false },
                    { name: 'Job Description Matcher', active: false },
                    { name: 'Cover Letter Generator', active: false },
                ];
            case 'pro':
                return [
                    { name: 'Unlimited Resumes', active: true },
                    { name: '500 AI Rewrite Credits', active: true },
                    { name: 'All Premium Templates', active: true },
                    { name: 'ATS Keyword Matching', active: true },
                    { name: 'PDF & DOCX Downloads', active: true },
                    { name: 'Priority Support', active: true },
                    { name: 'Job Description Matcher', active: false },
                    { name: 'Cover Letter Generator', active: false },
                ];
            case 'career_plus':
            default:
                return [
                    { name: 'Everything in Pro', active: true, bold: true },
                    { name: 'Unlimited AI Credits', active: true },
                    { name: 'Advanced ATS Analysis', active: true },
                    { name: 'Job Description Matcher', active: true },
                    { name: 'Cover Letter Generator', active: true },
                    { name: 'Early Access Features', active: true },
                ];
        }
    };

    const getActionButton = (plan: Plan) => {
        const isCurrent = user && user.tier === plan.tier_code;
        
        if (isCurrent) {
            return (
                <button
                    disabled
                    className="block w-full py-3 px-4 bg-emerald-100 text-emerald-700 font-bold text-center rounded-xl cursor-default transition-all"
                >
                    <i className="fa-solid fa-check mr-2"></i> Current Plan
                </button>
            );
        }

        if (plan.tier_code === 'free') {
            return (
                <Link
                    to={user ? '/builder' : `/auth/signup?redirect=${encodeURIComponent('/builder')}`}
                    className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center rounded-xl transition-colors transform hover:scale-102 active:scale-98"
                >
                    Start Free
                </Link>
            );
        }

        const checkoutUrl = `/user/checkout?plan=${plan.tier_code}&period=${isYearly ? 'yearly' : 'monthly'}&currency=${config.currency}`;
        const finalUrl = user ? checkoutUrl : `/auth/signup?redirect=${encodeURIComponent(checkoutUrl)}`;
        
        const isPro = plan.tier_code === 'pro';
        if (isPro) {
            return (
                <Link
                    to={finalUrl}
                    className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center rounded-xl transition-colors shadow-lg shadow-indigo-500/25 transform hover:scale-102 active:scale-98"
                >
                    Upgrade to Pro
                </Link>
            );
        }

        return (
            <Link
                to={finalUrl}
                className="block w-full py-3 px-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-center rounded-xl transition-colors transform hover:scale-102 active:scale-98"
            >
                Go Premium
            </Link>
        );
    };

    const sortedPlans = [...plans].sort((a, b) => {
        const orderA = a.features?.order !== undefined ? Number(a.features.order) : getTierDefaultOrder(a.tier_code);
        const orderB = b.features?.order !== undefined ? Number(b.features.order) : getTierDefaultOrder(b.tier_code);
        return orderA - orderB;
    });

    return (
        <main className="flex-grow">
            {/* HERO PRICING INTRO */}
            <section className="pt-20 pb-16 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                    Simple, transparent <span className="text-indigo-600">pricing</span>
                </h1>
                
                <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
                    Choose the plan that fits your career goals in <span className="font-bold text-slate-700">{config.country}</span>.
                </p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-center gap-4 mb-16">
                    <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>Monthly</span>
                    <button 
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in bg-slate-200 rounded-full focus:outline-none p-1"
                    >
                        <div 
                            className="w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-sm"
                            style={{ transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }}
                        />
                    </button>
                    <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>Yearly</span>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 -ml-2">Save 20%</span>
                </div>

                {/* PRICING CARDS */}
                <div className="container mx-auto max-w-6xl px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 items-stretch">
                            {sortedPlans.map((plan) => {
                                const features = getPlanFeatures(plan.tier_code);
                                const priceAmount = getPriceForCurrency(plan, isYearly);
                                const isFree = plan.tier_code === 'free';
                                const isPro = plan.tier_code === 'pro';

                                return (
                                    <div 
                                        key={plan.id}
                                        className={`rounded-3xl p-8 border flex flex-col relative transition-all duration-300 ${
                                            isPro 
                                            ? 'bg-slate-900 text-white border-indigo-500 shadow-2xl scale-105 z-10' 
                                            : 'bg-white text-slate-800 border-slate-200 hover:shadow-xl'
                                        }`}
                                    >
                                        {isPro && (
                                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl animate-pulse">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold">{plan.name}</h3>
                                            <p className={`text-sm mt-1 ${isPro ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                {plan.tier_code === 'free' ? 'For getting started' : plan.tier_code === 'pro' ? 'Best for job seekers' : 'For serious professionals'}
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">
                                                {isFree ? formatPrice(0) : formatPrice(priceAmount)}
                                            </span>
                                            <span className={isPro ? 'text-slate-400' : 'text-slate-400'}>
                                                {isFree ? '/forever' : isYearly ? '/year' : '/month'}
                                            </span>
                                        </div>

                                        <div className="mb-8">
                                            {getActionButton(plan)}
                                        </div>

                                        <ul className="space-y-4 text-sm flex-grow text-left">
                                            {features.map((feature, idx) => (
                                                <li 
                                                    key={idx} 
                                                    className={`flex items-center gap-3 ${
                                                        !feature.active 
                                                        ? (isPro ? 'text-slate-600' : 'text-slate-300 line-through') 
                                                        : (isPro ? 'text-slate-300' : 'text-slate-600')
                                                    }`}
                                                >
                                                    {feature.active ? (
                                                        <i className={`fa-solid fa-circle-check ${isPro ? 'text-indigo-400' : 'text-emerald-500'}`}></i>
                                                    ) : (
                                                        <i className="fa-solid fa-circle-xmark text-slate-400"></i>
                                                    )}
                                                    <span className={feature.bold ? 'font-bold' : ''}>{feature.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
