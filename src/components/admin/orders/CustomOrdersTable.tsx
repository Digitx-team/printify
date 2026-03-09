"use client";

import { useState, useEffect } from "react";
import { Search, Palette, ChevronRight, X as XIcon, Loader2, Eye, ImageIcon } from "lucide-react";
import { fetchCustomOrders, updateCustomOrderStatus } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

const statusClass: Record<string, string> = {
  new: "bg-blue-50 text-blue-600",
  in_progress: "bg-amber-50 text-amber-600",
  completed: "badge-delivered",
  cancelled: "bg-red-50 text-red-600",
};

const statusOptions = ["All", "new", "in_progress", "completed", "cancelled"];

const nextStatus: Record<string, string> = {
  new: "in_progress",
  in_progress: "completed",
};

type CustomOrderStatus = "new" | "in_progress" | "completed" | "cancelled";

interface CustomOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  brand_slug: string;
  phone_model: string;
  description: string;
  status: CustomOrderStatus;
  created_at: string;
  image_urls: string[];
}

export default function CustomOrdersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { t } = useAdminI18n();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomOrders();
      setOrders(data.map((o: any) => ({
        id: o.id,
        order_number: o.order_number || '',
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        wilaya: o.wilaya,
        address: o.address || '',
        brand_slug: o.brand_slug,
        phone_model: o.phone_model,
        description: o.description || '',
        status: o.status as CustomOrderStatus,
        created_at: o.created_at,
        image_urls: o.image_urls || [],
      })));
    } catch (err) {
      console.error('Failed to load custom orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !nextStatus[order.status]) return;
    const newStatus = nextStatus[order.status] as CustomOrderStatus;
    try {
      await updateCustomOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await updateCustomOrderStatus(orderId, 'cancelled');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone_model.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusLabel = (s: string) => t(`customStatus.${s}`) || s;

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("orders.searchCustom")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  "px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                  statusFilter === s
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-text-secondary hover:bg-gray-100"
                )}
              >
                {s === 'All' ? t("orders.all") : statusLabel(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-text-muted">{t("orders.loadingCustom")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("orders.orderId")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.customer")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.phone")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.wilaya")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.date")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.status")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.details")}</th>
                  <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("orders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-sm text-text-muted">
                      {t("orders.noCustomOrders")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <>
                      <tr key={order.id} className="table-row-hover border-b border-border/50 last:border-0">
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg">
                            {order.order_number || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <div>
                            <p className="text-sm font-medium text-text-primary">{order.customer_name}</p>
                            <p className="text-xs text-text-muted">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div>
                            <p className="text-sm font-medium text-text-primary capitalize">{order.brand_slug}</p>
                            <p className="text-xs text-text-muted">{order.phone_model}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="text-sm text-text-secondary">{order.wilaya}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="text-sm text-text-secondary">
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={clsx(
                            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
                            statusClass[order.status] || "bg-gray-100 text-gray-600"
                          )}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <button
                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-text-secondary text-xs font-medium hover:bg-gray-100 transition-all"
                          >
                            <Eye size={14} />
                            {expandedId === order.id ? t("orders.hide") : t("orders.view")}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {nextStatus[order.status] && order.status !== "cancelled" && (
                              <button
                                onClick={() => handleNextStep(order.id)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all"
                              >
                                <ChevronRight size={14} />
                                {statusLabel(nextStatus[order.status])}
                              </button>
                            )}
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all"
                              >
                                <XIcon size={14} />
                              </button>
                            )}
                            {order.status === "completed" && (
                              <span className="text-xs text-emerald-500 font-medium">{t("orders.done")}</span>
                            )}
                            {order.status === "cancelled" && (
                              <span className="text-xs text-red-400 font-medium">{t("customStatus.cancelled")}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Expanded detail row */}
                      {expandedId === order.id && (
                        <tr key={`${order.id}-detail`} className="bg-gray-50/50">
                          <td colSpan={8} className="px-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("orders.description")}</p>
                                <p className="text-sm text-text-primary bg-white rounded-lg p-3 border border-border min-h-[60px]">
                                  {order.description || t("orders.noDescription")}
                                </p>
                                {order.address && (
                                  <div className="mt-3">
                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{t("orders.address")}</p>
                                    <p className="text-sm text-text-secondary">{order.address}</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("orders.designImages")}</p>
                                {order.image_urls && order.image_urls.length > 0 ? (
                                  <div className="grid grid-cols-3 gap-2">
                                    {order.image_urls.map((url: string, idx: number) => (
                                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt="Design" className="w-full h-full object-cover" />
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-sm text-text-muted bg-white rounded-lg p-3 border border-border">
                                    <ImageIcon size={16} />
                                    {t("orders.noImages")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/30">
          <p className="text-sm text-text-muted">
            {t("orders.showing")} <span className="font-semibold text-text-primary">{filtered.length}</span> {t("orders.of")}{" "}
            <span className="font-semibold text-text-primary">{orders.length}</span> {t("orders.customOrdersLabel")}
          </p>
        </div>
      </div>
    </div>
  );
}
