'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Force light mode while dark mode toggle is hidden
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    // Clear any previously saved dark preference and ensure light mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('printify-theme', 'light');
  }, []);

  const toggleTheme = () => {
    // No-op while dark mode is disabled
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
