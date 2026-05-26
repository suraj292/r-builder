import { create } from 'zustand';
import { api, clearAuthToken, getAuthToken } from '../lib/api';

interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin' | 'super_admin' | 'content_manager' | 'support';
  is_active: boolean;
  is_premium: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  fetchUser: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const user = await api.get<User>('/v1/users/me');
      set({ user, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch user', err);
      set({ user: null, isLoading: false, error: err.message });
      clearAuthToken();
    }
  },

  logout: () => {
    clearAuthToken();
    set({ user: null });
    window.location.href = '/auth/login';
  },

  isAdmin: () => {
    const user = get().user;
    return !!user && ['admin', 'super_admin', 'support', 'content_manager'].includes(user.role);
  }
}));
