"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, Ticket, Trash2, Edit3, X as XIcon, Save, Loader2 } from "lucide-react";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-blue-50 text-blue-600",
  expired: "bg-gray-100 text-gray-500",
};

const filterOptions = ["All", "active", "expired"];

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  min_order: number;
  usage_count: number;
  usage_limit: number;
  expires_at: string | null;
  status: string;
  created_at: string;
}

const emptyCoupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count' | 'status'> = {
  code: '',
  type: 'percentage',
  value: 0,
  min_order: 0,
  usage_limit: 100,
  expires_at: '',
};

export default function CouponsPage() {
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { t } = useAdminI18n();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons();
      setCouponsList(data.map((c: any) => ({
        id: c.id,
        code: c.code || '',
        type: c.type || 'percentage',
        value: c.value || 0,
        min_order: c.min_order || 0,
        usage_count: c.usage_count || 0,
        usage_limit: c.usage_limit || 100,
        expires_at: c.expires_at || null,
        status: c.expires_at && new Date(c.expires_at) < new Date() ? 'expired' : 'active',
        created_at: c.created_at,
      })));
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (c: Coupon) => {
    if (c.expires_at && new Date(c.expires_at) < new Date()) return 'expired';
    return 'active';
  };

  const filtered = couponsList.filter(c => {
    if (filter === "All") return true;
    return getStatus(c) === filter;
  });

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setForm({ ...emptyCoupon });
    setError("");
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_order: coupon.min_order,
      usage_limit: coupon.usage_limit,
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) { setError("Code is required"); return; }
    if (form.value <= 0) { setError("Value must be > 0"); return; }

    setSaving(true);
    setError("");
    try {
      if (editingCoupon) {
        // Update
        await updateCoupon(editingCoupon.id, {
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: form.value,
          min_order: form.min_order,
          usage_limit: form.usage_limit,
          expires_at: form.expires_at || null,
        });
      } else {
        // Create
        await createCoupon({
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: form.value,
          min_order: form.min_order,
          usage_limit: form.usage_limit,
          expires_at: form.expires_at || null,
        });
      }
      setShowModal(false);
      await loadCoupons();
    } catch (err: any) {
      setError(err?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      setCouponsList(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleteConfirm(null);
  };

  const activeCoupons = couponsList.filter(c => getStatus(c) === 'active').length;
  const totalRedemptions = couponsList.reduce((a, c) => a + c.usage_count, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t("coupons.title")}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{t("coupons.subtitle")}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={18} /> {t("coupons.createCoupon")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.activeCoupons")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{activeCoupons}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.totalRedemptions")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{totalRedemptions}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm text-text-secondary font-medium">{t("coupons.totalCoupons") === "coupons.totalCoupons" ? "Total Coupons" : t("coupons.totalCoupons")}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{couponsList.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filterOptions.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("px-3.5 py-2 rounded-xl text-sm font-medium transition-all", filter === f ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-text-secondary hover:bg-gray-50")}>
            {f === "All" ? t("coupons.all") : f === "active" ? t("common.active") : t("coupons.expired")}
          </button>
        ))}
      </div>

      {/* Coupon Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Ticket size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm text-text-muted">No coupons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(coupon => {
            const couponStatus = getStatus(coupon);
            return (
              <div key={coupon.id} className="bg-white rounded-2xl border border-border p-5 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center">
                      <Ticket size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-text-primary">{coupon.code}</span>
                        <button onClick={() => copyCode(coupon.id, coupon.code)} className="p-1 rounded hover:bg-gray-100 transition-colors" title={t("coupons.copyCode")}>
                          <Copy size={13} className={copied === coupon.id ? "text-emerald-500" : "text-text-muted"} />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{coupon.type === 'percentage' ? '%' : 'DA'} {t("coupons.discount")}</p>
                    </div>
                  </div>
                  <span className={clsx("px-2.5 py-1 rounded-lg text-xs font-semibold", statusStyles[couponStatus] || statusStyles.active)}>
                    {couponStatus === 'active' ? t("common.active") : t("coupons.expired")}
                  </span>
                </div>

                <div className="text-3xl font-bold text-primary mb-3">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value.toLocaleString()} DA`}
                </div>

                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between"><span>{t("coupons.minOrder")}</span><span className="font-medium text-text-primary">{coupon.min_order.toLocaleString()} DA</span></div>
                  <div className="flex justify-between"><span>{t("coupons.used")}</span><span className="font-medium text-text-primary">{coupon.usage_count} / {coupon.usage_limit}</span></div>
                  {coupon.expires_at && (
                    <div className="flex justify-between"><span>{t("coupons.expires")}</span><span className="font-medium text-text-primary">{new Date(coupon.expires_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></div>
                  )}
                </div>

                {/* Usage bar */}
                <div className="mt-3">
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((coupon.usage_count / coupon.usage_limit) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">{((coupon.usage_count / coupon.usage_limit) * 100).toFixed(0)}% {t("coupons.percentUsed")}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <button onClick={() => openEdit(coupon)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-primary bg-primary-lighter hover:bg-primary hover:text-white transition-all">
                    <Edit3 size={13} /> {t("products.edit")}
                  </button>
                  {deleteConfirm === coupon.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(coupon.id)} className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">{t("common.yes")}</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-2 rounded-xl bg-gray-100 text-text-secondary text-xs font-semibold hover:bg-gray-200 transition-colors">{t("common.no")}</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(coupon.id)} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text-primary">
                {editingCoupon ? t("coupons.editCoupon") : t("coupons.createCoupon")}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><XIcon size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.code")}</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.type")}</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">DA Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.value")}</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.minOrder")}</label>
                  <input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.usageLimit")}</label>
                  <input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("coupons.expires")}</label>
                <input type="date" value={form.expires_at || ''} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">{t("common.cancel")}</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : editingCoupon ? t("products.saveChanges") : t("coupons.createCoupon")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}