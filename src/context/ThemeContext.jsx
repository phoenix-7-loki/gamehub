import React, { createContext, useContext, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { darkMode, toggleDarkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);