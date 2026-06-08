import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        localStorage.setItem('zed_token', token);
        set({ user, token, error: null });
      },

      logout: () => {
        localStorage.removeItem('zed_token');
        set({ user: null, token: null });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          get().setAuth(data.user, data.token);
          return data;
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (form) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', form);
          get().setAuth(data.user, data.token);
          return data;
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMe: async () => {
        const token = get().token || localStorage.getItem('zed_token');
        if (!token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },

      isStaff: () => {
        const role = get().user?.role;
        return ['super_admin', 'manager', 'waiter', 'chef'].includes(role);
      },

      isAdmin: () => ['super_admin', 'manager'].includes(get().user?.role),
      isChef: () => ['super_admin', 'manager', 'chef'].includes(get().user?.role),
    }),
    {
      name: 'zed-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);
