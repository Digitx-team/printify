"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fetchAllOrders, fetchAllProducts } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { Loader2 } from "lucide-react";

export default function AnalyticsCharts() {
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();
  const [stats, setStats] = useState({
    avgOrderValue: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [dailySales, setDailySales] = useState<{ date: string; sales: number; orders: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [orders, products] = await Promise.all([
          fetchAllOrders(),
          fetchAllProducts(),
        ]);

        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
        setStats({ avgOrderValue, totalOrders, totalRevenue });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyMap: Record<string, { sales: number; orders: number }> = {};
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = days[d.getDay()];
          dailyMap[key] = { sales: 0, orders: 0 };
        }

        orders.forEach((o: any) => {
          const d = new Date(o.created_at);
          const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
          if (diff < 7) {
            const key = days[d.getDay()];
            if (dailyMap[key]) {
              dailyMap[key].sales += o.total_amount || 0;
              dailyMap[key].orders += 1;
            }
          }
        });

        setDailySales(Object.entries(dailyMap).map(([date, data]) => ({
          date,
          sales: data.sales,
          orders: data.orders,
        })));

        const productCount: Record<string, number> = {};
        orders.forEach((o: any) => {
          (o.order_items || []).forEach((item: any) => {
            const name = item.products?.name || 'Custom';
            productCount[name] = (productCount[name] || 0) + item.quantity;
          });
        });

        const sorted = Object.entries(productCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, sales]) => ({ name, sales }));
        setTopProducts(sorted.length > 0 ? sorted : products.slice(0, 5).map((p: any) => ({ name: p.name, sales: 0 })));

        const statusCount: Record<string, number> = {};
        orders.forEach((o: any) => {
          statusCount[o.status] = (statusCount[o.status] || 0) + 1;
        });

        const statusColors: Record<string, string> = {
          pending: "#F59E0B",
          confirmed: "#3B82F6",
          shipped: "#8B5CF6",
          delivered: "#10B981",
          cancelled: "#EF4444",
        };

        setStatusDistribution(
          Object.entries(statusCount).map(([name, value]) => ({
            name: t(`status.${name}`) || name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: statusColors[name] || "#00D4FF",
          }))
        );
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t("analytics.title")}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{t("analytics.subtitle")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t("analytics.totalRevenue"), value: `${stats.totalRevenue.toLocaleString()} DA` },
          { label: t("analytics.avgOrderValue"), value: `${stats.avgOrderValue.toLocaleString()} DA` },
          { label: t("analytics.totalOrders"), value: stats.totalOrders.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-border p-5">
            <p className="text-sm text-text-secondary font-medium">{item.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-text-primary">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Over Time */}
      <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-text-primary">{t("analytics.salesOverTime")}</h3>
            <p className="text-sm text-text-secondary mt-0.5">{t("analytics.last7Days")}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs text-text-secondary">{t("analytics.revenue")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-light" />
              <span className="text-xs text-text-secondary">{t("analytics.orders")}</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : `${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "10px 14px" }}
                formatter={((value: number, name: string) => [
                  name === "sales" ? `${value.toLocaleString()} DA` : value.toLocaleString(),
                  name === "sales" ? t("analytics.revenue") : t("analytics.orders"),
                ]) as never}
              />
              <Area type="monotone" dataKey="sales" stroke="#00D4FF" strokeWidth={2.5} fill="url(#salesGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#33DFFF" strokeWidth={2} fill="none" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
          <h3 className="text-base font-semibold text-text-primary mb-5">{t("analytics.topProducts")}</h3>
          <div className="h-[260px]">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} width={110} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "10px 14px" }}
                    formatter={((value: number) => [`${value} ${t("analytics.units")}`, t("analytics.ordered")]) as never}
                  />
                  <Bar dataKey="sales" fill="#00D4FF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-text-muted text-center py-20">{t("analytics.noOrderData")}</p>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
          <h3 className="text-base font-semibold text-text-primary mb-5">{t("analytics.orderStatus")}</h3>
          <div className="flex items-center gap-6">
            <div className="h-[220px] w-[220px] flex-shrink-0">
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {statusDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "10px 14px" }}
                      formatter={((value: number) => [`${value} ${t("analytics.orders")}`, t("analytics.count")]) as never}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-text-muted text-center py-20">{t("analytics.noData")}</p>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {statusDistribution.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-text-secondary">{source.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{source.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}