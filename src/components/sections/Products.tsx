'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/types';
import ProductOverlay from '@/components/ui/ProductOverlay';

interface ProductsProps {
  initialProducts?: Product[];
}

export default function Products({ initialProducts }: ProductsProps) {
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Only fetch client-side if no server-provided data
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialProducts]);


  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = (product: Product, model: string, customName: string) => {
    addItem(product, model, customName);
    setSelectedProduct(null);
  };

  const title = locale === 'ar' ? 'أغطية جاهزة' : locale === 'en' ? 'Ready to order' : 'Prêtes à commander';
  const titleAccent = locale === 'ar' ? 'للطلب' : locale === 'en' ? 'cases' : 'coques';
  const eyebrow = locale === 'ar' ? 'أعمالنا' : locale === 'en' ? 'Our Creations' : 'Nos Créations';
  const orderBtn = locale === 'ar' ? 'طلب' : locale === 'en' ? 'Order' : 'Commander';
  const viewAllBtn = locale === 'ar' ? 'عرض الكل' : locale === 'en' ? 'View All' : 'Voir tout';

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
          <a href="/store" className="shrink-0 font-sans text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-cream transition-all duration-200">
            {viewAllBtn} <span className="arrow-flip">→</span>
          </a>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.slice(0, 8).map((product, i) => (
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
                    unoptimized={product.image.startsWith('http')}
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
