'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface CustomThemePreset {
  id: string;
  name: string;
  primary: string; // Hex or HSL
  secondary: string;
  accent: string;
  bgLight: string;
  bgDark: string;
}

export const PRESET_THEMES: CustomThemePreset[] = [
  {
    id: 'karmayogi',
    name: 'Karmayogi Emerald',
    primary: '#059669', // Emerald 600
    secondary: '#10b981',
    accent: '#f59e0b',
    bgLight: '#f0fdf4',
    bgDark: '#022c22',
  },
  {
    id: 'official-navy',
    name: 'Official Bharat Navy',
    primary: '#1d4ed8', // Blue 700
    secondary: '#3b82f6',
    accent: '#f97316',
    bgLight: '#f8fafc',
    bgDark: '#0b1329',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Saffron',
    primary: '#ea580c', // Orange 600
    secondary: '#f97316',
    accent: '#eab308',
    bgLight: '#fff7ed',
    bgDark: '#2a1205',
  },
  {
    id: 'cyber-amethyst',
    name: 'Civil Amethyst',
    primary: '#7c3aed', // Violet 600
    secondary: '#a855f7',
    accent: '#06b6d4',
    bgLight: '#faf5ff',
    bgDark: '#1a0b2e',
  },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  selectedPreset: CustomThemePreset;
  setSelectedPreset: (preset: CustomThemePreset) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'learnz_theme_mode_v2';
const PRESET_STORAGE_KEY = 'learnz_custom_theme_preset_v2';
const CUSTOM_COLOR_KEY = 'learnz_custom_primary_color_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [selectedPreset, setSelectedPresetState] = useState<CustomThemePreset>(PRESET_THEMES[1]); // Bharat Navy default
  const [customColor, setCustomColorState] = useState<string>('#1d4ed8');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const savedPresetId = localStorage.getItem(PRESET_STORAGE_KEY);
      const savedColor = localStorage.getItem(CUSTOM_COLOR_KEY);

      if (savedMode && ['light', 'dark', 'custom'].includes(savedMode)) {
        setThemeModeState(savedMode);
      } else {
        // Match system preference if not set
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeModeState(systemPrefersDark ? 'dark' : 'light');
      }

      if (savedPresetId) {
        const found = PRESET_THEMES.find((p) => p.id === savedPresetId);
        if (found) setSelectedPresetState(found);
      }

      if (savedColor) {
        setCustomColorState(savedColor);
      }
    } catch (e) {
      console.warn('LocalStorage theme fetch error', e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('dark', 'theme-custom', 'theme-light');

    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.style.removeProperty('--custom-primary');
      root.style.removeProperty('--custom-accent');
      root.style.removeProperty('--custom-bg');
    } else if (themeMode === 'light') {
      root.classList.add('theme-light');
      root.style.removeProperty('--custom-primary');
      root.style.removeProperty('--custom-accent');
      root.style.removeProperty('--custom-bg');
    } else if (themeMode === 'custom') {
      root.classList.add('theme-custom');
      // Apply custom preset CSS variables
      const activePrimary = customColor || selectedPreset.primary;
      root.style.setProperty('--custom-primary', activePrimary);
      root.style.setProperty('--custom-secondary', selectedPreset.secondary);
      root.style.setProperty('--custom-accent', selectedPreset.accent);
      root.style.setProperty('--custom-bg-light', selectedPreset.bgLight);
      root.style.setProperty('--custom-bg-dark', selectedPreset.bgDark);
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [themeMode, selectedPreset, customColor, isMounted]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const setSelectedPreset = (preset: CustomThemePreset) => {
    setSelectedPresetState(preset);
    setCustomColorState(preset.primary);
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, preset.id);
      localStorage.setItem(CUSTOM_COLOR_KEY, preset.primary);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const setCustomColor = (color: string) => {
    setCustomColorState(color);
    try {
      localStorage.setItem(CUSTOM_COLOR_KEY, color);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        selectedPreset,
        setSelectedPreset,
        customColor,
        setCustomColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return resilient fallback state for SSR or boundary transitions
    return {
      themeMode: 'light' as ThemeMode,
      setThemeMode: () => {},
      selectedPreset: PRESET_THEMES[1],
      setSelectedPreset: () => {},
      customColor: '#1d4ed8',
      setCustomColor: () => {},
    };
  }
  return context;
};
