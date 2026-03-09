"use client";

import StatsCards from "@/components/admin/dashboard/StatsCards";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

export default function AdminDashboardPage() {
  const { t } = useAdminI18n();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t("dashboard.title")}</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {t("dashboard.welcome")}
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Orders */}
      <RecentOrdersTable />
    </div>
  );
}