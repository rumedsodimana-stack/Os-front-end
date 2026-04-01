import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DensityMode = 'compact' | 'default' | 'spacious';
export type FontFamily = 'system' | 'inter' | 'dm-sans' | 'playfair' | 'mono';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  primaryColor: string;
  sidebarColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  borderRadius: number;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'singularity-light',
    name: 'Singularity Light',
    description: 'Clean and professional',
    mode: 'light',
    primaryColor: '#8b5cf6',
    sidebarColor: '#7c3aed',
    accentColor: '#8b5cf6',
    backgroundColor: '#f3f4f6',
    cardColor: '#ffffff',
    borderRadius: 1,
  },
  {
    id: 'singularity-dark',
    name: 'Singularity Dark',
    description: 'Easy on the eyes',
    mode: 'dark',
    primaryColor: '#8b5cf6',
    sidebarColor: '#4c1d95',
    accentColor: '#a78bfa',
    backgroundColor: '#0f172a',
    cardColor: '#1e293b',
    borderRadius: 1,
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Coastal & calm',
    mode: 'light',
    primaryColor: '#0ea5e9',
    sidebarColor: '#0369a1',
    accentColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    cardColor: '#ffffff',
    borderRadius: 0.75,
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Nature & growth',
    mode: 'light',
    primaryColor: '#10b981',
    sidebarColor: '#065f46',
    accentColor: '#10b981',
    backgroundColor: '#f0fdf4',
    cardColor: '#ffffff',
    borderRadius: 1,
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Luxury boutique',
    mode: 'light',
    primaryColor: '#f43f5e',
    sidebarColor: '#be123c',
    accentColor: '#fb7185',
    backgroundColor: '#fff1f2',
    cardColor: '#ffffff',
    borderRadius: 1.25,
  },
  {
    id: 'sand-stone',
    name: 'Sand & Stone',
    description: 'Desert heritage',
    mode: 'light',
    primaryColor: '#d97706',
    sidebarColor: '#92400e',
    accentColor: '#f59e0b',
    backgroundColor: '#fffbeb',
    cardColor: '#ffffff',
    borderRadius: 0.5,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Ultra dark & refined',
    mode: 'dark',
    primaryColor: '#6366f1',
    sidebarColor: '#1e1b4b',
    accentColor: '#818cf8',
    backgroundColor: '#030712',
    cardColor: '#111827',
    borderRadius: 0.75,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your brand, your way',
    mode: 'light',
    primaryColor: '#8b5cf6',
    sidebarColor: '#7c3aed',
    accentColor: '#8b5cf6',
    backgroundColor: '#f3f4f6',
    cardColor: '#ffffff',
    borderRadius: 1,
  },
];

export interface ThemeConfig {
  activePresetId: string;
  mode: ThemeMode;
  // Brand
  propertyName: string;
  logoUrl: string | null;
  // Colors (custom overrides)
  primaryColor: string;
  sidebarColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  // Typography
  fontFamily: FontFamily;
  fontSize: 'compact' | 'default' | 'large';
  // Shape
  borderRadius: number; // 0 - 1.5rem
  // Density
  density: DensityMode;
}

interface ThemeStore extends ThemeConfig {
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setSidebarColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setCardColor: (color: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: 'compact' | 'default' | 'large') => void;
  setBorderRadius: (radius: number) => void;
  setDensity: (density: DensityMode) => void;
  setPropertyName: (name: string) => void;
  setLogoUrl: (url: string | null) => void;
  resetToDefault: () => void;
}

const DEFAULT_CONFIG: ThemeConfig = {
  activePresetId: 'singularity-light',
  mode: 'light',
  propertyName: 'Singularity PMS',
  logoUrl: null,
  primaryColor: '#8b5cf6',
  sidebarColor: '#7c3aed',
  accentColor: '#8b5cf6',
  backgroundColor: '#f3f4f6',
  cardColor: '#ffffff',
  fontFamily: 'system',
  fontSize: 'default',
  borderRadius: 1,
  density: 'default',
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      setPreset: (preset) => set({
        activePresetId: preset.id,
        mode: preset.mode,
        primaryColor: preset.primaryColor,
        sidebarColor: preset.sidebarColor,
        accentColor: preset.accentColor,
        backgroundColor: preset.backgroundColor,
        cardColor: preset.cardColor,
        borderRadius: preset.borderRadius,
      }),
      setMode: (mode) => set({ mode }),
      setPrimaryColor: (primaryColor) => set({ primaryColor, activePresetId: 'custom' }),
      setSidebarColor: (sidebarColor) => set({ sidebarColor, activePresetId: 'custom' }),
      setAccentColor: (accentColor) => set({ accentColor, activePresetId: 'custom' }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor, activePresetId: 'custom' }),
      setCardColor: (cardColor) => set({ cardColor, activePresetId: 'custom' }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
      setBorderRadius: (borderRadius) => set({ borderRadius, activePresetId: 'custom' }),
      setDensity: (density) => set({ density }),
      setPropertyName: (propertyName) => set({ propertyName }),
      setLogoUrl: (logoUrl) => set({ logoUrl }),
      resetToDefault: () => set(DEFAULT_CONFIG),
    }),
    { name: 'singularity-theme' }
  )
);
