import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 text-4xl mb-8 animate-bounce">
        <i className="fa-solid fa-compass"></i>
      </div>
      <h1 className="text-6xl font-display font-bold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Oops! The page you're looking for at <code className="bg-slate-200 px-2 py-1 rounded text-slate-700 font-mono text-sm">{location.pathname}</code> doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all transform hover:-translate-y-1"
      >
        Back to Home
      </Link>
    </div>
  );
}
