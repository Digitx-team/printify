"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type AdminLocale, translations, isRTL } from "@/lib/admin-i18n";

interface AdminI18nContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const AdminI18nContext = createContext<AdminI18nContextType>({
  locale: "ar",
  setLocale: () => {},
  t: (key: string) => key,
  dir: "rtl",
});

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-locale") as AdminLocale) || "ar";
    }
    return "ar";
  });

  const setLocale = useCallback((newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-locale", newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || translations["en"]?.[key] || key;
    },
    [locale]
  );

  const dir = isRTL(locale) ? "rtl" : "ltr";

  // Update the #admin-root dir attribute when locale changes
  useEffect(() => {
    const adminRoot = document.getElementById("admin-root");
    if (adminRoot) {
      adminRoot.dir = dir;
      adminRoot.style.fontFamily = isRTL(locale)
        ? '"Cairo", "Plus Jakarta Sans", system-ui, sans-serif'
        : '"Plus Jakarta Sans", system-ui, sans-serif';
    }
  }, [locale, dir]);

  return (
    <AdminI18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  return useContext(AdminI18nContext);
}
