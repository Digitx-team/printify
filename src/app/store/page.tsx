'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/types';
import Link from 'next/link';
import ProductOverlay from '@/components/ui/ProductOverlay';


/* ─── Store Page ─── */
export default function StorePage() {
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleLike = (id: string) => {
    setLiked(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleConfirm = (product: Product, model: string, customName: string) => {
    addItem(product, model, customName);
    setSelectedProduct(null);
  };

  const t = {
    title: locale === 'ar' ? 'متجرنا' : locale === 'en' ? 'Our Store' : 'Notre Boutique',
    subtitle: locale === 'ar' ? 'اكتشفي جميع أغطيتنا المتوفرة' : locale === 'en' ? 'Explore all our available cases' : 'Découvrez toutes nos coques disponibles',
    back: locale === 'ar' ? 'الرئيسية' : locale === 'en' ? 'Home' : 'Accueil',
    order: locale === 'ar' ? 'طلب' : locale === 'en' ? 'Order' : 'Commander',
    noProducts: locale === 'ar' ? 'لا توجد منتجات بعد' : locale === 'en' ? 'No products yet' : 'Aucun produit pour le moment',
  };

  return (
    <>
      <section className="min-h-screen px-5 md:px-12 lg:px-20 pt-28 pb-16 md:pt-32 md:pb-24 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.08em] uppercase text-muted hover:text-accent transition-colors mb-3">
              <ArrowLeft className={`w-3.5 h-3.5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              {t.back}
            </Link>
            <h1 className="font-serif text-[clamp(32px,4vw,56px)] font-light text-ink leading-[1.1]">
              {t.title}
            </h1>
            <p className="font-sans text-sm text-muted mt-2">{t.subtitle}</p>
          </div>
          <div className="font-sans text-xs text-muted bg-cream px-4 py-2 rounded-full">
            {products.length} {locale === 'ar' ? 'منتج' : locale === 'en' ? 'products' : 'produits'}
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-muted">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="product-card group relative bg-cream rounded-xl overflow-hidden border border-soft/20 shadow-[0_4px_24px_rgba(44,31,20,0.08)] hover:shadow-[0_12px_40px_rgba(44,31,20,0.14)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {product.popular && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-accent text-cream font-sans text-[8px] md:text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full shadow-sm">
                      Bestseller
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white hover:scale-110 shadow-sm">
                    <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(product.id) ? 'fill-red-400 text-red-400' : 'text-muted'}`} />
                  </button>
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" unoptimized={product.image.startsWith('http')} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:flex">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="w-full flex items-center justify-center gap-2 bg-cream/95 text-ink py-2.5 text-center font-sans text-[10px] tracking-[0.1em] uppercase font-medium rounded-lg hover:bg-white transition-colors shadow-sm">
                      <ShoppingBag className="w-3 h-3" /> {t.order}
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <p className="font-serif text-[14px] md:text-[15px] text-ink font-normal mb-1 truncate">{product.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg md:text-xl font-normal text-ink">
                      {product.price.toLocaleString()} <span className="font-sans text-[10px] text-muted font-medium">DA</span>
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="md:hidden w-8 h-8 bg-ink text-cream rounded-full flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductOverlay product={selectedProduct} locale={locale}
            onClose={() => setSelectedProduct(null)} onConfirm={handleConfirm} />
        )}
      </AnimatePresence>
    </>
  );
}
