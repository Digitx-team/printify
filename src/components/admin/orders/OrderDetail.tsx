"use client";

import { useState } from "react";
import { ArrowLeft, Package, ChevronRight, X as XIcon, Check, Printer, MapPin, CreditCard } from "lucide-react";
import { orderDetailItems, orderTimeline } from "@/data/admin/mockData";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import Link from "next/link";
import clsx from "clsx";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const [status, setStatus] = useState<"Pending" | "Shipped" | "Delivered" | "Cancelled">("Pending");
  const [timeline, setTimeline] = useState(orderTimeline);
  const { t } = useAdminI18n();

  const nextStatusMap: Record<string, string> = { Pending: "Shipped", Shipped: "Delivered" };
  const nextLabel = nextStatusMap[status];

  const statusTranslation = (s: string) => t(`status.${s.toLowerCase()}`) || s;

  const handleNextStep = () => {
    if (!nextLabel) return;
    setStatus(nextLabel as typeof status);
    setTimeline(prev =>
      prev.map(step => {
        if (step.status === "Shipped" && nextLabel === "Shipped") return { ...step, completed: true, date: new Date().toLocaleString() };
        if (step.status === "Delivered" && nextLabel === "Delivered") return { ...step, completed: true, date: new Date().toLocaleString() };
        return step;
      })
    );
  };

  const handleCancel = () => {
    setStatus("Cancelled");
  };

  const subtotal = orderDetailItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = 900;
  const total = subtotal + shipping;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("orderDetail.title")} {orderId}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{t("orderDetail.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">
            <Printer size={16} /> {t("orderDetail.print")}
          </button>
          {nextLabel && status !== "Cancelled" && (
            <button
              onClick={handleNextStep}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <ChevronRight size={16} />
              {t("orderDetail.markAs")} {statusTranslation(nextLabel)}
            </button>
          )}
          {status !== "Delivered" && status !== "Cancelled" && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
            >
              <XIcon size={16} /> {t("orderDetail.cancelOrder")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Banner */}
          <div className={clsx(
            "rounded-2xl p-4 border",
            status === "Delivered" ? "bg-emerald-50 border-emerald-200" :
            status === "Cancelled" ? "bg-red-50 border-red-200" :
            "bg-primary-lighter border-primary/20"
          )}>
            <div className="flex items-center gap-3">
              {status === "Delivered" ? <Check size={22} className="text-emerald-600" /> :
               status === "Cancelled" ? <XIcon size={22} className="text-red-500" /> :
               <Package size={22} className="text-primary" />}
              <div>
                <p className={clsx("text-sm font-semibold",
                  status === "Delivered" ? "text-emerald-700" :
                  status === "Cancelled" ? "text-red-600" : "text-primary"
                )}>
                  {status === "Delivered" ? t("orderDetail.orderDelivered") :
                   status === "Cancelled" ? t("orderDetail.orderCancelled") :
                   `${t("orderDetail.orderIs")} ${statusTranslation(status)}`}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {status === "Delivered" ? t("orderDetail.deliveredDesc") :
                   status === "Cancelled" ? t("orderDetail.cancelledDesc") :
                   status === "Pending" ? t("orderDetail.pendingDesc") :
                   t("orderDetail.shippedDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("orderDetail.orderItems")}</h3>
            <div className="space-y-3">
              {orderDetailItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package size={22} className="text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{(item.price * item.quantity).toLocaleString()} DA</p>
                    <p className="text-xs text-text-muted">{item.quantity} × {item.price.toLocaleString()} DA</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">{t("orderDetail.subtotal")}</span><span className="text-text-primary">{subtotal.toLocaleString()} DA</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">{t("orderDetail.shipping")}</span><span className="text-text-primary">{shipping.toLocaleString()} DA</span></div>
              <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-2">
                <span className="text-text-primary">{t("orderDetail.total")}</span>
                <span className="text-primary text-base">{total.toLocaleString()} DA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("orderDetail.timeline")}</h3>
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      "w-3 h-3 rounded-full mt-1 flex-shrink-0",
                      step.completed ? "bg-primary" : "bg-gray-200"
                    )} />
                    {i < timeline.length - 1 && (
                      <div className={clsx("w-0.5 flex-1 min-h-[32px]", step.completed ? "bg-primary/30" : "bg-gray-200")} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={clsx("text-sm font-medium", step.completed ? "text-text-primary" : "text-text-muted")}>{statusTranslation(step.status)}</p>
                    <p className="text-xs text-text-muted">{step.date || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-text-primary">{t("orderDetail.shippingInfo")}</h3>
            </div>
            <div className="text-sm text-text-secondary space-y-1">
              <p className="font-medium text-text-primary">Emma Wilson</p>
              <p>42 Rue des Oliviers</p>
              <p>Alger, 16000</p>
              <p>Algeria</p>
              <p className="text-xs text-text-muted mt-2">+213 555 123 456</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-text-primary">{t("orderDetail.payment")}</h3>
            </div>
            <div className="text-sm text-text-secondary space-y-1">
              <p>{t("orderDetail.cashOnDelivery")}</p>
              <p className="text-xs text-text-muted mt-2">{t("orderDetail.paymentCollected")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}