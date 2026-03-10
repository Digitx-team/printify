"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Upload, Plus, X as XIcon, Save, Loader2, ImageIcon } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { createProduct, uploadProductImage } from "@/lib/admin-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "", sku: "",
    status: "active", tags: ["New Arrival"] as string[],
    metaTitle: "", metaDescription: "", urlSlug: "",
    trackInventory: true, stock: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useAdminI18n();
  const router = useRouter();

  const updateField = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setImages(prev => [...prev, ...newImages]);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = files
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError(t("productForm.productName") + " is required");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError(t("productForm.priceDa") + " is required");
      return;
    }

    setError("");
    setSaving(true);
    try {
      // 1. Create the product
      const product = await createProduct({
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        status: form.status,
        stock: form.stock ? parseInt(form.stock) : 0,
        sku: form.sku.trim(),
      });

      // 2. Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          setUploadProgress(`Uploading image ${i + 1}/${images.length}...`);
          await uploadProductImage(images[i].file, product.id, i === 0);
        }
      }

      setSaved(true);
      setUploadProgress("");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (err: any) {
      console.error("Save product error:", err);
      setError(err?.message || "Failed to save product");
      setUploadProgress("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("productForm.title")}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{t("productForm.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm font-medium text-emerald-600">{t("productForm.saved")}</span>}
          {error && <span className="text-sm font-medium text-red-500 max-w-[200px] truncate">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? (uploadProgress || "Saving...") : t("productForm.saveProduct")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.basicInfo")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.productName")}</label>
                <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Amirah Calligraphy Case" className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.description")}</label>
                <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="..." className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.images")}</h3>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <Image src={img.previewUrl} alt={`Preview ${i + 1}`} fill className="object-cover" sizes="150px" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    >
                      <XIcon size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              {images.length === 0 ? (
                <>
                  <Upload size={32} className="mx-auto text-text-muted mb-3" />
                  <p className="text-sm font-medium text-text-primary">{t("productForm.dragDrop")}</p>
                  <p className="text-xs text-text-muted mt-1">{t("productForm.orBrowse")}</p>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="mx-auto text-text-muted mb-2" />
                  <p className="text-sm text-text-muted">
                    {images.length} image{images.length > 1 ? 's' : ''} selected — click to add more
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.pricing")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.priceDa")}</label>
                <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.comparePrice")}</label>
                <input type="number" value={form.comparePrice} onChange={(e) => updateField("comparePrice", e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("products.sku")}</label>
                <input type="text" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="SKU-000000" className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.seo")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.metaTitle")}</label>
                <input type="text" value={form.metaTitle} onChange={(e) => updateField("metaTitle", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.metaDescription")}</label>
                <textarea rows={2} value={form.metaDescription} onChange={(e) => updateField("metaDescription", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.urlSlug")}</label>
                <div className="flex items-center rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <span className="px-3 py-2.5 bg-gray-50 text-xs text-text-muted border-r border-border">casify.store/products/</span>
                  <input type="text" value={form.urlSlug} onChange={(e) => updateField("urlSlug", e.target.value)} placeholder="product-name" className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.statusLabel")}</h3>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-white">
              <option value="active">{t("common.active")}</option>
              <option value="draft">{t("common.draft")}</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.tags")}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {form.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-lighter text-primary text-xs font-semibold">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500"><XIcon size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} placeholder={t("productForm.addTag")} className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              <button onClick={addTag} className="p-2 rounded-xl bg-primary-lighter text-primary hover:bg-primary hover:text-white transition-all"><Plus size={16} /></button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 lg:p-6">
            <h3 className="text-base font-semibold text-text-primary mb-4">{t("productForm.inventory")}</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">{t("productForm.trackInventory")}</span>
              <button
                onClick={() => updateField("trackInventory", !form.trackInventory)}
                className={clsx("w-10 h-6 rounded-full transition-colors relative", form.trackInventory ? "bg-primary" : "bg-gray-200")}
              >
                <span className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", form.trackInventory ? "left-5" : "left-1")} />
              </button>
            </div>
            {form.trackInventory && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t("productForm.stockQuantity")}</label>
                <input type="number" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}