'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import OrderModal from './OrderModal';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { locale } = useLanguage();
  const [showOrder, setShowOrder] = useState(false);

  const t = {
    title: locale === 'ar' ? 'سلة المشتريات' : locale === 'en' ? 'Your Cart' : 'Votre Panier',
    empty: locale === 'ar' ? 'سلتك فارغة' : locale === 'en' ? 'Your cart is empty' : 'Votre panier est vide',
    continue: locale === 'ar' ? 'تابعي التسوق' : locale === 'en' ? 'Continue shopping' : 'Continuer vos achats',
    total: locale === 'ar' ? 'المجموع' : locale === 'en' ? 'Total' : 'Total',
    checkout: locale === 'ar' ? 'إتمام الطلب' : locale === 'en' ? 'Checkout' : 'Commander',
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[210]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] sm:w-[380px] md:max-w-md bg-white border-l border-sand z-[220] flex flex-col rounded-l-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
                <h3 className="font-serif text-xl font-light text-ink">{t.title} ({totalItems})</h3>
                <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <span className="text-3xl">🛒</span>
                    <p className="font-sans text-muted">{t.empty}</p>
                    <button onClick={() => setIsOpen(false)} className="mt-2 font-sans text-accent text-sm hover:underline">{t.continue}</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 pb-4 border-b border-sand/50">
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-sand relative shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-ink truncate">{item.product.name}</p>
                          <p className="font-serif text-base text-accent mt-1">{item.product.price.toLocaleString()} DA</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 border border-sand rounded flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-sans text-sm font-medium text-ink w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 border border-sand rounded flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                            <button onClick={() => removeItem(item.product.id)} className="ml-auto text-muted hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-sand">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-muted">{t.total}</span>
                    <span className="font-serif text-2xl text-ink">{totalPrice.toLocaleString()} DA</span>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); setShowOrder(true); }}
                    className="group relative w-full bg-ink text-cream py-4 font-sans text-xs tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
                    <span className="relative z-[1]">{t.checkout}</span>
                    <span className="relative z-[1]">→</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrder && <OrderModal onClose={() => setShowOrder(false)} />}
      </AnimatePresence>
    </>
  );
}
