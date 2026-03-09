"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { fetchAllOrders } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { Loader2 } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function RevenueChart() {
  const [chartData, setChartData] = useState<{ month: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();

  useEffect(() => {
    fetchAllOrders()
      .then((orders) => {
        const monthMap: Record<string, { revenue: number; orders: number }> = {};
        MONTHS.forEach((m) => (monthMap[m] = { revenue: 0, orders: 0 }));
        orders.forEach((o: any) => {
          const d = new Date(o.created_at);
          const monthKey = MONTHS[d.getMonth()];
          if (monthMap[monthKey]) {
            monthMap[monthKey].revenue += o.total_amount || 0;
            monthMap[monthKey].orders += 1;
          }
        });
        setChartData(MONTHS.map((month) => ({ month, revenue: monthMap[month].revenue, orders: monthMap[month].orders })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-border p-5 lg:p-6 animate-fade-in-up opacity-0 animate-delay-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{t("dashboard.revenueOverview")}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{t("dashboard.monthlyRevenue")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs text-text-secondary">{t("dashboard.revenue")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-light" />
            <span className="text-xs text-text-secondary">{t("dashboard.orders")}</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] -ml-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#33DFFF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#33DFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k DA` : `${v} DA`} dx={-4} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "10px 14px" }}
                formatter={((value: number, name: string) => [
                  name === "revenue" ? `${value.toLocaleString()} DA` : value,
                  name === "revenue" ? t("dashboard.revenue") : t("dashboard.orders"),
                ]) as never}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2.5} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#33DFFF" strokeWidth={2} fill="url(#ordersGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}