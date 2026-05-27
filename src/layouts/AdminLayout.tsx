import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'fa-chart-line' },
  { path: '/admin/users', label: 'Users', icon: 'fa-users' },
  { path: '/admin/resumes', label: 'Resumes', icon: 'fa-file-lines' },
  { path: '/admin/plans', label: 'Plans', icon: 'fa-credit-card' },
  { path: '/admin/templates', label: 'Templates', icon: 'fa-table-columns' },
  { path: '/admin/ai', label: 'AI Management', icon: 'fa-robot' },
  { path: '/admin/settings', label: 'Settings', icon: 'fa-gear' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <span className="font-bold text-lg text-white">Admin<span className="text-indigo-400">Panel</span></span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400">
            <i className="fa-solid fa-arrow-left-long w-5"></i>
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-900/20 hover:text-rose-400 transition-all text-slate-400 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="font-bold text-slate-800 capitalize">
            {navItems.find(item => item.path === location.pathname)?.label || 'Admin'}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <i className="fa-regular fa-bell"></i>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user?.full_name || user?.email}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
