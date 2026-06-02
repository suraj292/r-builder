import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';

export default function AnalyticsCenter() {
    const [stats, setStats] = useState([
        { label: 'Total Visitors', value: '0', change: '0%', icon: 'fa-users', color: 'indigo' },
        { label: 'Organic Traffic', value: '0', change: '0%', icon: 'fa-leaf', color: 'emerald' },
        { label: 'AI Referral', value: '0', change: '0%', icon: 'fa-robot', color: 'amber' },
        { label: 'Avg. Bounce Rate', value: '0%', change: '0%', icon: 'fa-person-running', color: 'rose' },
    ]);

    const [channels, setChannels] = useState([
        { name: 'Google Search', share: 0, color: 'bg-emerald-500' },
        { name: 'Direct', share: 0, color: 'bg-indigo-500' },
        { name: 'Social', share: 0, color: 'bg-amber-50' },
        { name: 'AI Bots', share: 0, color: 'bg-rose-50' },
    ]);

    const [hasData, setHasData] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in relative">
            {!hasData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] rounded-[40px] -m-4">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">No Analytics Data Yet</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We haven't detected any traffic yet. To see real-time data, ensure you've connected your Google Analytics 4 (GA4) account.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link 
                                to="/admin/visibility/google"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                            >
                                <i className="fa-brands fa-google"></i>
                                Connect Google Analytics
                            </Link>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Data will begin appearing here within 24-48 hours of connection.</p>
                    </div>
                </div>
            )}

            <div className={`${!hasData ? 'opacity-30 grayscale pointer-events-none blur-[1px]' : ''} space-y-8`}>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <i className="fa-solid fa-chart-pie text-indigo-600"></i>
                        Analytics Center
                    </h1>
                    <p className="text-slate-500 text-sm">Monitor traffic sources, conversion rates, and the impact of your SEO and AI discovery efforts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-400`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                        <h3 className="font-bold text-lg text-slate-900">Traffic Source Distribution</h3>
                        <div className="space-y-6">
                            {channels.map((ch, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-600">{ch.name}</span>
                                        <span className="text-slate-900">{ch.share}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${ch.color} rounded-full transition-all duration-1000`} style={{ width: `${ch.share}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col gap-6">
                        <h3 className="font-bold text-lg text-slate-900">Conversion Goals</h3>
                        <div className="space-y-4 flex-1">
                            {[
                                { label: 'Resume Downloads', value: 0, total: 100, color: 'indigo' },
                                { label: 'New Signups', value: 0, total: 100, color: 'emerald' },
                                { label: 'Contact Inquiries', value: 0, total: 100, color: 'amber' },
                            ].map((goal, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-700">{goal.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{goal.value} / {goal.total}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                                        <div className={`h-full bg-${goal.color}-500`} style={{ width: `0%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-colors">
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
