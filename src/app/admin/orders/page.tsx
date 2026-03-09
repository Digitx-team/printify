"use client";

import { useState } from "react";
import { ShoppingBag, Palette } from "lucide-react";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import CustomOrdersTable from "@/components/admin/orders/CustomOrdersTable";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

export default function OrdersPage() {
  const [tab, setTab] = useState<'regular' | 'custom'>('regular');
  const { t } = useAdminI18n();

  return (
    <div className="space-y-5">
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
        </button>
      </div>

      {/* Tab content */}
      {tab === 'regular' ? <OrdersTable /> : <CustomOrdersTable />}
    </div>
  );
}