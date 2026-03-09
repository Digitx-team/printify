"use client";

import { useState, useEffect } from "react";
import { Search, Save, Truck, MapPin, Loader2 } from "lucide-react";
import { fetchShippingRates, saveAllShippingRates } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

interface ShippingRate {
  id: string;
  wilaya_code: string;
  wilaya_name: string;
  price_home: number;
  price_desk: number;
}

export default function ShippingPage() {
  const [search, setSearch] = useState("");
  const [wilayas, setWilayas] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useAdminI18n();

  useEffect(() => {
    fetchShippingRates()
      .then(data => setWilayas(data as ShippingRate[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = wilayas.filter(w =>
    w.wilaya_name.toLowerCase().includes(search.toLowerCase()) ||
    w.wilaya_code.includes(search)
  );

  const updatePrice = (id: string, field: "price_home" | "price_desk", value: string) => {
    const num = parseInt(value) || 0;
    setWilayas(prev => prev.map(w => w.id === id ? { ...w, [field]: num } : w));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAllShippingRates(wilayas.map(w => ({
        id: w.id,
        price_home: w.price_home,
        price_desk: w.price_desk,
      })));
      setSaved(true);
      setEditingId(null);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t("shipping.title")}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{t("shipping.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm font-medium text-emerald-600">{t("shipping.saved")}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? t("shipping.saving") : t("shipping.saveAll")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center">
            <MapPin size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{wilayas.length}</p>
            <p className="text-xs text-text-secondary">{t("shipping.totalWilayas")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("shipping.avgHome")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {wilayas.length > 0 ? Math.round(wilayas.reduce((a, w) => a + w.price_home, 0) / wilayas.length).toLocaleString() : 0} DA
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("shipping.avgDesk")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {wilayas.length > 0 ? Math.round(wilayas.reduce((a, w) => a + w.price_desk, 0) / wilayas.length).toLocaleString() : 0} DA
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("shipping.search")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-text-muted">{t("shipping.loading")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5 w-16">{t("shipping.code")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("shipping.wilayaName")}</th>
                  <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">
                    <div className="flex items-center justify-center gap-1"><Truck size={13} /> {t("shipping.homeDelivery")}</div>
                  </th>
                  <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1"><MapPin size={13} /> {t("shipping.deskDelivery")}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(wilaya => (
                  <tr key={wilaya.id} className="table-row-hover border-b border-border/50 last:border-0 cursor-pointer"
                    onClick={() => setEditingId(editingId === wilaya.id ? null : wilaya.id)}>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-lighter text-primary text-xs font-bold">
                        {wilaya.wilaya_code}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-semibold text-text-primary">{wilaya.wilaya_name}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {editingId === wilaya.id ? (
                        <input type="number" value={wilaya.price_home}
                          onChange={(e) => updatePrice(wilaya.id, "price_home", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-24 mx-auto px-3 py-1.5 rounded-lg border border-primary/30 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary-lighter/30" />
                      ) : (
                        <span className="text-sm font-semibold text-text-primary">{wilaya.price_home.toLocaleString()} DA</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {editingId === wilaya.id ? (
                        <input type="number" value={wilaya.price_desk}
                          onChange={(e) => updatePrice(wilaya.id, "price_desk", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-24 mx-auto px-3 py-1.5 rounded-lg border border-primary/30 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary-lighter/30" />
                      ) : (
                        <span className="text-sm font-semibold text-text-primary">{wilaya.price_desk.toLocaleString()} DA</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-gray-50/30">
          <p className="text-sm text-text-muted">
            {t("shipping.showing")} <span className="font-semibold text-text-primary">{filtered.length}</span> {t("shipping.of")}{" "}
            <span className="font-semibold text-text-primary">{wilayas.length}</span> {t("shipping.wilayas")}
            <span className="ml-2 text-xs">{t("shipping.clickToEdit")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}