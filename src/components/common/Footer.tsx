import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-sm group-hover:rotate-12 transition-transform duration-300">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                Resume<span className="text-indigo-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Create professional, ATS-optimized resumes in minutes with AI-powered suggestions and dynamic layouts.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/builder" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-slate-600"></i>
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-[10px] text-slate-600"></i>
                  ATS Resume Checker
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-[10px] text-slate-600"></i>
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-building text-[10px] text-slate-600"></i>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-blog text-[10px] text-slate-600"></i>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-circle-question text-[10px] text-slate-600"></i>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-[10px] text-slate-600"></i>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/legal/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-shield text-[10px] text-slate-600"></i>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-file-contract text-[10px] text-slate-600"></i>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/refund-policy" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-hand-holding-dollar text-[10px] text-slate-600"></i>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/shipping-policy" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-truck text-[10px] text-slate-600"></i>
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              <i className="fa-brands fa-twitter text-lg"></i>
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              <i className="fa-brands fa-github text-lg"></i>
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              <i className="fa-brands fa-linkedin text-lg"></i>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
