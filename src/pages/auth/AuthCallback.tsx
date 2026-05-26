import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken } from '../../lib/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setAuthToken(token);
      navigate('/builder');
    } else {
      console.error('No token found in callback URL');
      navigate('/auth/login');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800">Authenticating...</h2>
        <p className="text-slate-500">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
}
