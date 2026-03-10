"use client";

import { useState, useEffect } from "react";
import { Save, Store, Globe, Loader2, Share2 } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { fetchStoreSettings, updateStoreSetting } from "@/lib/admin-api";

// Keys we manage in the settings form
const SETTING_KEYS = [
  "store_name",
  "store_url",
  "store_email",
  "store_phone",
  "store_currency",
  "store_timezone",
  "store_language",
  "store_facebook",
  "store_instagram",
] as const;

type SettingsMap = Record<string, string>;

export default function SettingsForm() {
  const [form, setForm] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { t } = useAdminI18n();

  // Load settings from database on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchStoreSettings();
      const map: SettingsMap = {};
      data.forEach((row: any) => {
        map[row.key] = row.value || "";
      });
      setForm(map);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save all settings to database
      const promises = SETTING_KEYS.map((key) =>
        updateStoreSetting(key, form[key] || "")
      );
      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="ml-2 text-sm text-text-muted">{t("settings.loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t("settings.title")}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{t("settings.subtitle")}</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Store size={20} className="text-primary" />
          <h3 className="text-base font-semibold text-text-primary">{t("settings.general")}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.storeName")}</label>
              <input type="text" value={form.store_name || ""} onChange={(e) => updateField("store_name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.storeUrl")}</label>
              <input type="text" value={form.store_url || ""} onChange={(e) => updateField("store_url", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.contactEmail")}</label>
              <input type="email" value={form.store_email || ""} onChange={(e) => updateField("store_email", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.phone")}</label>
              <input type="tel" value={form.store_phone || ""} onChange={(e) => updateField("store_phone", e.target.value)}
                placeholder="0XX XX XX XX XX"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={20} className="text-primary" />
          <h3 className="text-base font-semibold text-text-primary">{t("settings.localization")}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.currency")}</label>
              <select value={form.store_currency || "DZD"} onChange={(e) => updateField("store_currency", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-white">
                <option value="DZD">DZD (د.ج)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.timezone")}</label>
              <select value={form.store_timezone || "UTC+1 (CET)"} onChange={(e) => updateField("store_timezone", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-white">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (CET)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.language")}</label>
              <select value={form.store_language || "French"} onChange={(e) => updateField("store_language", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-white">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>Arabic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Share2 size={20} className="text-primary" />
          <h3 className="text-base font-semibold text-text-primary">{t("settings.social")}</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Facebook</label>
              <input type="text" value={form.store_facebook || ""} onChange={(e) => updateField("store_facebook", e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Instagram</label>
              <input type="text" value={form.store_instagram || ""} onChange={(e) => updateField("store_instagram", e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? t("settings.saving") : t("settings.saveChanges")}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600 animate-fade-in-up">{t("settings.saved")}</span>
        )}
      </div>
    </div>
  );
}