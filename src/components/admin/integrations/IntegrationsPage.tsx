"use client";

import { useState, useEffect } from "react";
import { Check, X as XIcon, Save, ExternalLink, Loader2 } from "lucide-react";
import { fetchStoreSettings, updateStoreSetting } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

export default function IntegrationsPage() {
  const [pixelId, setPixelId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();

  useEffect(() => {
    fetchStoreSettings()
      .then((settings) => {
        const fbPixel = settings.find((s: any) => s.key === "fb_pixel_id");
        if (fbPixel) {
          setPixelId(fbPixel.value || "");
          setEnabled(!!fbPixel.value);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const valueToSave = enabled ? pixelId.trim() : "";
      await updateStoreSetting("fb_pixel_id", valueToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
      alert(t("integrations.failedToSave"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t("integrations.title")}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{t("integrations.subtitle")}</p>
      </div>

      {/* Facebook Pixel Card */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{t("integrations.fbPixel")}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{t("integrations.fbDescription")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {enabled && pixelId && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
            <span className={clsx("text-xs font-semibold", enabled && pixelId ? "text-emerald-600" : "text-text-muted")}>
              {enabled && pixelId ? t("common.active") : t("common.inactive")}
            </span>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl mb-5">
          <div>
            <p className="text-sm font-medium text-text-primary">{t("integrations.enablePixel")}</p>
            <p className="text-xs text-text-muted mt-0.5">{t("integrations.trackEvents")}</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={clsx("w-12 h-7 rounded-full transition-colors relative", enabled ? "bg-primary" : "bg-gray-200")}
          >
            <span className={clsx("absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm", enabled ? "left-6" : "left-1")} />
          </button>
        </div>

        {/* Pixel ID Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("integrations.pixelId")}</label>
            <input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder={t("integrations.enterPixelId")}
              disabled={!enabled}
              className={clsx(
                "w-full px-4 py-2.5 rounded-xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                !enabled && "opacity-50 bg-gray-50 cursor-not-allowed"
              )}
            />
            <p className="text-xs text-text-muted mt-1.5">
              {t("integrations.findPixelId")}{" "}
              <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                {t("integrations.fbEventsManager")} <ExternalLink size={10} />
              </a>
            </p>
          </div>

          {/* Events Tracked */}
          <div className="border border-border rounded-xl p-4">
            <p className="text-sm font-medium text-text-primary mb-3">{t("integrations.eventsTracked")}</p>
            <div className="space-y-2">
              {[
                { name: "PageView", desc: t("integrations.pageViewDesc"), active: enabled },
                { name: "ViewContent", desc: t("integrations.viewContentDesc"), active: enabled },
                { name: "AddToCart", desc: t("integrations.addToCartDesc"), active: enabled },
                { name: "InitiateCheckout", desc: t("integrations.checkoutDesc"), active: enabled },
                { name: "Purchase", desc: t("integrations.purchaseDesc"), active: enabled },
              ].map(event => (
                <div key={event.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={clsx("w-5 h-5 rounded-md flex items-center justify-center text-white", event.active ? "bg-emerald-500" : "bg-gray-200")}>
                      {event.active ? <Check size={12} /> : <XIcon size={12} />}
                    </span>
                    <span className="text-sm font-medium text-text-primary">{event.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{event.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
          {saved && <span className="text-sm font-medium text-emerald-600">{t("integrations.saved")}</span>}
          {!saved && <span />}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? t("integrations.saving") : t("integrations.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}