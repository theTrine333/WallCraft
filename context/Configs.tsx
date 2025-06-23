import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export type ThemePreference = "light" | "dark" | null;

export type AppConfig = {
  theme: ThemePreference;
  wallpaperInterval: number; // in minutes
  autoStart: boolean;
};

const DEFAULT_CONFIG: AppConfig = {
  theme: null,
  wallpaperInterval: 15,
  autoStart: true,
};

// Storage key
const STORAGE_KEY = "APP_CONFIG";

// Context shape
type ConfigContextType = {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => Promise<void>;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Hook
export const useAppConfig = (): ConfigContextType => {
  const ctx = useContext(ConfigContext);
  if (!ctx)
    throw new Error("useAppConfig must be used within AppConfigProvider");
  return ctx;
};

// Provider
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setConfig(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load app config:", e);
      }
    })();
  }, []);

  const updateConfig = async (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save app config:", e);
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
