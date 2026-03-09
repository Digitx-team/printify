"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, LogOut, Loader2, Globe } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { type AdminLocale, localeNames, localeFlags } from "@/lib/admin-i18n";
import clsx from "clsx";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { locale, setLocale, t } = useAdminI18n();
  const [loggingOut, setLoggingOut] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const locales: AdminLocale[] = ["en", "fr", "ar"];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border h-[72px] flex items-center justify-between px-4 md:px-8">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-text-secondary"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder={t("navbar.search")}
            className="w-[280px] lg:w-[360px] pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />

        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors"
            title="Language"
          >
            <Globe size={18} />
            <span className="text-sm font-medium">{localeNames[locale]}</span>
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-border shadow-lg shadow-black/8 py-1.5 z-50 animate-fade-in-up">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setLangOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                    locale === loc
                      ? "bg-primary-lighter text-primary-dark"
                      : "text-text-secondary hover:bg-gray-50",
                  )}
                >
                  <span className="text-base">{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="p-2.5 rounded-xl hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
          title={t("navbar.signOut")}
        >
          {loggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-xl">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-text-primary">
              {t("common.admin")}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary-lighter">
            <span className="text-white text-sm font-bold">CA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
