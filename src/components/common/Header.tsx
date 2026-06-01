import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const { user, logout, isAdmin } = useAuthStore();

    return (
        <nav id="navbar" className="glass-header fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">Resume<span className="text-indigo-600">AI</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`text-sm font-medium transition-colors ${currentPath === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Home</Link>
                    <Link to="/builder" className={`text-sm font-medium transition-colors ${currentPath.startsWith('/builder') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Resume Builder</Link>
                    <Link to="/ats-checker" className={`text-sm font-medium transition-colors ${currentPath === '/ats-checker' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>ATS Checker</Link>
                    <Link to="/pricing" className={`text-sm font-medium transition-colors ${currentPath === '/pricing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Pricing</Link>
                    
                    {/* Resources Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus:outline-none cursor-pointer ${
                                currentPath.startsWith('/blog') || currentPath === '/about' || currentPath === '/faq' || currentPath === '/contact'
                                    ? 'text-indigo-600'
                                    : 'text-slate-600 hover:text-indigo-600'
                            }`}
                        >
                            Resources
                            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {isResourcesOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsResourcesOpen(false)} />
                                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-3 duration-200">
                                    <div className="p-1.5 space-y-0.5">
                                        <Link
                                            to="/blog"
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                                currentPath.startsWith('/blog') ? 'bg-slate-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            onClick={() => setIsResourcesOpen(false)}
                                        >
                                            <i className="fa-solid fa-blog text-slate-400 w-4 text-center"></i>
                                            Blog
                                        </Link>
                                        <Link
                                            to="/about"
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                                currentPath === '/about' ? 'bg-slate-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            onClick={() => setIsResourcesOpen(false)}
                                        >
                                            <i className="fa-solid fa-building text-slate-400 w-4 text-center"></i>
                                            About Us
                                        </Link>
                                        <Link
                                            to="/faq"
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                                currentPath === '/faq' ? 'bg-slate-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            onClick={() => setIsResourcesOpen(false)}
                                        >
                                            <i className="fa-solid fa-circle-question text-slate-400 w-4 text-center"></i>
                                            FAQ
                                        </Link>
                                        <Link
                                            to="/contact"
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                                currentPath === '/contact' ? 'bg-slate-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            onClick={() => setIsResourcesOpen(false)}
                                        >
                                            <i className="fa-solid fa-envelope text-slate-400 w-4 text-center"></i>
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* CTA / Auth Dropdown */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 transition-all duration-200 cursor-pointer focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-bold text-slate-800 leading-tight">
                                        {user.full_name || user.email.split('@')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-400 capitalize">
                                        {user.role === 'user' && user.is_premium ? 'Premium User' : user.role.replace('_', ' ')}
                                    </p>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-3 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                                        </div>
                                        
                                        <div className="p-1.5 space-y-0.5">
                                            <Link 
                                                to="/user/resumes" 
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <i className="fa-solid fa-file-lines text-slate-400 w-4 text-center"></i>
                                                My Resumes
                                            </Link>
                                            
                                            <Link 
                                                to="/user/profile" 
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <i className="fa-solid fa-user text-slate-400 w-4 text-center"></i>
                                                Profile Settings
                                            </Link>
                                            
                                            {isAdmin() && (
                                                <Link 
                                                    to="/admin" 
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <i className="fa-solid fa-shield-halved w-4 text-center"></i>
                                                    Admin Panel
                                                </Link>
                                            )}
                                        </div>
                                        
                                        <div className="border-t border-slate-50 p-1.5 mt-1.5">
                                            <button 
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer text-left focus:outline-none"
                                            >
                                                <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log In</Link>
                            <Link to="/builder" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                Get Started Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-600 text-xl focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <Link to="/" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/builder" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Resume Builder</Link>
                    <Link to="/ats-checker" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>ATS Checker</Link>
                    <Link to="/pricing" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                    <Link to="/blog" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                    <Link to="/about" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                    <Link to="/faq" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
                    <Link to="/contact" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                    <hr className="border-slate-100" />
                    
                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-1 py-1">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {user.full_name || user.email.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pl-1">
                                <Link 
                                    to="/user/resumes" 
                                    className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="fa-solid fa-file-lines text-slate-400 w-4 text-center"></i>
                                    My Resumes
                                </Link>
                                <Link 
                                    to="/user/profile" 
                                    className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="fa-solid fa-user text-slate-400 w-4 text-center"></i>
                                    Profile Settings
                                </Link>
                                {isAdmin() && (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center gap-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <i className="fa-solid fa-shield-halved w-4 text-center"></i>
                                        Admin Panel
                                    </Link>
                                )}
                            </div>
                            
                            <hr className="border-slate-100" />
                            
                            <button 
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold shadow-sm hover:bg-rose-50 transition-all text-center justify-center cursor-pointer focus:outline-none"
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Link to="/auth/login" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                            <Link to="/builder" className="block w-full text-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-500" onClick={() => setIsMobileMenuOpen(false)}>
                                Get Started Free
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
