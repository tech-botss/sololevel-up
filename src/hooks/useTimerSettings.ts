import { useState, useEffect, useCallback } from 'react';
import { TimerSettings, DEFAULT_TIMER_SETTINGS } from '@/types/timer';

const STORAGE_KEY = 'solorank_timer_settings';

export function useTimerSettings() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_TIMER_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load timer settings from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: TimerSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.warn('Failed to save timer settings to localStorage:', error);
      return false;
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.warn('Failed to save timer settings:', error);
      }
      return newSettings;
    });
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSettings(DEFAULT_TIMER_SETTINGS);
      return true;
    } catch (error) {
      console.warn('Failed to reset timer settings:', error);
      return false;
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    updateSetting,
    resetToDefaults,
  };
}
