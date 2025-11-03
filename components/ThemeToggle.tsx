import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-text-muted-light dark:text-text-muted-dark hover:bg-secondary-light/50 dark:hover:bg-user-bubble-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};