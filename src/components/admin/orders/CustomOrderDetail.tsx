"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, ChevronRight, X as XIcon, Check, MapPin, Loader2, Phone, MessageSquare, Smartphone, User, ImageIcon } from "lucide-react";
import { fetchCustomOrders, updateCustomOrderStatus } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import Link from "next/link";
import clsx from "clsx";

interface CustomOrderDetailProps {
  orderId: string;
}

interface CustomOrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  brand_slug: string;
  phone_model: string;
  description: string;
  status: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

const statusBanner: Record<string, { bg: string; border: string; iconColor: string }> = {
  pending: { bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-600" },
  confirmed: { bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-600" },
  shipped: { bg: "bg-indigo-50", border: "border-indigo-200", iconColor: "text-indigo-600" },
  delivered: { bg: "bg-emerald-50", border: "border-emerald-200", iconColor: "text-emerald-600" },
  cancelled: { bg: "bg-red-50", border: "border-red-200", iconColor: "text-red-500" },
};

const nextStatus: Record<string, string> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

const timelineSteps = ["pending", "confirmed", "shipped", "delivered"];

export default function CustomOrderDetail({ orderId }: CustomOrderDetailProps) {
  const [order, setOrder] = useState<CustomOrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { t } = useAdminI18n();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const allOrders = await fetchCustomOrders();
      const found = allOrders.find((o: any) => o.id === orderId);
      if (found) {
        setOrder({
          id: found.id,
          order_number: found.order_number || '',
          customer_name: found.customer_name,
          customer_phone: found.customer_phone,
          wilaya: found.wilaya,
          address: found.address || '',
          brand_slug: found.brand_slug || '',
          phone_model: found.phone_model || '',
          description: found.description || '',
          status: found.status,
          image_urls: found.image_urls || [],
          created_at: found.created_at,
          updated_at: found.updated_at || found.created_at,
        });
      }
    } catch (err) {
      console.error('Failed to load custom order:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusTranslation = (s: string) => t(`status.${s.toLowerCase()}`) || s;

  const handleNextStep = async () => {
    if (!order || !nextStatus[order.status]) return;
    const newStatus = nextStatus[order.status];
    setUpdating(true);
    try {
      await updateCustomOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateCustomOrderStatus(order.id, 'cancelled');
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (err) {
      console.error('Cancel failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-text-muted">Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <Package size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-lg font-semibold text-text-primary">Order not found</p>
        <p className="text-sm text-text-muted mt-1">Custom order {orderId} does not exist</p>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium">
          <ArrowLeft size={16} /> Back to orders
        </Link>
      </div>
    );
  }

  const nextLabel = nextStatus[order.status];
  const banner = statusBanner[order.status] || statusBanner.pending;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("orderDetail.title")} {order.order_number}</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {nextLabel && order.status !== "cancelled" && (
            <button onClick={handleNextStep} disabled={updating}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
              {updating ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              {t("orderDetail.markAs")} {statusTranslation(nextLabel)}
            </button>
          )}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <button onClick={handleCancel} disabled={updating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
              <XIcon size={16} /> {t("orderDetail.cancelOrder")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Banner */}
          <div className={clsx("rounded-2xl p-4 border", banner.bg, banner.border)}>
            <div className="flex items-center gap-3">
              {order.status === "delivered" ? <Check size={22} className={banner.iconColor} /> :
               order.status === "cancelled" ? <XIcon size={22} className={banner.iconColor} /> :
               <Package size={22} className={banner.iconColor} />}
              <p className={clsx("text-sm font-semibold", banner.iconColor)}>
                {statusTranslation(order.status)}
              </p>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              {t("orders.details")}
            </h3>
            <div className="space-y-4">
              {/* Phone model info */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={24} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary capitalize">{order.brand_slug}</p>
                  <p className="text-xs text-text-muted">{order.phone_model}</p>
                </div>
              </div>

              {/* Description */}
              {order.description && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-purple-500" />
                    <p className="text-sm font-semibold text-text-primary">{t("orders.description")}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                    {order.description}
                  </p>
                </div>
              )}

              {/* Design Images */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-amber-500" />
                  <p className="text-sm font-semibold text-text-primary">{t("orders.designImages")}</p>
                </div>
                {order.image_urls && order.image_urls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {order.image_urls.map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                        className="aspect-square rounded-xl overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-text-muted bg-gray-50 rounded-xl p-4 border border-border">
                    <ImageIcon size={16} />
                    {t("orders.noImages")}
                  </div>
                )}
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
              {timelineSteps.map((step, i) => {
                const stepIndex = timelineSteps.indexOf(order.status);
                const isCompleted = order.status === 'cancelled' ? false : timelineSteps.indexOf(step) <= stepIndex;
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={clsx(
                        "w-3 h-3 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                        isCompleted ? "bg-primary" : "bg-gray-200"
                      )} />
                      {i < timelineSteps.length - 1 && (
                        <div className={clsx("w-0.5 flex-1 min-h-[32px]", isCompleted && timelineSteps.indexOf(step) < stepIndex ? "bg-primary/30" : "bg-gray-200")} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={clsx("text-sm font-medium", isCompleted ? "text-text-primary" : "text-text-muted")}>{statusTranslation(step)}</p>
                      <p className="text-xs text-text-muted">
                        {isCompleted && step === order.status ? new Date(order.updated_at || order.created_at).toLocaleString() : isCompleted ? '✓' : '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
              {order.status === 'cancelled' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 bg-red-500" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-red-500">{statusTranslation('cancelled')}</p>
                    <p className="text-xs text-text-muted">{new Date(order.updated_at || order.created_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-text-primary">{t("orders.customer")}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{order.customer_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{order.customer_name}</p>
                  <p className="text-xs text-text-muted">{order.customer_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-text-primary">{t("orderDetail.shippingInfo")}</h3>
            </div>
            <div className="text-sm text-text-secondary space-y-1.5">
              {order.address && <p>{order.address}</p>}
              <p className="font-medium text-text-primary">{order.wilaya}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                <Phone size={12} />
                <span>{order.customer_phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
