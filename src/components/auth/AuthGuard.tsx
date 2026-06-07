import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { getAuthToken } from '../../lib/api';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useAuthStore();
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    // If we have no token and we're not loading, redirect to login
    if (!token && !isLoading) {
      navigate('/auth/login', { replace: true });
    }
  }, [token, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Authenticating...</p>
      </div>
    );
  }

  // If no token, don't render children (redirect will happen)
  if (!token) {
    return null;
  }

  return <>{children}</>;
}
