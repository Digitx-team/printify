"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, ChevronRight, X as XIcon, Check, MapPin, CreditCard, Loader2, Phone, MessageSquare, Smartphone, Sparkles, User } from "lucide-react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface OrderDetailProps {
  orderId: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  is_custom: boolean;
  custom_description: string;
  custom_name: string;
  phone_model: string;
  product_id: string;
  product_name: string | null;
  product_image: string | null;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  notes: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
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

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { t } = useAdminI18n();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const allOrders = await fetchAllOrders();
      const cleanId = orderId.replace('#', '');
      const found = allOrders.find((o: any) =>
        o.order_number === orderId ||
        o.order_number === `#${cleanId}` ||
        o.id === cleanId ||
        o.order_number?.replace('#', '') === cleanId
      );
      if (found) {
        setOrder({
          id: found.id,
          order_number: found.order_number,
          customer_name: found.customer_name,
          customer_phone: found.customer_phone,
          wilaya: found.wilaya,
          address: found.address || '',
          notes: found.notes || '',
          status: found.status,
          total_amount: found.total_amount || 0,
          shipping_cost: found.shipping_cost || 0,
          created_at: found.created_at,
          updated_at: found.updated_at || found.created_at,
          order_items: (found.order_items || []).map((item: any) => ({
            id: item.id,
            quantity: item.quantity || 1,
            unit_price: item.unit_price || 0,
            is_custom: item.is_custom || false,
            custom_description: item.custom_description || '',
            custom_name: item.custom_name || '',
            phone_model: item.phone_model || '',
            product_id: item.product_id || '',
            product_name: item.product_name || null,
            product_image: item.product_image || null,
          })),
        });
      }
    } catch (err) {
      console.error('Failed to load order:', err);
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
      await updateOrderStatus(order.id, newStatus);
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
      await updateOrderStatus(order.id, 'cancelled');
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
        <p className="text-sm text-text-muted mt-1">Order {orderId} does not exist</p>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium">
          <ArrowLeft size={16} /> Back to orders
        </Link>
      </div>
    );
  }

  const subtotal = order.order_items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  const nextLabel = nextStatus[order.status];
  const banner = statusBanner[order.status] || statusBanner.pending;
  const isExternal = (url: string | null) => url?.startsWith('http');

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

          {/* Order Items — Full Detail */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">
              {t("orderDetail.orderItems")} ({order.order_items.length})
            </h3>
            {order.order_items.length === 0 ? (
              <p className="text-sm text-text-muted py-4">No items in this order</p>
            ) : (
              <div className="space-y-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="rounded-xl border border-border overflow-hidden">
                    {/* Item Header */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50">
                      {/* Product image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name || 'Product'}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={!!isExternal(item.product_image)}
                          />
                        ) : item.is_custom ? (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                            <Sparkles size={24} className="text-purple-400" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-text-muted" />
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {item.is_custom && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-wide">Custom</span>
                          )}
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {item.product_name || (item.is_custom ? 'Custom Order' : 'Store Product')}
                          </p>
                        </div>
                        <p className="text-xs text-text-muted">
                          {item.quantity} × {item.unit_price.toLocaleString()} DA
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-primary">{(item.unit_price * item.quantity).toLocaleString()} DA</p>
                      </div>
                    </div>

                    {/* Item Details */}
                    {(item.phone_model || item.custom_name || item.custom_description) && (
                      <div className="px-4 py-3 space-y-2 border-t border-border bg-white">
                        {item.phone_model && (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <Smartphone size={14} className="text-blue-500" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium">Phone Model</p>
                              <p className="text-sm font-medium text-text-primary">{item.phone_model}</p>
                            </div>
                          </div>
                        )}
                        {item.custom_name && (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                              <User size={14} className="text-amber-500" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium">Custom Name</p>
                              <p className="text-sm font-medium text-text-primary">{item.custom_name}</p>
                            </div>
                          </div>
                        )}
                        {item.custom_description && (
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                              <MessageSquare size={14} className="text-purple-500" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium">Description</p>
                              <p className="text-sm text-text-primary leading-relaxed">{item.custom_description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="border-t border-border mt-5 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">{t("orderDetail.subtotal")}</span>
                <span className="text-text-primary">{subtotal.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">{t("orderDetail.shipping")}</span>
                <span className="text-text-primary">{order.shipping_cost.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-2">
                <span className="text-text-primary">{t("orderDetail.total")}</span>
                <span className="text-primary text-lg">{order.total_amount.toLocaleString()} DA</span>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={18} className="text-amber-500" />
                <h3 className="text-base font-semibold text-text-primary">Customer Notes</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                {order.notes}
              </p>
            </div>
          )}
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
              <h3 className="text-base font-semibold text-text-primary">Customer</h3>
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

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-text-primary">{t("orderDetail.payment")}</h3>
            </div>
            <div className="text-sm text-text-secondary space-y-2">
              <p className="font-medium">{t("orderDetail.cashOnDelivery")}</p>
              <div className={clsx(
                "flex items-center gap-2 text-xs px-3 py-2 rounded-lg",
                order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {order.status === 'delivered' ? <Check size={14} /> : <Loader2 size={14} />}
                <span className="font-medium">
                  {order.status === 'delivered' ? t("orderDetail.paymentCollected") : t("orderDetail.paymentPending")}
                </span>
              </div>
              <p className="text-xs text-text-muted font-semibold mt-1">
                {t("orderDetail.total")}: {order.total_amount.toLocaleString()} DA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}