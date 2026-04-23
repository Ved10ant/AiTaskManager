import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const savedTheme: Theme = 'dark';

// Apply theme to document on load
document.documentElement.classList.add('dark');

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  toggleTheme: () => {}, // No-op to preserve 'dark' only
  setTheme: () => {},     // No-op to preserve 'dark' only
}));
