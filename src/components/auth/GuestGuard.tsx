import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { getAuthToken } from '../../lib/api';

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    // If we have a user and a token, redirect away from guest-only pages (like login)
    if (token && !isLoading && user) {
      navigate('/builder', { replace: true });
    }
  }, [token, isLoading, user, navigate]);

  if (isLoading && token) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
