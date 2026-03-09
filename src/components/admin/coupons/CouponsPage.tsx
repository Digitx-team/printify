"use client";

import { useState } from "react";
import { Plus, Copy, Ticket } from "lucide-react";
import { coupons } from "@/data/admin/mockData";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Scheduled: "bg-blue-50 text-blue-600",
  Expired: "bg-gray-100 text-gray-500",
};

const statusKeys: Record<string, string> = {
  All: "coupons.all",
  Active: "common.active",
  Scheduled: "coupons.scheduled",
  Expired: "coupons.expired",
};

const filterOptions = ["All", "Active", "Scheduled", "Expired"];

export default function CouponsPage() {
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState<number | null>(null);
  const { t } = useAdminI18n();

  const filtered = coupons.filter(c => filter === "All" || c.status === filter);

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t("coupons.title")}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{t("coupons.subtitle")}</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={18} /> {t("coupons.createCoupon")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.activeCoupons")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{coupons.filter(c => c.status === "Active").length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.totalRedemptions")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{coupons.reduce((a, c) => a + c.usageCount, 0)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.avgRate")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {((coupons.reduce((a, c) => a + c.usageCount, 0) / coupons.reduce((a, c) => a + c.usageLimit, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filterOptions.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("px-3.5 py-2 rounded-xl text-sm font-medium transition-all", filter === f ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-text-secondary hover:bg-gray-50")}>
            {t(statusKeys[f]) || f}
          </button>
        ))}
      </div>

      {/* Coupon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(coupon => (
          <div key={coupon.id} className="bg-white rounded-2xl border border-border p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center">
                  <Ticket size={20} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-text-primary">{coupon.code}</span>
                    <button onClick={() => copyCode(coupon.id, coupon.code)} className="p-1 rounded hover:bg-gray-100 transition-colors" title={t("coupons.copyCode")}>
                      <Copy size={13} className={copied === coupon.id ? "text-emerald-500" : "text-text-muted"} />
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{coupon.type} {t("coupons.discount")}</p>
                </div>
              </div>
              <span className={clsx("px-2.5 py-1 rounded-lg text-xs font-semibold", statusStyles[coupon.status])}>
                {t(statusKeys[coupon.status]) || coupon.status}
              </span>
            </div>

            <div className="text-3xl font-bold text-primary mb-3">{coupon.value}</div>

            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between"><span>{t("coupons.minOrder")}</span><span className="font-medium text-text-primary">{coupon.minOrder}</span></div>
              <div className="flex justify-between"><span>{t("coupons.used")}</span><span className="font-medium text-text-primary">{coupon.usageCount} / {coupon.usageLimit}</span></div>
              <div className="flex justify-between"><span>{t("coupons.expires")}</span><span className="font-medium text-text-primary">{new Date(coupon.expiry).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
            </div>

            {/* Usage bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }} />
              </div>
              <p className="text-[11px] text-text-muted mt-1">{((coupon.usageCount / coupon.usageLimit) * 100).toFixed(0)}% {t("coupons.percentUsed")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}