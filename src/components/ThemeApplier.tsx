import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

const FONT_FAMILIES = {
  system: 'system-ui, -apple-system, sans-serif',
  inter: '"Inter", system-ui, sans-serif',
  'dm-sans': '"DM Sans", system-ui, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

const FONT_SIZES = {
  compact: '13px',
  default: '14px',
  large: '16px',
};

const DENSITY_PADDING = {
  compact: '0.5rem',
  default: '0.75rem',
  spacious: '1.25rem',
};

export function ThemeApplier() {
  const theme = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply dark/light mode
    root.classList.remove('light', 'dark');
    if (theme.mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme.mode);
    }

    // Apply CSS custom properties
    root.style.setProperty('--primary-custom', theme.primaryColor);
    root.style.setProperty('--sidebar-color', theme.sidebarColor);
    root.style.setProperty('--accent-custom', theme.accentColor);
    root.style.setProperty('--background-custom', theme.backgroundColor);
    root.style.setProperty('--card-custom', theme.cardColor);
    root.style.setProperty('--radius', `${theme.borderRadius}rem`);
    root.style.setProperty('--font-family', FONT_FAMILIES[theme.fontFamily]);
    root.style.setProperty('--font-size-base', FONT_SIZES[theme.fontSize]);
    root.style.setProperty('--density-padding', DENSITY_PADDING[theme.density]);

    // Override primary color in both light and dark
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--ring', theme.primaryColor);

    // Background and card
    if (theme.activePresetId !== 'singularity-light' && theme.activePresetId !== 'singularity-dark') {
      root.style.setProperty('--background', theme.backgroundColor);
      root.style.setProperty('--card', theme.cardColor);
    }
  }, [theme]);

  return null;
}
