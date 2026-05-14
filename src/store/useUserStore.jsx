import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api';

const useUserStore = create(
  persist(
    (set, get) => ({
      userEmail: null,
      userRole: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { role, token } = response.data;
          localStorage.setItem('token', token);
          set({ userEmail: email, userRole: role, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Erreur de connexion', isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ userEmail: null, userRole: null });
      },
      
      fetchUserRole: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ userEmail: response.data.email, userRole: response.data.role });
        } catch (error) {
          console.error('Erreur récupération utilisateur', error);
          set({ userEmail: null, userRole: null });
        }
      }
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ userEmail: state.userEmail, userRole: state.userRole }),
    }
  )
);

export default useUserStore;