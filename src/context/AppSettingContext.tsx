"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { appSettingService, AppSetting } from "@/services/appSetting";

interface AppSettingContextType {
  setting: AppSetting | null;
  loading: boolean;
}

const AppSettingContext = createContext<AppSettingContextType>({
  setting: null,
  loading: true,
});

export function AppSettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await appSettingService.getFirst();
        setSetting(data);
      } catch (err) {
        console.error("Error fetching app setting:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, []);

  return (
    <AppSettingContext.Provider value={{ setting, loading }}>
      {children}
    </AppSettingContext.Provider>
  );
}

export function useAppSetting() {
  return useContext(AppSettingContext);
}
