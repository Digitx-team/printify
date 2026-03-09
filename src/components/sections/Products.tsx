'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingBag, Loader2, X, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { fetchProducts } from '@/lib/api';
import { BRANDS, PHONE_MODELS } from '@/lib/constants';
import type { Product } from '@/types';

const FILTERS = [
  { id: 'all', fr: 'Tous', en: 'All', ar: 'الكل' },
  { id: 'calligraphy', fr: 'Calligraphie', en: 'Calligraphy', ar: 'خط عربي' },
  { id: 'nature', fr: 'Nature', en: 'Nature', ar: 'طبيعة' },
  { id: 'artistic', fr: 'Artistique', en: 'Artistic', ar: 'فني' },
  { id: 'personalized', fr: 'Personnalisé', en: 'Personalized', ar: 'مخصص' },
  { id: 'geometric', fr: 'Géométrique', en: 'Geometric', ar: 'هندسي' },
];

// Categories that allow custom name input
const PERSONALIZABLE = ['calligraphy', 'personalized'];

function ProductOverlay({
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
  const isPersonalizable = PERSONALIZABLE.includes(product.category);
  const canConfirm = selectedModel !== '';

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
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted" />
        </button>

        {/* Product preview */}
        <div className="flex items-center gap-4 p-5 border-b border-soft/20">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg font-light text-ink truncate">{product.name}</p>
            <p className="font-serif text-xl font-normal text-accent">
              {product.price.toLocaleString()} <span className="font-sans text-xs text-muted">{t.price}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-muted font-medium">{t.title}</p>

          {/* Brand selector */}
          <div className="relative">
            <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5 block">{t.brand}</label>
            <button
              onClick={() => { setBrandOpen(!brandOpen); setModelOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 bg-cream rounded-xl border border-soft/30 font-sans text-[13px] text-ink hover:border-accent/40 transition-colors"
            >
              <span>{BRANDS.find(b => b.id === selectedBrand)?.label || t.selectBrand}</span>
              <ChevronDown className={`w-4 h-4 text-muted transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {brandOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-soft/30 shadow-lg z-20 overflow-hidden"
                >
                  {BRANDS.filter(b => b.id !== 'all').map(b => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBrand(b.id); setSelectedModel(''); setBrandOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-sans text-[13px] hover:bg-cream transition-colors flex items-center justify-between ${selectedBrand === b.id ? 'text-accent font-medium' : 'text-ink'}`}
                    >
                      {b.label}
                      {selectedBrand === b.id && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Model selector */}
          <div className="relative">
            <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5 block">{t.model}</label>
            <button
              onClick={() => { setModelOpen(!modelOpen); setBrandOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 bg-cream rounded-xl border border-soft/30 font-sans text-[13px] text-ink hover:border-accent/40 transition-colors"
            >
              <span className={selectedModel ? 'text-ink' : 'text-muted'}>{selectedModel || t.selectModel}</span>
              <ChevronDown className={`w-4 h-4 text-muted transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-soft/30 shadow-lg z-20 overflow-hidden max-h-[200px] overflow-y-auto scrollbar-hide"
                >
                  {filteredModels.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.name); setModelOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-sans text-[13px] hover:bg-cream transition-colors flex items-center justify-between ${selectedModel === m.name ? 'text-accent font-medium' : 'text-ink'}`}
                    >
                      <span>
                        {m.name}
                        {m.popular && <span className="ml-2 text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">⭐</span>}
                      </span>
                      {selectedModel === m.name && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Custom name (only for personalizable cases) */}
          {isPersonalizable && (
            <div>
              <label className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5 block">{t.customName}</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder={t.customPlaceholder}
                className="w-full px-4 py-3 bg-cream rounded-xl border border-soft/30 font-sans text-[13px] text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Confirm button */}
          <button
            onClick={() => canConfirm && onConfirm(product, selectedModel, customName)}
            disabled={!canConfirm}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-200 ${
              canConfirm
                ? 'bg-ink text-cream hover:bg-accent shadow-sm'
                : 'bg-soft/30 text-muted cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t.confirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Products() {
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState('all');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'all' ? products : products.filter(p => p.category === activeFilter);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = (product: Product, model: string, customName: string) => {
    // Create a customized product with model and name info
    const customProduct: Product = {
      ...product,
      name: customName
        ? `${product.name} — ${model} — ${customName}`
        : `${product.name} — ${model}`,
    };
    addItem(customProduct);
    setSelectedProduct(null);
  };

  const filterLabel = (f: typeof FILTERS[0]) =>
    locale === 'ar' ? f.ar : locale === 'en' ? f.en : f.fr;

  const title = locale === 'ar' ? 'أغطية جاهزة' : locale === 'en' ? 'Ready to order' : 'Prêtes à commander';
  const titleAccent = locale === 'ar' ? 'للطلب' : locale === 'en' ? 'cases' : 'coques';
  const eyebrow = locale === 'ar' ? 'أعمالنا' : locale === 'en' ? 'Our Creations' : 'Nos Créations';
  const orderBtn = locale === 'ar' ? 'طلب' : locale === 'en' ? 'Order' : 'Commander';

  return (
    <>
      <section id="products" className="px-5 md:px-12 lg:px-20 py-16 md:py-24 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="section-eyebrow mb-2">{eyebrow}</div>
            <h2 className="font-serif text-[clamp(28px,3.5vw,48px)] font-light text-ink leading-[1.15]">
              {title} <em className="italic text-accent">{titleAccent}</em>
            </h2>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 md:mx-0 md:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 font-sans text-[11px] tracking-[0.08em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                activeFilter === f.id
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-transparent text-muted border-soft/60 hover:border-accent hover:text-accent'
              }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="product-card group relative bg-cream rounded-xl overflow-hidden border border-soft/20 shadow-[0_4px_24px_rgba(44,31,20,0.08)] hover:shadow-[0_12px_40px_rgba(44,31,20,0.14)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {product.popular && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-accent text-cream font-sans text-[8px] md:text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full shadow-sm">
                      Bestseller
                    </span>
                  )}

                  {/* Like button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white hover:scale-110 shadow-sm"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(product.id) ? 'fill-red-400 text-red-400' : 'text-muted'}`} />
                  </button>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Quick add overlay (desktop) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:flex">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="w-full flex items-center justify-center gap-2 bg-cream/95 text-ink py-2.5 text-center font-sans text-[10px] tracking-[0.1em] uppercase font-medium rounded-lg hover:bg-white transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {orderBtn}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <p className="font-serif text-[14px] md:text-[15px] text-ink font-normal mb-1 truncate">{product.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg md:text-xl font-normal text-ink">
                      {product.price.toLocaleString()} <span className="font-sans text-[10px] text-muted font-medium">DA</span>
                    </span>
                    {/* Mobile add button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="md:hidden w-8 h-8 bg-ink text-cream rounded-full flex items-center justify-center hover:bg-accent transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Product overlay modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductOverlay
            product={selectedProduct}
            locale={locale}
            onClose={() => setSelectedProduct(null)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </>
  );
}
