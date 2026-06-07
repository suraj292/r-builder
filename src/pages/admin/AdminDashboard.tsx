import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Stats {
  total_users: number;
  active_subscriptions: number;
  resumes_created: number;
  ai_usage_today: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<Stats>('/v1/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: 'fa-users', color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Revenue', value: `₹${stats?.total_revenue?.toLocaleString() || 0}`, icon: 'fa-sack-dollar', color: 'bg-indigo-600', trend: '+18%' },
    { label: 'Active Subs', value: stats?.active_subscriptions || 0, icon: 'fa-credit-card', color: 'bg-emerald-500', trend: '+5%' },
    { label: 'Resumes Created', value: stats?.resumes_created || 0, icon: 'fa-file-lines', color: 'bg-amber-500', trend: '+28%' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <i className="fa-solid fa-download mr-2"></i> Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
            <i className="fa-solid fa-plus mr-2"></i> New Action
          </button>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <i className={`fa-solid ${card.icon} text-xl`}></i>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <i className="fa-solid fa-arrow-up mr-1"></i> {card.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">User Growth</h3>
          <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <i className="fa-solid fa-chart-area text-4xl mb-3"></i>
              <p className="text-sm">Chart visualization would go here</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Revenue Overview</h3>
          <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <i className="fa-solid fa-chart-bar text-4xl mb-3"></i>
              <p className="text-sm">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
