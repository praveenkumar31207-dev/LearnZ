'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, PRESET_THEMES, ThemeMode } from '@/lib/themeContext';
import { Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const {
    themeMode,
    setThemeMode,
    selectedPreset,
    setSelectedPreset,
    customColor,
    setCustomColor,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold shadow-xs"
        title="Change App Theme (Light, Dark, Custom)"
      >
        {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
        {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-blue-400" />}
        {themeMode === 'custom' && (
          <span
            className="w-3 h-3 rounded-full inline-block shadow-xs border border-white"
            style={{ backgroundColor: customColor || selectedPreset.primary }}
          />
        )}
        <span className="capitalize">{themeMode}</span>
        <Palette className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
            Display Mode
          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                themeMode === 'light'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500 mb-1" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setThemeMode('dark')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                themeMode === 'dark'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-800 dark:text-blue-200 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Moon className="w-4 h-4 text-blue-400 mb-1" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => setThemeMode('custom')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium border transition-all ${
                themeMode === 'custom'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-800 dark:text-purple-200 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500 mb-1" />
              <span>Custom</span>
            </button>
          </div>

          {/* Custom Theme Presets */}
          {themeMode === 'custom' && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Custom Palette Presets
              </div>
              <div className="space-y-1">
                {PRESET_THEMES.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span>{preset.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Picker Input */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-1 font-medium">
                  <span>Custom Accent Hex:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-[10px] uppercase text-slate-500">{customColor}</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center border-t border-slate-100 dark:border-slate-800">
            Preference auto-saved to browser local storage
          </div>
        </div>
      )}
    </div>
  );
};
