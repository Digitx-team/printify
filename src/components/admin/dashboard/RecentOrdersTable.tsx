"use client";

import { useState, useEffect } from "react";
import { fetchAllOrders } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const statusClass: Record<string, string> = {
  pending: "badge-pending",
  confirmed: "badge-pending",
  shipped: "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "bg-red-50 text-red-600",
};

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();

  useEffect(() => {
    fetchAllOrders()
      .then((data) => setOrders(data.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-border p-5 lg:p-6 animate-fade-in-up opacity-0 animate-delay-3">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{t("dashboard.recentOrders")}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{t("dashboard.latestOrders")}</p>
        </div>
        <a href="/admin/orders" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          {t("dashboard.viewAll")}
        </a>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-12">{t("orders.noOrders")}</p>
      ) : (
        <div className="overflow-x-auto -mx-5 lg:-mx-6">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start text-xs font-semibold text-text-muted uppercase tracking-wider px-5 lg:px-6 pb-3">{t("orders.orderId")}</th>
                <th className="text-start text-xs font-semibold text-text-muted uppercase tracking-wider px-3 pb-3">{t("orders.customer")}</th>
                <th className="text-start text-xs font-semibold text-text-muted uppercase tracking-wider px-3 pb-3">{t("orders.date")}</th>
                <th className="text-start text-xs font-semibold text-text-muted uppercase tracking-wider px-3 pb-3">{t("orders.status")}</th>
                <th className="text-end text-xs font-semibold text-text-muted uppercase tracking-wider px-5 lg:px-6 pb-3">{t("orders.total")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="table-row-hover border-b border-border/50 last:border-0">
                  <td className="px-5 lg:px-6 py-3.5">
                    <span className="text-sm font-semibold text-primary">{order.order_number}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{order.customer_name}</p>
                      <p className="text-xs text-text-muted">{order.customer_phone}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-sm text-text-secondary">
                      {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize", statusClass[order.status] || "badge-pending")}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-3.5 text-end">
                    <span className="text-sm font-semibold text-text-primary">{order.total_amount?.toLocaleString()} DA</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}