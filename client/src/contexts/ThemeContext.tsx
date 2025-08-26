import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'corporate' | 'doodle';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('corporate');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ui-theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ui-theme', theme);
    document.documentElement.classList.toggle('doodle-theme', theme === 'doodle');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'corporate' ? 'doodle' : 'corporate');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};