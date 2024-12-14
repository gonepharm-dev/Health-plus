import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Custom colors
export const colors = {

};

const getInitialTheme = (): Theme => {
  if (!browser) return 'light';
  
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme = writable<Theme>(getInitialTheme());

if (browser) {
  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      theme.set(e.matches ? 'dark' : 'light');
    }
  });

  // Update theme when store changes
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}