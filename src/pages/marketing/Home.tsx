import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

import { useCurrencyStore } from '../../store/useCurrencyStore';
import { cn } from '../../lib/utils';

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

export default function Home() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isYearly, setIsYearly] = useState(false);

    const { config, detectCurrency, formatPrice } = useCurrencyStore();

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
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const getPriceForCurrency = (plan: Plan, isYearly: boolean) => {
        if (plan.tier_code === 'free') return 0;
        if (plan.regional_prices && plan.regional_prices[config.currency]) {
            return isYearly
                ? plan.regional_prices[config.currency].yearly
                : plan.regional_prices[config.currency].monthly;
        }
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

    const sortedPlans = useMemo(() => {
        return [...plans].sort((a, b) => {
            const orderA = a.features?.order !== undefined ? Number(a.features.order) : getTierDefaultOrder(a.tier_code);
            const orderB = b.features?.order !== undefined ? Number(b.features.order) : getTierDefaultOrder(b.tier_code);
            return orderA - orderB;
        });
    }, [plans]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Trigger child animations if needed (like progress bars)
                    const bars = entry.target.querySelectorAll('.bg-red-500, .bg-green-500');
                    if (bars.length > 0) {
                        bars.forEach(bar => {
                            if (bar.classList.contains('bg-red-500')) {
                                (bar as HTMLElement).style.width = '42%';
                            } else if (bar.classList.contains('bg-green-500')) {
                                (bar as HTMLElement).style.width = '95%';
                            }
                        });
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            observer.observe(el);
        });

        return () => {
            revealElements.forEach(el => {
                observer.unobserve(el);
            });
        };
    }, [loading, plans]);

    return (
        <>


            {/*  1. HEADER  */}


            {/*  2. HERO SECTION  */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/*  Background Blobs  */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    {/*  Left: Text  */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            AI V2.0 Now Live
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.15] mb-6 animate-fade-in-up" >
                            Build an 7<span className="text-gradient">ATS-Optimized</span> Resume in Minutes
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up" >
                            Stop getting rejected by bots. Upload your existing resume, paste the job description, and let our AI tailor your CV to land 3x more interviews.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" >
                            <Link to="/builder" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <i className="fa-solid fa-wand-magic-sparkles"></i> Build Resume
                            </Link>
                            <Link to="/ats-checker" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 border border-slate-200 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-indigo-300">
                                <i className="fa-solid fa-shield-halved"></i> Check ATS Score
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 animate-fade-in-up" >
                            <div className="flex -space-x-2">
                                <img src="https://ui-avatars.com/api/?name=John+Doe&background=cbd5e1&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=94a3b8&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://ui-avatars.com/api/?name=Alex+Ray&background=64748b&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                            </div>
                            <p>Join <span className="font-bold text-slate-700">50,000+</span> hired professionals</p>
                        </div>
                    </div>

                    {/*  Right: Visual  */}
                    <div className="relative hidden lg:block animate-slide-in-right" >
                        {/*  Main Resume Mockup  */}
                        <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-700 animate-float">
                            <div className="aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                                {/*  Mockup Content  */}
                                <div className="p-6 space-y-4 opacity-50 blur-[1px]">
                                    <div className="flex gap-4 items-center border-b pb-4 border-slate-200">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="w-48 h-4 bg-slate-300 rounded"></div>
                                            <div className="w-32 h-3 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full h-3 bg-slate-200 rounded"></div>
                                        <div className="w-full h-3 bg-slate-200 rounded"></div>
                                        <div className="w-3/4 h-3 bg-slate-200 rounded"></div>
                                    </div>
                                </div>

                                {/*  Floating Success Card  */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 z-20 w-64 hover:scale-105 transition-transform duration-300">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                                        92
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">ATS Optimized</h4>
                                        <p className="text-xs text-slate-500">Ready for application</p>
                                    </div>
                                    <div className="ml-auto text-green-500">
                                        <i className="fa-solid fa-circle-check text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Decorative Elements  */}
                        <div className="absolute top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </section>

            {/*  3. HOW IT WORKS  */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">How it works</h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">Three simple steps to your dream job. No design skills required.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/*  Step 1  */}
                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-100 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Upload Resume</h3>
                            <p className="text-slate-600 leading-relaxed">Upload your current PDF/DOCX or start from scratch. We extract your details instantly.</p>
                        </div>

                        {/*  Step 2  */}
                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-200 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-crosshairs"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Add Job Target</h3>
                            <p className="text-slate-600 leading-relaxed">Paste the job description you want to apply for. Our AI analyzes the keywords.</p>
                        </div>

                        {/*  Step 3  */}
                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-300 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Optimize & Download</h3>
                            <p className="text-slate-600 leading-relaxed">Our AI rewrites your bullets to match the job. Download as ATS-friendly PDF.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/*  4. KEY FEATURES  */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/*  Feature 1  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal">
                            <i className="fa-solid fa-robot text-3xl text-blue-500 mb-4 transition-transform group-hover:scale-110"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">AI Optimization</h3>
                            <p className="text-slate-600 text-sm">Rewrites your experience to sound more professional and impactful.</p>
                        </div>
                        {/*  Feature 2  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-100">
                            <i className="fa-solid fa-chart-pie text-3xl text-indigo-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">ATS Score Checker</h3>
                            <p className="text-slate-600 text-sm">See exactly what the bots see with our detailed parsing analysis.</p>
                        </div>
                        {/*  Feature 3  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-200">
                            <i className="fa-solid fa-briefcase text-3xl text-purple-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Job Description Match</h3>
                            <p className="text-slate-600 text-sm">Target specific keywords from the job listing to increase relevance.</p>
                        </div>
                        {/*  Feature 4  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal">
                            <i className="fa-solid fa-layer-group text-3xl text-teal-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Professional Templates</h3>
                            <p className="text-slate-600 text-sm">Clean, modern designs that are proven to pass ATS filters.</p>
                        </div>
                        {/*  Feature 5  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-100">
                            <i className="fa-solid fa-sliders text-3xl text-orange-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Tone Control</h3>
                            <p className="text-slate-600 text-sm">Choose between confident, technical, or leadership narrative tones.</p>
                        </div>
                        {/*  Feature 6  */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-200">
                            <i className="fa-solid fa-file-export text-3xl text-red-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">PDF & DOCX Export</h3>
                            <p className="text-slate-600 text-sm">Download in the format recruiters prefer with one click.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/*  5. ATS EXPLANATION  */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        <div className="lg:w-1/2 reveal">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
                                Why <span className="text-indigo-600">ATS Compatibility</span> Matters
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Simple formatting errors or missing keywords can cost you the interview.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl animate-pulse"></i>
                                    <span className="text-slate-700 font-medium">Pass automated screening bots</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl animate-pulse" ></i>
                                    <span className="text-slate-700 font-medium">Match hidden recruiter keywords</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl animate-pulse" ></i>
                                    <span className="text-slate-700 font-medium">Format correctly for parsing</span>
                                </li>
                            </ul>

                            <Link to="/ats-checker" className="group text-indigo-600 font-bold hover:text-indigo-700 border-b-2 border-indigo-200 hover:border-indigo-600 transition-all inline-flex items-center gap-2">
                                Check your resume score now <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </Link>
                        </div>

                        <div className="lg:w-1/2 w-full reveal delay-200">
                            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative text-white transform hover:scale-[1.01] transition-transform duration-500">
                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-slate-400 text-sm uppercase">Standard Resume</span>
                                        <span className="font-bold text-red-400">Score: 42/100</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[0%] animate-[progressFill_1.5s_ease-out_forwards] delay-300"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-indigo-300 text-sm uppercase">Optimized Resume</span>
                                        <span className="font-bold text-green-400">Score: 95/100</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[0%] shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-[progressFill_2s_ease-out_forwards] delay-500" ></div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-700 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl animate-bounce">
                                        <i className="fa-solid fa-rocket"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold">3x More Interviews</p>
                                        <p className="text-slate-400 text-sm">On average for optimized users</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/*  6. TEMPLATES PREVIEW (Grid)  */}
            <section id="templates" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Professional Templates</h2>
                        <p className="text-slate-600">Clean, parseable, and recruiter-approved.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/*  Template 1  */}
                        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden reveal">
                            <div className="aspect-[3/4] bg-slate-200 relative">
                                {/*  Mockup Visual  */}
                                <div className="absolute inset-4 bg-white shadow-sm flex flex-col p-4 gap-2 opacity-80 group-hover:scale-105 transition-transform duration-500">
                                    <div className="h-4 w-1/2 bg-slate-800"></div>
                                    <div className="h-2 w-full bg-slate-200"></div>
                                    <div className="h-24 w-full bg-slate-100 mt-2"></div>
                                </div>

                                {/*  Overlay  */}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link to="/builder" className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Use Template</Link>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 text-center">
                                <h4 className="font-bold text-slate-800">The Professional</h4>
                            </div>
                        </div>

                        {/*  Template 2  */}
                        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden reveal delay-100">
                            <div className="aspect-[3/4] bg-slate-200 relative">
                                <div className="absolute inset-4 bg-white shadow-sm flex flex-col p-4 gap-2 opacity-80 group-hover:scale-105 transition-transform duration-500">
                                    <div className="flex gap-4 h-full">
                                        <div className="w-1/3 bg-slate-100 h-full"></div>
                                        <div className="w-2/3 bg-white h-full space-y-2">
                                            <div className="h-4 w-3/4 bg-slate-800"></div>
                                            <div className="h-2 w-full bg-slate-200"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link to="/builder" className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Use Template</Link>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 text-center">
                                <h4 className="font-bold text-slate-800">The Modernist</h4>
                            </div>
                        </div>

                        {/*  Template 3  */}
                        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden reveal delay-200">
                            <div className="aspect-[3/4] bg-slate-200 relative">
                                <div className="absolute inset-4 bg-white shadow-sm flex flex-col p-4 gap-2 opacity-80 group-hover:scale-105 transition-transform duration-500">
                                    <div className="h-4 w-full bg-slate-800 text-center mb-4"></div>
                                    <div className="h-2 w-full bg-slate-200"></div>
                                    <div className="h-2 w-full bg-slate-200"></div>
                                    <div className="h-2 w-3/4 bg-slate-200"></div>
                                </div>
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link to="/builder" className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Use Template</Link>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 text-center">
                                <h4 className="font-bold text-slate-800">The Executive</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  7. EDITING MOCK (Split Layout Visual)  */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Live Editing Experience</h2>
                        <p className="text-slate-600">Real-time preview as you type. No more guessing.</p>
                    </div>

                    {/*  Fake Editor UI  */}
                    <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 reveal hover:shadow-indigo-500/20 transition-shadow duration-500">
                        <div className="h-8 bg-slate-800 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex h-[400px] md:h-[500px]">
                            {/*  Left Panel (Inputs)  */}
                            <div className="w-1/3 bg-white border-r border-slate-200 p-6 space-y-4 hidden md:block">
                                <div className="space-y-1">
                                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    <div className="h-8 w-full bg-slate-100 rounded border border-slate-200 animate-pulse"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    <div className="h-24 w-full bg-slate-100 rounded border border-slate-200 p-2">
                                        <div className="h-2 w-3/4 bg-slate-300 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <div className="h-10 w-full bg-indigo-600 rounded-lg opacity-90"></div>
                                </div>
                            </div>
                            {/*  Right Panel (Preview)  */}
                            <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm h-full bg-white shadow-lg p-6 space-y-3 transform hover:scale-[1.02] transition-transform duration-300">
                                    <div className="h-6 w-1/2 bg-slate-800"></div>
                                    <div className="h-3 w-full bg-slate-200"></div>
                                    <div className="h-3 w-full bg-slate-200"></div>
                                    <div className="mt-8 space-y-2">
                                        <div className="h-4 w-1/3 bg-slate-400"></div>
                                        <div className="h-2 w-full bg-slate-100"></div>
                                        <div className="h-2 w-full bg-slate-100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  8. SOCIAL PROOF  */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-16 reveal">Loved by job seekers</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/*  Card 1  */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className="text-slate-600 mb-6">"I applied to 50 jobs with my old resume and heard nothing. After using ResumeAI, I got 3 interviews in a week!"</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">SJ</div>
                                Sarah Jenkins
                            </div>
                        </div>
                        {/*  Card 2  */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal delay-100 hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className="text-slate-600 mb-6">"The ATS checker is a lifesaver. I didn't realize my resume format was unreadable by bots until now."</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">MD</div>
                                Mark Davis
                            </div>
                        </div>
                        {/*  Card 3  */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal delay-200 hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                            </div>
                            <p className="text-slate-600 mb-6">"Simple, fast, and the templates look amazing. Worth every penny for the Pro plan."</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">EL</div>
                                Emma Lee
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  9. PRICING PREVIEW  */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 reveal">Plans for every career stage</h2>
                    <p className="text-slate-500 mb-10 max-w-xl mx-auto reveal delay-100">Simple, transparent pricing tailored to your region.</p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mb-12 reveal delay-200">
                        <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in bg-slate-200 rounded-full focus:outline-none p-1"
                        >
                            <div
                                className="w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-sm"
                                style={{ transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }}
                            />
                        </button>
                        <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">SAVE 20%</span>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 items-stretch">
                            {sortedPlans.map((plan, idx) => {
                                const isPro = plan.tier_code === 'pro';
                                const isFree = plan.tier_code === 'free';
                                const features = getPlanFeatures(plan.tier_code);
                                const priceAmount = getPriceForCurrency(plan, isYearly);

                                return (
                                    <div
                                        key={plan.id || plan.tier_code || idx}
                                        className={cn(
                                            "p-8 rounded-3xl border transition-all duration-300 flex flex-col reveal",
                                            idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300",
                                            isPro
                                                ? "bg-slate-900 text-white border-indigo-500 shadow-2xl scale-105 z-10 relative"
                                                : "bg-white text-slate-700 border-slate-200 hover:shadow-xl hover:border-indigo-100"
                                        )}
                                    >
                                        {isPro && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-[10px] font-black text-white px-3 py-1 rounded-full animate-bounce uppercase tracking-tighter">
                                                Popular
                                            </div>
                                        )}

                                        <div className="mb-6 text-center">
                                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className={cn("text-4xl font-black", isPro ? "text-white" : "text-slate-900")}>
                                                    {isFree ? formatPrice(0) : formatPrice(priceAmount)}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {isFree ? '/forever' : isYearly ? '/yr' : '/mo'}
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="text-sm space-y-4 mb-8 flex-grow text-left">
                                            {features.slice(0, 5).map((f, i) => (
                                                <li key={i} className={cn(
                                                    "flex items-center gap-3",
                                                    !f.active ? "opacity-30 line-through" : ""
                                                )}>
                                                    {f.active ? (
                                                        <i className={cn("fa-solid fa-circle-check", isPro ? "text-indigo-400" : "text-emerald-500")}></i>
                                                    ) : (
                                                        <i className="fa-solid fa-circle-xmark text-slate-400"></i>
                                                    )}
                                                    <span className={cn(f.bold ? "font-bold" : "font-medium")}>{f.name}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            to="/pricing"
                                            className={cn(
                                                "block w-full py-3 rounded-xl font-bold text-sm transition-all",
                                                isPro
                                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            )}
                                        >
                                            {isFree ? 'Get Started' : 'View Plan'}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/*  10. FINAL CTA  */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="reveal relative z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Land your dream job today</h2>
                    <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals using AI to advance their careers.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/builder" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors transform hover:-translate-y-1">
                            Build Resume Free
                        </Link>
                        <Link to="/ats-checker" className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-900/50 transition-colors transform hover:-translate-y-1">
                            Check ATS Score
                        </Link>
                    </div>
                </div>
            </section>

            {/*  FOOTER  */}


            {/*  INTERSECTION OBSERVER FOR ANIMATIONS  */}


        </>
    );
}
