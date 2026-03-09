'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, X, Eye } from 'lucide-react';
import Image from 'next/image';
import { PRODUCTS, TESTIMONIALS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import type { Product, TestimonialItem } from '@/types';

function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4 }}
      className="group bg-surface2 rounded-2xl border border-white/[0.06] overflow-hidden hover:border-accent/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={onView}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white font-body text-sm border border-white/20">
            <Eye className="w-4 h-4" />
            {t('gallery_view')}
          </span>
        </div>
        {/* Popular badge */}
        {product.popular && (
          <div className="absolute top-3 left-3 bg-accent/90 text-ink text-xs font-body font-semibold px-2.5 py-1 rounded-full">
            ⭐ Popular
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body font-semibold text-white text-sm truncate">{product.name}</h3>
        <p className="font-body text-white/40 text-xs mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="font-syne font-extrabold text-accent text-lg">
              {product.price.toLocaleString()}
            </span>
            <span className="font-body text-accent/70 text-xs ml-1">{t('gallery_price')}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-body font-medium transition-all duration-200 ${
              added
                ? 'bg-success/20 text-success'
                : 'bg-accent hover:bg-accent/90 text-ink'
            }`}
          >
            {added ? (
              t('product_added')
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                {t('gallery_add_cart')}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-surface border border-white/[0.08] rounded-3xl z-[70] overflow-hidden max-h-[90vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-ink/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-[400px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col justify-center">
              {product.popular && (
                <span className="inline-flex self-start bg-accent/15 text-accent text-xs font-mono px-2.5 py-1 rounded-full mb-3">
                  ⭐ Popular
                </span>
              )}
              <h2 className="font-syne font-extrabold text-2xl text-white">{product.name}</h2>

              <div className="mt-4">
                <span className="font-mono text-xs text-white/40 uppercase">{t('product_desc')}</span>
                <p className="font-body text-white/60 text-sm leading-relaxed mt-1">{product.description}</p>
              </div>

              <div className="mt-6">
                <span className="font-mono text-xs text-white/40 uppercase">{t('product_category')}</span>
                <p className="font-body text-white/60 text-sm mt-1 capitalize">{product.category}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex items-end gap-2">
                  <span className="font-syne font-extrabold text-3xl text-accent">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="font-body text-accent/70 text-sm mb-1">{t('gallery_price')}</span>
                </div>

                <button
                  onClick={handleAdd}
                  className={`w-full mt-4 flex items-center justify-center gap-2 rounded-full h-12 font-body font-medium transition-all duration-200 ${
                    added
                      ? 'bg-success/20 text-success'
                      : 'bg-accent hover:bg-accent/90 text-ink'
                  }`}
                >
                  {added ? (
                    t('product_added')
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      {t('product_add')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="bg-surface2 border border-white/[0.06] rounded-2xl p-5 min-w-[280px] shrink-0">
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="font-body italic text-white/70 text-sm leading-relaxed mt-3">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="font-mono text-xs text-white/40 mt-3">{testimonial.author}</p>
    </div>
  );
}

export default function Gallery() {
  const { t } = useLanguage();
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  return (
    <section id="gallery" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-accent uppercase tracking-widest">{t('gallery_label')}</span>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white mt-3">{t('gallery_title')}</h2>
          <p className="font-body text-white/50 text-base mt-4 max-w-lg mx-auto">{t('gallery_sub')}</p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={() => setViewProduct(product)}
            />
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="font-mono text-xs text-accent uppercase tracking-widest">
              {t('testimonial_label')}
            </span>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {viewProduct && (
          <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
