"use client";

import { useState } from "react";
import { Save, Store, Globe } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

interface SettingsFormData {
  storeName: string;
  storeUrl: string;
  currency: string;
  timezone: string;
  language: string;
  email: string;
}

export default function SettingsForm() {
  const [form, setForm] = useState<SettingsFormData>({
    storeName: "Casify Store",
    storeUrl: "casify.store",
    currency: "DZD",
    timezone: "UTC+1 (CET)",
    language: "French",
    email: "admin@casify.store",
  });

  const [saved, setSaved] = useState(false);
  const { t } = useAdminI18n();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (key: keyof SettingsFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
              <input type="text" value={form.storeName} onChange={(e) => updateField("storeName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.storeUrl")}</label>
              <input type="text" value={form.storeUrl} onChange={(e) => updateField("storeUrl", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.contactEmail")}</label>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
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
              <select value={form.currency} onChange={(e) => updateField("currency", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-white">
                <option value="DZD">DZD (د.ج)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("settings.timezone")}</label>
              <select value={form.timezone} onChange={(e) => updateField("timezone", e.target.value)}
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
              <select value={form.language} onChange={(e) => updateField("language", e.target.value)}
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

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold">
          <Save size={16} /> {t("settings.saveChanges")}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600 animate-fade-in-up">{t("settings.saved")}</span>
        )}
      </div>
    </div>
  );
}