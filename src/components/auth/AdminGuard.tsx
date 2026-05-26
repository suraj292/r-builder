import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin())) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Verifying Admin Permissions...</p>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
