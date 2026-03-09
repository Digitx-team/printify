"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Palette,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { fetchDashboardStats } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

const iconMap: Record<string, React.ElementType> = {
  "dollar-sign": DollarSign,
  "shopping-bag": ShoppingBag,
  package: Package,
  users: Users,
  palette: Palette,
};

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useAdminI18n();

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border h-[120px] flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: t("dashboard.totalRevenue"),
      value: `${(stats?.totalRevenue || 0).toLocaleString()} DA`,
      change: `${stats?.totalOrders || 0} ${t("dashboard.orders")}`,
      trend: "up" as const,
      icon: "dollar-sign",
    },
    {
      title: t("dashboard.totalOrders"),
      value: (stats?.totalOrders || 0).toLocaleString(),
      change: `${stats?.pendingOrders || 0} ${t("dashboard.pending")}`,
      trend: "up" as const,
      icon: "shopping-bag",
    },
    {
      title: t("dashboard.products"),
      value: (stats?.totalProducts || 0).toLocaleString(),
      change: `${stats?.activeProducts || 0} ${t("dashboard.active")}`,
      trend: "up" as const,
      icon: "package",
    },
    {
      title: t("dashboard.pendingOrders"),
      value: (stats?.pendingOrders || 0).toLocaleString(),
      change: t("dashboard.needsAttention"),
      trend: stats?.pendingOrders > 0 ? ("down" as const) : ("up" as const),
      icon: "users",
    },
    {
      title: "Custom Orders",
      value: (stats?.totalCustomOrders || 0).toLocaleString(),
      change: `${stats?.newCustomOrders || 0} new`,
      trend: (stats?.newCustomOrders || 0) > 0 ? ("up" as const) : ("up" as const),
      icon: "palette",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-5">
      {cards.map((stat, index) => {
        const IconComponent = iconMap[stat.icon] || Package;
        const isUp = stat.trend === "up";
        return (
          <div key={stat.title} className={clsx("card-hover bg-white rounded-2xl p-5 border border-border animate-fade-in-up opacity-0", `animate-delay-${index + 1}`)}>
            <div className="flex items-start justify-between mb-4">
              <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center",
                index === 0 ? "bg-primary/10 text-primary" :
                index === 1 ? "bg-blue-50 text-blue-500" :
                index === 2 ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
              )}>
                <IconComponent size={22} />
              </div>
              <span className={clsx("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
                isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              )}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-text-secondary font-medium">{stat.title}</p>
            <p className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}