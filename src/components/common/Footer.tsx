import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs group-hover:rotate-12 transition-transform">
                    <i className="fa-solid fa-layer-group"></i>
                </div>
                <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">ResumeAI</span>
            </div>
            <div className="flex gap-6 text-sm">
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-sm">
                &copy; 2024 ResumeAI. All rights reserved.
            </div>
        </div>
    </footer>
  );
}
