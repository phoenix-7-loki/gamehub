import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (mode) => set({ darkMode: mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;