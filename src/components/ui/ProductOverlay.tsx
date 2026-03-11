'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, X, ChevronDown, Check, Star } from 'lucide-react';
import { BRANDS, PHONE_MODELS } from '@/lib/constants';
import type { Product } from '@/types';

export default function ProductOverlay({
  product,
  locale,
  onClose,
  onConfirm,
}: {
  product: Product;
  locale: string;
  onClose: () => void;
  onConfirm: (product: Product, model: string, customName: string) => void;
}) {
  const [selectedBrand, setSelectedBrand] = useState('iphone');
  const [selectedModel, setSelectedModel] = useState('');
  const [customName, setCustomName] = useState('');
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const filteredModels = PHONE_MODELS.filter(m => m.brand.id === selectedBrand);
  const canConfirm = selectedModel !== '' && customName.trim() !== '';
  const isExternal = product.image?.startsWith('http');

  const t = {
    title: locale === 'ar' ? 'اختر موديل هاتفك' : locale === 'en' ? 'Choose your phone model' : 'Choisissez votre modèle',
    brand: locale === 'ar' ? 'الماركة' : locale === 'en' ? 'Brand' : 'Marque',
    model: locale === 'ar' ? 'الموديل' : locale === 'en' ? 'Model' : 'Modèle',
    selectBrand: locale === 'ar' ? 'اختر الماركة' : locale === 'en' ? 'Select brand' : 'Sélectionner la marque',
    selectModel: locale === 'ar' ? 'اختر الموديل' : locale === 'en' ? 'Select model' : 'Sélectionner le modèle',
    customName: locale === 'ar' ? 'الاسم المطلوب على الغطاء' : locale === 'en' ? 'Name on the case' : 'Nom sur la coque',
    customPlaceholder: locale === 'ar' ? 'مثال: أميرة' : locale === 'en' ? 'e.g. Amirah' : 'ex: Amirah',
    confirm: locale === 'ar' ? 'أضف للسلة' : locale === 'en' ? 'Add to cart' : 'Ajouter au panier',
    price: locale === 'ar' ? 'دج' : 'DA',
    description: locale === 'ar' ? 'الوصف' : locale === 'en' ? 'Description' : 'Description',
    bestseller: locale === 'ar' ? 'الأكثر مبيعاً' : locale === 'en' ? 'Bestseller' : 'Bestseller',
    personalName: locale === 'ar' ? 'أضف اسمك ✱' : locale === 'en' ? 'Add your name ✱' : 'Ajoutez votre nom ✱',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-[520px] bg-white sm:rounded-2xl rounded-t-2xl shadow-[0_-8px_60px_rgba(0,0,0,0.3)] sm:shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-hidden max-h-[85vh] sm:max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-md transition-all hover:scale-105"
        >
          <X className="w-4 h-4 text-ink" />
        </button>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/4] sm:aspect-[4/4] bg-gradient-to-b from-cream to-soft/30 overflow-hidden">
          {product.popular && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-accent text-cream font-sans text-[10px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-cream" />
              {t.bestseller}
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 sm:p-8"
            sizes="(max-width: 640px) 100vw, 520px"
            unoptimized={isExternal}
            priority
          />
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl sm:text-2xl font-light text-ink leading-tight">
                {product.name}
              </h3>
              {product.description && (
                <p className="font-sans text-sm text-muted mt-1.5 line-clamp-2">{product.description}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-serif text-2xl sm:text-3xl font-normal text-accent">
                {product.price.toLocaleString()}
              </p>
              <span className="font-sans text-xs text-muted font-medium">{t.price}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-soft/30" />

          {/* Phone Selection */}
          <div>
            <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted font-semibold mb-3">{t.title}</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Brand */}
              <div className="relative">
                <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted/70 mb-1 block">{t.brand}</label>
                <button
                  onClick={() => { setBrandOpen(!brandOpen); setModelOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-cream/80 rounded-xl border border-soft/30 font-sans text-[13px] text-ink hover:border-accent/40 transition-colors"
                >
                  <span className="truncate">{BRANDS.find(b => b.id === selectedBrand)?.label || t.selectBrand}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform shrink-0 ml-1 ${brandOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {brandOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-soft/30 shadow-xl z-30 overflow-hidden max-h-[180px] overflow-y-auto"
                    >
                      {BRANDS.filter(b => b.id !== 'all').map(b => (
                        <button
                          key={b.id}
                          onClick={() => { setSelectedBrand(b.id); setSelectedModel(''); setBrandOpen(false); }}
                          className={`w-full text-left px-3.5 py-2.5 font-sans text-[13px] hover:bg-cream transition-colors flex items-center justify-between ${selectedBrand === b.id ? 'text-accent font-medium bg-accent/5' : 'text-ink'}`}
                        >
                          {b.label}
                          {selectedBrand === b.id && <Check className="w-3.5 h-3.5 text-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Model */}
              <div className="relative">
                <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted/70 mb-1 block">{t.model}</label>
                <button
                  onClick={() => { setModelOpen(!modelOpen); setBrandOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-cream/80 rounded-xl border border-soft/30 font-sans text-[13px] text-ink hover:border-accent/40 transition-colors"
                >
                  <span className={`truncate ${selectedModel ? 'text-ink' : 'text-muted'}`}>
                    {selectedModel || t.selectModel}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform shrink-0 ml-1 ${modelOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {modelOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-soft/30 shadow-xl z-30 overflow-hidden max-h-[180px] overflow-y-auto"
                    >
                      {filteredModels.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedModel(m.name); setModelOpen(false); }}
                          className={`w-full text-left px-3.5 py-2.5 font-sans text-[13px] hover:bg-cream transition-colors flex items-center justify-between ${selectedModel === m.name ? 'text-accent font-medium bg-accent/5' : 'text-ink'}`}
                        >
                          <span>
                            {m.name}
                            {m.popular && <span className="ml-1.5 text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">⭐</span>}
                          </span>
                          {selectedModel === m.name && <Check className="w-3.5 h-3.5 text-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Custom name */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted/70 mb-1.5 block">{t.personalName}</label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder={t.customPlaceholder}
              required
              className={`w-full px-4 py-3 bg-cream/60 rounded-xl border font-sans text-[13px] text-ink placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all ${customName.trim() ? 'border-soft/30' : 'border-red-300/50'}`}
            />
          </div>

          {/* Add to cart */}
          <button
            onClick={() => canConfirm && onConfirm(product, selectedModel, customName)}
            disabled={!canConfirm}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-sans text-[12px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 ${
              canConfirm
                ? 'bg-ink text-cream hover:bg-accent shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-soft/30 text-muted cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t.confirm}
            {canConfirm && (
              <span className="ml-1 text-cream/70">— {product.price.toLocaleString()} {t.price}</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
