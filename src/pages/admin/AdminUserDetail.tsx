import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { showAlert } from '../../lib/alerts';
import Swal from 'sweetalert2';

interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  registration_source: string;
  last_login: string | null;
  is_active: boolean;
  is_premium: boolean;
  ai_credits_used: number;
  ats_scans_used: number;
  created_at: string;
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await api.get<User>(`/v1/admin/users/${id}`);
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user', err);
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const action = user.is_active ? 'deactivate/ban' : 'activate';
    const confirmed = await showAlert.confirm("Update Status", `Are you sure you want to ${action} user ${user.email}?`);
    if (!confirmed) return;

    try {
      await api.post(`/v1/admin/users/${user.id}/toggle-status`);
      fetchUser();
      showAlert.success("Success", `User has been ${user.is_active ? 'banned' : 'activated'} successfully.`);
    } catch (err) {
      showAlert.error("Error", "Failed to update user status.");
    }
  };

  const handleResetQuotas = async () => {
    if (!user) return;
    const confirmed = await showAlert.confirm("Reset Quotas", `Are you sure you want to reset AI and ATS quotas for ${user.email}?`);
    if (!confirmed) return;

    try {
      await api.post(`/v1/admin/users/${user.id}/reset-quotas`);
      fetchUser();
      showAlert.success("Success", "Quotas reset successfully.");
    } catch (err) {
      showAlert.error("Error", "Failed to reset quotas.");
    }
  };

  const handleAdjustCredits = async () => {
    if (!user) return;
    
    const { value: amountStr } = await Swal.fire({
      title: 'Adjust AI Credits',
      input: 'text',
      inputLabel: `Enter credits to add to ${user.email} (use negative to deduct):`,
      inputValue: '100',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'rounded-3xl shadow-xl font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 mr-2',
        cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white'
      }
    });

    if (amountStr === undefined) return;
    
    const amount = parseInt(amountStr);
    if (isNaN(amount)) {
      return showAlert.error("Invalid Number", "Please provide a valid integer amount.");
    }

    try {
      await api.post(`/v1/admin/users/${user.id}/adjust-credits`, { amount, reason: "Admin manual adjustment" });
      fetchUser();
      showAlert.success("Success", "Credits adjusted successfully.");
    } catch (err) {
      showAlert.error("Error", "Failed to adjust credits.");
    }
  };

  const handleUpdateRole = async () => {
    if (!user) return;
    if (currentUser?.role !== 'super_admin') {
      return showAlert.error("Denied", "Only Super Admins can modify roles.");
    }

    const { value: newRole } = await Swal.fire({
      title: 'Update User Role',
      input: 'select',
      inputLabel: `Update access level for ${user.email}`,
      inputOptions: {
        user: 'User',
        admin: 'Admin',
        support: 'Support',
        content_manager: 'Content Manager',
        super_admin: 'Super Admin'
      },
      inputValue: user.role,
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'rounded-3xl shadow-xl font-sans',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 mr-2',
        cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-bold text-white'
      }
    });

    if (!newRole || newRole === user.role) return;

    try {
      await api.patch(`/v1/admin/users/${user.id}/role?new_role=${newRole}`);
      fetchUser();
      showAlert.success("Success", "User role updated successfully.");
    } catch (err) {
      showAlert.error("Error", "Failed to update role.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-2">
        <button 
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold cursor-pointer"
        >
            <i className="fa-solid fa-arrow-left"></i> Back to Users
        </button>
        <div className="flex gap-2">
            <button 
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    user.is_active 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                }`}
            >
                {user.is_active ? 'Ban User' : 'Unban User'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-50 shadow-inner overflow-hidden">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${(user.full_name || user.email).replace(' ', '+')}&background=6366f1&color=fff&size=128`} 
                        className="w-full h-full object-cover"
                        alt="Avatar"
                    />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.full_name || 'Anonymous'}</h2>
                <p className="text-sm text-slate-500 mb-4">{user.email}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                        {user.role}
                    </span>
                    {user.is_premium && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                            PRO
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Account Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">AI Credits Used</span>
                        <span className="text-sm font-bold">{user.ai_credits_used}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">ATS Scans Used</span>
                        <span className="text-sm font-bold">{user.ats_scans_used}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-400">Registration</span>
                        <div className="flex items-center gap-1.5 capitalize text-xs">
                            <i className={`fa-brands ${
                                user.registration_source === 'google' ? 'fa-google text-rose-400' :
                                user.registration_source === 'github' ? 'fa-github' :
                                user.registration_source === 'linkedin' ? 'fa-linkedin text-blue-400' :
                                'fa-envelope text-slate-400'
                            }`}></i>
                            {user.registration_source}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Management Controls */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Administrative Tools</h3>
                    <p className="text-xs text-slate-500">Manual overrides for user limits and permissions.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Subscription Management</p>
                            <p className="text-xs text-slate-500">View validity, invoices and email user.</p>
                        </div>
                        <button 
                            onClick={() => navigate(`/admin/subscriptions/${user.id}`)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-sm"
                        >
                            Manage Sub
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Role Management</p>
                            <p className="text-xs text-slate-500">Modify user access level and permissions.</p>
                        </div>
                        <button 
                            onClick={handleUpdateRole}
                            disabled={currentUser?.role !== 'super_admin'}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                            Change Role
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">AI Credit Adjustment</p>
                            <p className="text-xs text-slate-500">Manually add or remove credits from current usage.</p>
                        </div>
                        <button 
                            onClick={handleAdjustCredits}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                            Adjust Credits
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Reset Usage Quotas</p>
                            <p className="text-xs text-slate-500">Instantly reset AI and ATS counters to zero.</p>
                        </div>
                        <button 
                            onClick={handleResetQuotas}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                            Reset Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Audit Logs Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Account Activity</h3>
                    <p className="text-xs text-slate-500">System logs for this user.</p>
                </div>
                <div className="p-12 text-center text-slate-400">
                    <i className="fa-solid fa-clock-rotate-left text-3xl mb-4 opacity-20"></i>
                    <p className="text-sm italic">Audit logging integration coming soon.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
