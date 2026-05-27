import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface Plan {
  id: number;
  tier_code: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
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
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await api.get<Plan[]>('/v1/subscriptions/plans');
            setPlans(data);
        } catch (err) {
            console.error('Failed to fetch plans', err);
            // Fallback mock plans to keep ui active if api is building
            setPlans([
                {
                    id: 1,
                    tier_code: 'free',
                    name: 'Free',
                    price_monthly: 0,
                    price_yearly: 0,
                    features: { ai_credits: 10, ats_scans: 3, premium_templates: false, order: 1 },
                    is_active: true
                },
                {
                    id: 2,
                    tier_code: 'pro',
                    name: 'Pro',
                    price_monthly: 900,
                    price_yearly: 9000,
                    features: { ai_credits: 500, ats_scans: -1, premium_templates: true, order: 2 },
                    is_active: true
                },
                {
                    id: 3,
                    tier_code: 'career_plus',
                    name: 'Career+',
                    price_monthly: 1900,
                    price_yearly: 19000,
                    features: { ai_credits: -1, ats_scans: -1, premium_templates: true, order: 3 },
                    is_active: true
                }
            ]);
        } finally {
            setLoading(false);
        }
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
                ];
            case 'pro':
                return [
                    { name: 'Unlimited Resumes', active: true },
                    { name: '500 AI Rewrite Credits', active: true },
                    { name: 'All Premium Templates', active: true },
                    { name: 'ATS Keyword Matching', active: true },
                    { name: 'PDF & DOCX Downloads', active: true },
                    { name: 'Priority Support', active: true },
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

        // Paid Plans checkout path
        const checkoutUrl = `/user/checkout?plan=${plan.tier_code}&period=${isYearly ? 'yearly' : 'monthly'}`;
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

    // Sort plans dynamically based on custom features.order priority
    const sortedPlans = [...plans].sort((a, b) => {
        const orderA = a.features?.order !== undefined ? Number(a.features.order) : getTierDefaultOrder(a.tier_code);
        const orderB = b.features?.order !== undefined ? Number(b.features.order) : getTierDefaultOrder(b.tier_code);
        return orderA - orderB;
    });

    return (
        <>
            <main className="flex-grow">
                {/* HERO PRICING INTRO */}
                <section className="pt-20 pb-16 text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 animate-fade-up">
                        Simple, transparent <span className="text-indigo-600">pricing</span>
                    </h1>
                    <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto animate-fade-up">
                        Choose the plan that fits your career goals. No hidden fees, cancel anytime.
                    </p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mb-16 animate-fade-up">
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
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 -ml-2 animate-pulse">Save 20%</span>
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
                                    const price = isYearly ? plan.price_yearly : plan.price_monthly;
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
                                                    {isFree ? '$0' : `$${(price / 100).toFixed(0)}`}
                                                </span>
                                                <span className={isPro ? 'text-slate-400' : 'text-slate-400'}>
                                                    {isFree ? '/forever' : isYearly ? '/yearly' : '/month'}
                                                </span>
                                            </div>

                                            <div className="mb-8">
                                                {getActionButton(plan)}
                                            </div>

                                            <ul className="space-y-4 text-sm flex-grow">
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

                {/* DETAILED COMPARISON TABLE */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Detailed Comparison</h2>

                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-up">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 pl-8 font-semibold text-slate-600">Features</th>
                                        <th className="p-4 text-center font-bold text-slate-700">Free</th>
                                        <th className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/50">Pro</th>
                                        <th className="p-4 text-center font-bold text-slate-900">Career+</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Resumes</td>
                                        <td className="p-4 text-center text-slate-500">1</td>
                                        <td className="p-4 text-center font-bold text-slate-900 bg-indigo-50/20">Unlimited</td>
                                        <td className="p-4 text-center font-bold text-slate-900">Unlimited</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">AI Rewrite Credits</td>
                                        <td className="p-4 text-center text-slate-500">10</td>
                                        <td className="p-4 text-center text-slate-900 bg-indigo-50/20">500</td>
                                        <td className="p-4 text-center text-green-500">Unlimited</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">ATS Keyword Matching</td>
                                        <td className="p-4 text-center text-slate-300"><i className="fa-solid fa-minus"></i></td>
                                        <td className="p-4 text-center text-green-500 bg-indigo-50/20"><i className="fa-solid fa-check"></i></td>
                                        <td className="p-4 text-center text-green-500"><i className="fa-solid fa-check"></i></td>
                                    </tr>
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Cover Letter Gen</td>
                                        <td className="p-4 text-center text-slate-300"><i className="fa-solid fa-minus"></i></td>
                                        <td className="p-4 text-center text-slate-300 bg-indigo-50/20"><i className="fa-solid fa-minus"></i></td>
                                        <td className="p-4 text-center text-green-500"><i className="fa-solid fa-check"></i></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Export Formats</td>
                                        <td className="p-4 text-center text-slate-500">TXT</td>
                                        <td className="p-4 text-center text-slate-900 bg-indigo-50/20">PDF, DOCX</td>
                                        <td className="p-4 text-center text-slate-900">PDF, DOCX</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden faq-item hover:shadow-sm transition-shadow">
                                <button className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                    Is the Free plan really free?
                                    <i className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                                </button>
                                <div className="bg-slate-50 px-5 text-slate-600 text-sm py-4">
                                    Yes! You can build one resume, use our basic templates, and download it as a TXT file completely for free. No credit card required.
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden faq-item hover:shadow-sm transition-shadow">
                                <button className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                                    Can I cancel my subscription anytime?
                                    <i className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                                </button>
                                <div className="bg-slate-50 px-5 text-slate-600 text-sm py-4">
                                    Absolutely. You can cancel your subscription from your account settings at any time. You will retain access to premium features until the end of your billing cycle.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
