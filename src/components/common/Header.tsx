import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

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
                    <Link to="/#templates" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Templates</Link>
                    <Link to="/pricing" className={`text-sm font-medium transition-colors ${currentPath === '/pricing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Pricing</Link>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log In</Link>
                    <Link to="/builder" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        Get Started Free
                    </Link>
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
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 top-20">
                    <Link to="/" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/builder" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Resume Builder</Link>
                    <Link to="/ats-checker" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>ATS Checker</Link>
                    <Link to="/pricing" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                    <hr className="border-slate-100" />
                    <Link to="/auth/login" className="block text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                    <Link to="/builder" className="block w-full text-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-500" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started Free
                    </Link>
                </div>
            )}
        </nav>
    );
}
