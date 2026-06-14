import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function AnalyticsCenter() {
    const [stats, setStats] = useState([
        { label: 'Active Users', value: '0', change: '0%', icon: 'fa-users', color: 'indigo', key: 'activeUsers' },
        { label: 'New Users', value: '0', change: '0%', icon: 'fa-user-plus', color: 'emerald', key: 'newUsers' },
        { label: 'Page Views', value: '0', change: '0%', icon: 'fa-eye', color: 'amber', key: 'screenPageViews' },
        { label: 'Avg. Bounce Rate', value: '0%', change: '0%', icon: 'fa-person-running', color: 'rose', key: 'avgBounceRate' },
    ]);

    const [channels, setChannels] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const [hasData, setHasData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState(30);
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [isCustom, setIsCustom] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [days, isCustom, customRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            let url = `/v1/admin/visibility/google/analytics`;
            if (isCustom && customRange.start && customRange.end) {
                url += `?start_date=${customRange.start}&end_date=${customRange.end}`;
            } else {
                url += `?days=${days}`;
            }

            const data = await api.get<any>(url);
            
            if (data.has_data) {
                setHasData(true);
                // ... (rest of logic)
                const newStats = stats.map(s => ({
                    ...s,
                    value: s.key === 'avgBounceRate' ? `${data.stats[s.key]}%` : data.stats[s.key].toLocaleString()
                }));
                setStats(newStats);

                const channelColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];
                const newChannels = data.sources.sources.map((s: any, idx: number) => ({
                    name: s.name === '(none)' ? 'Direct' : s.name.charAt(0).toUpperCase() + s.name.slice(1),
                    share: s.share,
                    color: channelColors[idx % channelColors.length]
                }));
                setChannels(newChannels);
                setRegions(data.regions || []);
            } else {
                setHasData(false);
                setError(data.error || 'No data returned from Google Analytics.');
            }
        } catch (err: any) {
            console.error('Failed to fetch analytics', err);
            setError(err.message || 'Connection to backend failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-slate-400 italic">Fetching live metrics...</div>;

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* ... error overlay ... */}
            {!hasData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] rounded-[40px] -m-4">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">
                                {error?.includes('Property ID') ? 'Property ID Required' : 'No Analytics Data Yet'}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {error || "We haven't detected any traffic yet. To see real-time data, ensure you've connected your Google Analytics 4 (GA4) account."}
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link 
                                to="/admin/visibility/google"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                            >
                                <i className="fa-brands fa-google"></i>
                                {error?.includes('Property ID') ? 'Enter Property ID' : 'Check Google Settings'}
                            </Link>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                            {error?.includes('Permission') ? 'Tip: Add your Service Account email as a Viewer in GA4 Admin.' : 'Data will begin appearing here within 24-48 hours of connection.'}
                        </p>
                    </div>
                </div>
            )}

            <div className={`${!hasData ? 'opacity-30 grayscale pointer-events-none blur-[1px]' : ''} space-y-8`}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <i className="fa-solid fa-chart-pie text-indigo-600"></i>
                            Analytics Center
                        </h1>
                        <p className="text-slate-500 text-sm">Monitor traffic sources, conversion rates, and the impact of your SEO and AI discovery efforts.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {isCustom && (
                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                                <input 
                                    type="date" 
                                    value={customRange.start} 
                                    onChange={e => setCustomRange({ ...customRange, start: e.target.value })}
                                    className="bg-transparent text-[10px] font-bold text-slate-600 focus:outline-none px-2"
                                />
                                <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
                                <input 
                                    type="date" 
                                    value={customRange.end} 
                                    onChange={e => setCustomRange({ ...customRange, end: e.target.value })}
                                    className="bg-transparent text-[10px] font-bold text-slate-600 focus:outline-none px-2"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                            {[
                                { label: '7D', value: 7, type: 'fixed' },
                                { label: '30D', value: 30, type: 'fixed' },
                                { label: '90D', value: 90, type: 'fixed' },
                                { label: 'Custom', value: 0, type: 'custom' },
                            ].map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => {
                                        if (range.type === 'custom') {
                                            setIsCustom(true);
                                        } else {
                                            setIsCustom(false);
                                            setDays(range.value);
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        (range.type === 'custom' && isCustom) || (!isCustom && days === range.value && range.type !== 'custom')
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
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
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900">Traffic Source Distribution</h3>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last {days} Days</div>
                        </div>
                        <div className="space-y-6">
                            {channels.length > 0 ? channels.map((ch, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-600">{ch.name}</span>
                                        <span className="text-slate-900">{ch.share}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${ch.color} rounded-full transition-all duration-1000`} style={{ width: `${ch.share}%` }}></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center text-slate-400 italic text-sm">No source data for this period.</div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Top Regions (by Active Users)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {regions.length > 0 ? regions.map((reg, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{reg.country}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{reg.users.toLocaleString()}</span>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-6 text-center text-slate-400 italic text-sm">No regional data for this period.</div>
                                )}
                            </div>
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
