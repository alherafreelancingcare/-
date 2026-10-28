import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { StorageService } from '../services/storage';
import { DEFAULT_SITE_SETTINGS } from '../data/mockData';

interface SiteContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const s = await StorageService.getSiteSettings();
      setSettings(s);
    } catch (err) {
      console.warn('Error loading site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    await StorageService.saveSiteSettings(newSettings);
    setSettings(newSettings);
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SiteContext.Provider value={{ settings, updateSettings, refreshSettings, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
