"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { fetchAllOrders } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  total: number;
  shipping: number;
  status: "Paid" | "Unpaid" | "Overdue";
}

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Unpaid: "bg-amber-50 text-amber-700",
  Overdue: "bg-red-50 text-red-600",
};

const filterOptions = ["All", "Paid", "Unpaid"];

function getInvoiceStatus(orderStatus: string): "Paid" | "Unpaid" | "Overdue" {
  if (orderStatus === "delivered") return "Paid";
  if (orderStatus === "cancelled") return "Overdue";
  return "Unpaid";
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();

  const filterKeys: Record<string, string> = {
    All: "invoices.all",
    Paid: "common.paid",
    Unpaid: "common.unpaid",
  };

  const statusTranslationKeys: Record<string, string> = {
    Paid: "common.paid",
    Unpaid: "common.unpaid",
    Overdue: "invoices.overdue",
  };

  useEffect(() => {
    fetchAllOrders()
      .then((orders) => {
        const generatedInvoices: Invoice[] = orders.map((o: any, idx: number) => ({
          id: `INV-${String(idx + 1).padStart(4, "0")}`,
          orderId: o.order_number,
          customer: o.customer_name,
          date: o.created_at,
          total: o.total_amount || 0,
          shipping: o.shipping_cost || 0,
          status: getInvoiceStatus(o.status),
        }));
        setInvoices(generatedInvoices);
      })
      .catch((err) => {
        console.error('Failed to fetch invoices:', err);
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = invoices.filter((i) => filter === "All" || i.status === filter);

  const totalCollected = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + i.total, 0);
  const totalOutstanding = invoices.filter((i) => i.status !== "Paid").reduce((a, i) => a + i.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t("invoices.title")}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{t("invoices.subtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">
          <Download size={16} /> {t("invoices.exportAll")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("invoices.totalCollected")}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalCollected.toLocaleString()} DA</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("invoices.outstanding")}</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalOutstanding.toLocaleString()} DA</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("invoices.totalInvoices")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{invoices.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filterOptions.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={clsx(
            "px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
            filter === f ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-text-secondary hover:bg-gray-50"
          )}>
            {t(filterKeys[f]) || f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("invoices.invoice")}</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("invoices.order")}</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("invoices.customer")}</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("invoices.date")}</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("invoices.status")}</th>
                <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("invoices.total")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-text-muted">{t("invoices.noInvoices")}</td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="table-row-hover border-b border-border/50 last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="text-sm font-semibold text-primary">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-secondary">{inv.orderId}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-sm font-medium text-text-primary">{inv.customer}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-secondary">
                        {new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", statusStyles[inv.status])}>
                        {t(statusTranslationKeys[inv.status]) || inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-semibold text-text-primary">{inv.total.toLocaleString()} DA</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}