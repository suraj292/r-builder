import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';

type Tab = 'personal' | 'security' | 'preferences' | 'subscription';

export default function Profile() {
    const { user, fetchUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Form states
    const [fullName, setFullName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setJobTitle((user as any).job_title || '');
            setEmail(user.email || '');
            setPhone((user as any).phone_number || '');
            setLocation((user as any).location || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            await api.patch('/v1/users/me', {
                full_name: fullName,
                job_title: jobTitle,
                phone_number: phone,
                location: location,
            });
            await fetchUser();
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/*  1. HEADER  */}
            <header className="glass-header sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 -mt-6 -ml-6 -mr-6 mb-6">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                            <i className="fa-solid fa-file-contract"></i>
                        </div>
                        <span className="text-lg font-display font-bold text-slate-800 tracking-tight">Resume<span className="text-indigo-600">BP</span></span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{user?.is_premium ? 'Pro Member' : 'Free Plan'}</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <img src={(user as any)?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name?.replace(' ', '+')}&background=6366f1&color=fff`} className="w-9 h-9 rounded-full border-2 border-white shadow-sm hover:border-indigo-200 transition-all" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-10 max-w-5xl min-h-screen">

                <div className="grid lg:grid-cols-12 gap-8">

                    {/*  LEFT: Navigation & Profile Card  */}
                    <div className="lg:col-span-3 space-y-6">

                        {/*  2. PROFILE OVERVIEW  */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center animate-slide-up">
                            <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                                <img src={(user as any)?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name?.replace(' ', '+')}&background=6366f1&color=fff&size=128`} className="w-full h-full rounded-full border-4 border-slate-50 shadow-inner" id="avatar-preview" />
                                <div className="absolute inset-0 bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{user?.full_name}</h2>
                            <p className="text-xs text-slate-500 mb-4">{user?.email}</p>

                            <div className={`inline-block px-3 py-1 ${user?.is_premium ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'} text-xs font-bold rounded-full mb-4`}>
                                {user?.is_premium ? 'Pro Plan' : 'Free Plan'}
                            </div>

                            {!user?.is_premium && (
                                <Link to="/pricing" className="block w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors text-center">Upgrade to Premium</Link>
                            )}
                        </div>

                        {/*  3. SIDE NAV (Tabs)  */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {[
                                { id: 'personal', label: 'Personal Info', icon: 'fa-user' },
                                { id: 'security', label: 'Security', icon: 'fa-shield-halved' },
                                { id: 'preferences', label: 'Preferences', icon: 'fa-sliders' },
                                { id: 'subscription', label: 'Subscription', icon: 'fa-credit-card' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all border-l-4 ${activeTab === tab.id
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                                        : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <i className={`fa-solid ${tab.icon} w-5`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/*  8. QUICK STATS  */}
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg animate-slide-up" >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Account Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Member Since</span>
                                    <span className="font-bold text-xs">{user ? new Date(user.created_at).toLocaleDateString() : '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Registration</span>
                                    <span className="font-bold text-xs capitalize">{(user as any)?.registration_source}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                                    <span className="text-sm text-slate-300">Status</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${user?.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {user?.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  RIGHT: Content Area  */}
                    <div className="lg:col-span-9">

                        {/* Notification Area */}
                        {successMessage && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 animate-fade-in">
                                <i className="fa-solid fa-circle-check"></i>
                                <span className="text-sm font-bold">{successMessage}</span>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 animate-fade-in">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                <span className="text-sm font-bold">{errorMessage}</span>
                            </div>
                        )}

                        {/*  4. PERSONAL INFO TAB  */}
                        {activeTab === 'personal' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-fade-in">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                                    <p className="text-sm text-slate-500">Update your personal details and contact information.</p>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title</label>
                                            <input
                                                type="text"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="e.g. Software Engineer"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 bg-slate-50 text-sm cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed once registered.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="City, Country"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="save-btn px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-70"
                                        >
                                            {isSaving ? (
                                                <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</>
                                            ) : (
                                                <span>Save Changes</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/*  5. SECURITY TAB  */}
                        {activeTab === 'security' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-fade-in">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Account Security</h2>
                                    <p className="text-sm text-slate-500">Manage your password and security settings.</p>
                                </div>

                                {(user as any)?.registration_source !== 'email' ? (
                                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                                        <i className="fa-solid fa-lock text-indigo-600 text-3xl mb-4"></i>
                                        <h3 className="font-bold text-slate-900 mb-2">OAuth Authentication</h3>
                                        <p className="text-sm text-slate-600 max-w-sm mx-auto">
                                            You are signed in via <strong>{(user as any)?.registration_source}</strong>.
                                            Password management is handled by your provider.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6 max-w-xl">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
                                                <input type="password" placeholder="New password" className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm Password</label>
                                                <input type="password" placeholder="Confirm password" className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            <button type="submit" className="save-btn px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all transform active:scale-95">
                                                Update Password
                                            </button>
                                            {user?.last_password_reset && (
                                                <span className="text-xs text-slate-400">Last updated: {new Date((user as any).last_password_reset).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </form>
                                )}

                                {/*  9. DANGER ZONE (Inside Security)  */}
                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <h3 className="text-red-600 font-bold mb-4">Danger Zone</h3>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Delete Account</h4>
                                            <p className="text-xs text-slate-500">Permanently remove your account and all data.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for other tabs */}
                        {(activeTab === 'preferences' || activeTab === 'subscription') && (
                            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center h-full animate-fade-in">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                                    <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h3>
                                <p className="text-sm text-slate-500">We're working hard to bring this feature to life.</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </>
    );
}
