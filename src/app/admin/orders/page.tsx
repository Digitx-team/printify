"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Palette, Package, Loader2 } from "lucide-react";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import CustomOrdersTable from "@/components/admin/orders/CustomOrdersTable";
import { fetchAllOrders, fetchCustomOrders } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

export default function OrdersPage() {
  const [tab, setTab] = useState<'regular' | 'custom'>('regular');
  const [stats, setStats] = useState({ total: 0, store: 0, custom: 0, loading: true });
  const { t } = useAdminI18n();

  useEffect(() => {
    Promise.all([
      fetchAllOrders().catch(() => []),
      fetchCustomOrders().catch(() => []),
    ]).then(([orders, customOrders]) => {
      setStats({
        store: orders.length,
        custom: customOrders.length,
        total: orders.length + customOrders.length,
        loading: false,
      });
    });
  }, []);

  const statCards = [
    {
      label: t("orders.totalOrders"),
      value: stats.total,
      icon: Package,
      color: "bg-primary/10 text-primary",
      borderColor: "border-primary/20",
    },
    {
      label: t("orders.storeOrders"),
      value: stats.store,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      label: t("orders.customOrders"),
      value: stats.custom,
      icon: Palette,
      color: "bg-indigo-50 text-indigo-600",
      borderColor: "border-indigo-100",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={clsx(
              "bg-white rounded-2xl border p-5 flex items-center gap-4 transition-all hover:shadow-sm",
              card.borderColor
            )}
          >
            <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", card.color)}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{card.label}</p>
              {stats.loading ? (
                <Loader2 size={18} className="animate-spin text-text-muted mt-1" />
              ) : (
                <p className="text-2xl font-bold text-text-primary mt-0.5">{card.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 max-w-md">
        <button
          onClick={() => setTab('regular')}
          className={clsx(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center",
            tab === 'regular'
              ? "bg-white text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <ShoppingBag size={16} />
          {t("orders.storeOrders")}
          <span className={clsx(
            "ml-1 text-xs px-2 py-0.5 rounded-full font-bold",
            tab === 'regular' ? "bg-primary/10 text-primary" : "bg-gray-200 text-text-muted"
          )}>
            {stats.loading ? '...' : stats.store}
          </span>
        </button>
        <button
          onClick={() => setTab('custom')}
          className={clsx(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center",
            tab === 'custom'
              ? "bg-white text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Palette size={16} />
          {t("orders.customOrders")}
          <span className={clsx(
            "ml-1 text-xs px-2 py-0.5 rounded-full font-bold",
            tab === 'custom' ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-text-muted"
          )}>
            {stats.loading ? '...' : stats.custom}
          </span>
        </button>
      </div>

      {/* Tab content */}
      {tab === 'regular' ? <OrdersTable /> : <CustomOrdersTable />}
    </div>
  );
}