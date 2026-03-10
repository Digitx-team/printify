'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchShippingRates, submitOrder } from '@/lib/api';
import Image from 'next/image';

/* ─── Order Modal ──────────────────────────────────────────────── */
export default function OrderModal({ onClose }: { onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCart();
  const { locale } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [shippingRates, setShippingRates] = useState<any[]>([]);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWilaya, setFormWilaya] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Load shipping rates from Supabase (brands/phones are hardcoded)
  useEffect(() => {
    fetchShippingRates()
      .then(s => setShippingRates(s))
      .catch(console.error);
  }, []);

  const t = {
    title: locale === 'ar' ? 'إتمام الطلب' : locale === 'en' ? 'Complete Order' : 'Finaliser la commande',
    name: locale === 'ar' ? 'الاسم الكامل' : locale === 'en' ? 'Full Name' : 'Nom complet',
    phone: locale === 'ar' ? 'الهاتف' : locale === 'en' ? 'Phone' : 'Téléphone',
    wilaya: locale === 'ar' ? 'الولاية' : locale === 'en' ? 'Wilaya' : 'Wilaya',
    address: locale === 'ar' ? 'العنوان' : locale === 'en' ? 'Address' : 'Adresse',
    notes: locale === 'ar' ? 'ملاحظات' : locale === 'en' ? 'Notes' : 'Notes',
    confirm: locale === 'ar' ? 'تأكيد الطلب' : locale === 'en' ? 'Confirm Order' : 'Confirmer la commande',
    total: locale === 'ar' ? 'المجموع' : locale === 'en' ? 'Total' : 'Total',
    success: locale === 'ar' ? 'تم إرسال طلبك بنجاح!' : locale === 'en' ? 'Your order has been sent!' : 'Votre commande a été envoyée !',
    successSub: locale === 'ar' ? 'سنتواصل معك قريباً' : locale === 'en' ? 'We will contact you soon' : 'Nous vous contacterons bientôt',
    close: locale === 'ar' ? 'تم' : locale === 'en' ? 'Done' : 'Terminé',
    phoneModel: locale === 'ar' ? 'موديل الهاتف' : locale === 'en' ? 'Phone model' : 'Modèle du téléphone',
    selectAll: locale === 'ar' ? 'يرجى اختيار موديل الهاتف لكل منتج' : locale === 'en' ? 'Please select a phone model for each product' : 'Veuillez sélectionner un modèle pour chaque produit',
    sending: locale === 'ar' ? 'جاري الإرسال...' : locale === 'en' ? 'Sending...' : 'Envoi en cours...',
    shipping: locale === 'ar' ? 'الشحن' : locale === 'en' ? 'Shipping' : 'Livraison',
    orderRef: locale === 'ar' ? 'رقم الطلب' : locale === 'en' ? 'Order ref' : 'Réf. commande',
  };

  const formValid = formName.trim() && formPhone.trim() && formWilaya;
  const canSubmit = formValid && !submitting;

  // Calculate shipping cost
  const selectedRate = shippingRates.find(r => r.wilaya_name === formWilaya);
  const shippingCost = selectedRate?.price_home || 0;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const result = await submitOrder({
        customerName: formName.trim(),
        customerPhone: formPhone.trim(),
        wilaya: formWilaya,
        address: formAddress.trim(),
        notes: formNotes.trim(),
        items: items.map(item => ({
          productId: item.product.id,
          phoneModel: item.phoneModel || '',
          customName: item.customName || '',
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        totalAmount: grandTotal,
        shippingCost,
      });
      setOrderNumber(result.orderNumber);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error('Order submission failed:', err);
      alert(locale === 'en' ? 'Failed to submit order. Please try again.' : 'Échec de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get wilaya list from shipping rates
  const wilayaList = shippingRates.map(r => r.wilaya_name);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white z-[95] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl rounded-xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green" />
              </div>
              <h3 className="font-serif text-2xl font-light text-ink mb-2">{t.success}</h3>
              <p className="font-sans text-sm text-muted">{t.successSub}</p>
              {orderNumber && (
                <p className="font-sans text-xs text-accent mt-3 bg-accent/5 inline-block px-4 py-2 rounded-lg">
                  {t.orderRef}: <span className="font-medium">{orderNumber}</span>
                </p>
              )}
              <button onClick={onClose} className="mt-8 bg-ink text-cream px-8 py-3 font-sans text-xs tracking-widest uppercase rounded-lg block mx-auto">
                {t.close}
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-light text-ink mb-6">{t.title}</h3>

              {/* Items with phone model dropdown */}
              <div className="space-y-4 mb-6 pb-6 border-b border-sand">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-sand relative shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" unoptimized={item.product.image.startsWith('http')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[13px] font-medium text-ink truncate">{item.product.name}</p>
                      {item.phoneModel && (
                        <p className="font-sans text-[11px] text-muted">📱 {item.phoneModel}</p>
                      )}
                      {item.customName && (
                        <p className="font-sans text-[11px] text-muted">✏️ {item.customName}</p>
                      )}
                      <p className="font-serif text-sm text-accent">{item.product.price.toLocaleString()} DA <span className="font-sans text-[11px] text-muted font-normal">×{item.quantity}</span></p>
                    </div>
                    <span className="font-serif text-sm text-ink shrink-0">{(item.product.price * item.quantity).toLocaleString()} DA</span>
                  </div>
                ))}

                {/* Subtotal + Shipping */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-muted">{t.total}</span>
                    <span className="font-serif text-sm text-ink">{totalPrice.toLocaleString()} DA</span>
                  </div>
                  {formWilaya && (
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted">{t.shipping} ({formWilaya})</span>
                      <span className="font-serif text-sm text-ink">{shippingCost.toLocaleString()} DA</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-sand/50 pt-2">
                    <span className="font-sans text-sm font-medium text-ink">{t.total}</span>
                    <span className="font-serif text-xl text-accent">{grandTotal.toLocaleString()} DA</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.name} *</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full h-[42px] bg-cream border border-sand rounded-lg px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.phone} *</label>
                  <input value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full h-[42px] bg-cream border border-sand rounded-lg px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" type="tel" placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.wilaya} *</label>
                  <select
                    value={formWilaya}
                    onChange={e => setFormWilaya(e.target.value)}
                    className="w-full h-[42px] bg-cream border border-sand rounded-lg px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="">-- {t.wilaya} --</option>
                    {wilayaList.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.address}</label>
                  <input value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full h-[42px] bg-cream border border-sand rounded-lg px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.notes}</label>
                  <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} className="w-full bg-cream border border-sand rounded-lg p-3 font-sans text-[13px] text-ink resize-y min-h-[60px] outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              {/* Confirm */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="group relative w-full mt-5 bg-ink text-cream py-4 font-sans text-xs tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-3 overflow-hidden rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-400 group-disabled:hidden" />
                {submitting ? (
                  <span className="relative z-[1] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t.sending}</span>
                ) : (
                  <>
                    <span className="relative z-[1]">{t.confirm}</span>
                    <span className="relative z-[1] arrow-flip">→</span>
                  </>
                )}
              </button>


            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
