"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Plus, Edit3, Trash2, ChevronLeft, ChevronRight,
  Package, X as XIcon, Save, Loader2, Upload, ImageIcon,
} from "lucide-react";
import { fetchAllProducts, updateProduct, deleteProduct as apiDeleteProduct, uploadProductImage, deleteProductImage } from "@/lib/admin-api";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

const ITEMS_PER_PAGE = 6;
const statuses = ["All", "Active", "Draft"];

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: "active" | "draft";
  image: string;
  description: string;
}

export default function ProductsTable() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useAdminI18n();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProductsList(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || '',
          price: p.price,
          stock: p.stock || 0,
          status: p.status || 'active',
          image: p.image_url || '',
          description: p.description || '',
      })));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "All" || p.status.toLowerCase() === status.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [search, status, productsList]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteProduct(id);
      setProductsList(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleteConfirm(null);
  };

  const openEdit = (product: Product) => {
    setEditModal({ ...product });
    setNewImage(null);
    setNewImagePreview("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setNewImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      await updateProduct(editModal.id, {
        name: editModal.name,
        price: editModal.price,
        stock: editModal.stock,
        status: editModal.status,
        sku: editModal.sku,
        description: editModal.description,
      });

      let updatedImage = editModal.image;

      // Upload new image if selected
      if (newImage) {
        const imageUrl = await uploadProductImage(newImage, editModal.id, true);
        updatedImage = imageUrl;
      }

      setProductsList(prev =>
        prev.map(p => p.id === editModal.id ? { ...editModal, image: updatedImage } : p)
      );
      setEditModal(null);
      setNewImage(null);
      setNewImagePreview("");
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t("products.title")}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{t("products.subtitle")}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={18} />
          {t("products.addProduct")}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={t("products.search")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-text-muted uppercase whitespace-nowrap">{t("orders.status")}</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              {statuses.map((s) => (<option key={s} value={s}>{s === "All" ? t("products.allStatus") : s === "Active" ? t("common.active") : t("common.draft")}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-text-muted">{t("products.loading")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("products.productName")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("products.price")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("products.stock")}</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-3.5">{t("orders.status")}</th>
                  <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{t("products.action")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <tr key={product.id} className="table-row-hover border-b border-border/50 last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          {product.image && product.image !== '' ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                              unoptimized={product.image.startsWith('http')}
                            />
                          ) : (
                            <Package size={20} className="text-text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{product.name}</p>
                          <p className="text-xs text-text-muted">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-sm font-semibold text-text-primary">{product.price.toLocaleString()} DA</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-secondary">{product.stock.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", product.status === "active" ? "badge-active" : "badge-draft")}>
                        <span className={clsx("w-1.5 h-1.5 rounded-full", product.status === "active" ? "bg-emerald-500" : "bg-gray-400")} />
                        {product.status === 'active' ? t("common.active") : t("common.draft")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-primary bg-primary-lighter hover:bg-primary hover:text-white transition-all">
                          <Edit3 size={15} />
                        </button>
                        <span className="text-xs text-primary font-medium hidden sm:inline">{t("products.edit")}</span>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(product.id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">{t("common.yes")}</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-gray-100 text-text-secondary text-xs font-semibold hover:bg-gray-200 transition-colors">{t("common.no")}</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(product.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors ml-1">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-5 py-4 border-t border-border">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={clsx("w-9 h-9 rounded-lg text-sm font-medium transition-colors", currentPage === page ? "bg-primary text-white" : "text-text-secondary hover:bg-gray-100")}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setEditModal(null); setNewImage(null); setNewImagePreview(""); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text-primary">{t("products.editProduct")}</h3>
              <button onClick={() => { setEditModal(null); setNewImage(null); setNewImagePreview(""); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"><XIcon size={18} /></button>
            </div>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.images")}</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0 border border-border">
                    {(newImagePreview || editModal.image) ? (
                      <Image
                        src={newImagePreview || editModal.image}
                        alt="Product"
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={14} />
                      {newImage ? 'Change photo' : 'Upload photo'}
                    </button>
                    {newImage && <p className="text-xs text-emerald-600 mt-1">New image selected ✓</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("products.name")}</label>
                <input type="text" value={editModal.name} onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.description")}</label>
                <textarea rows={3} value={editModal.description} onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("products.priceDa")}</label>
                  <input type="number" value={editModal.price} onChange={(e) => setEditModal({ ...editModal, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("products.stock")}</label>
                  <input type="number" value={editModal.stock} onChange={(e) => setEditModal({ ...editModal, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("orders.status")}</label>
                  <select value={editModal.status} onChange={(e) => setEditModal({ ...editModal, status: e.target.value as "active" | "draft" })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                    <option value="active">{t("common.active")}</option>
                    <option value="draft">{t("common.draft")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("products.sku")}</label>
                  <input type="text" value={editModal.sku} onChange={(e) => setEditModal({ ...editModal, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">
              <button onClick={() => { setEditModal(null); setNewImage(null); setNewImagePreview(""); }} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors">{t("common.cancel")}</button>
              <button onClick={handleEditSave} disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? t("products.saving") : t("products.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}