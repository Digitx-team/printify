'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

import { LOCALES } from '@/lib/i18n';
import CartDrawer from '@/components/ui/CartDrawer';

const NAV_ITEMS = [
  { href: '#products', fr: 'Boutique', en: 'Shop', ar: 'المتجر' },
  { href: '/create', fr: 'Personnaliser', en: 'Customize', ar: 'خصّصي', isLink: true },
  { href: '#testimonials', fr: 'Avis', en: 'Reviews', ar: 'آراء' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const { totalItems, setIsOpen: setCartOpen } = useCart();


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const h = () => setLangOpen(false);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [langOpen]);

  const label = (item: typeof NAV_ITEMS[0]) =>
    locale === 'ar' ? item.ar : locale === 'en' ? item.en : item.fr;

  const ctaLabel = locale === 'ar' ? 'أنشئ غطائي' : locale === 'en' ? 'Create Case' : 'Créer ma coque';
  const currentLang = locale === 'ar' ? 'ع' : locale.toUpperCase();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
          scrolled
            ? 'py-2 shadow-[0_1px_20px_rgba(0,0,0,0.2)] border-b border-white/10'
            : 'py-3.5'
        }`}
        style={{ background: '#000000' }}
      >
        <div className="flex items-center justify-between px-5 md:px-10 lg:px-14 max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <Image
              src="/mainLogo.png"
              alt="Printify"
              width={120}
              height={40}
              className="h-8 md:h-9 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Center — Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV_ITEMS.map((item) => {
              const inner = (
                <span className="relative font-sans text-[12px] font-medium tracking-[0.14em] uppercase text-white/70 hover:text-white transition-colors duration-200 py-1">
                  {label(item)}
                  <span className="absolute left-0 -bottom-0.5 w-full h-px bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              );
              return (
                <li key={item.href} className="group">
                  {item.isLink ? (
                    <Link href={item.href} className="inline-block">{inner}</Link>
                  ) : (
                    <a href={item.href}>{inner}</a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right — actions */}
          <div className="flex items-center gap-1.5">

            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Language"
              >
                <Globe className="w-[16px] h-[16px]" />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white backdrop-blur-xl rounded-xl shadow-[0_12px_40px_rgba(44,31,20,0.18)] border border-soft/25 overflow-hidden min-w-[140px] z-50 py-1"
                  >
                    {LOCALES.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setLocale(l.id); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-sans text-[12px] transition-colors ${
                          locale === l.id ? 'text-accent bg-accent/5 font-medium' : 'text-muted hover:text-ink hover:bg-cream/80'
                        }`}
                      >
                        <span className="text-[10px] w-5 text-center font-medium opacity-60">
                          {l.id === 'ar' ? 'ع' : l.id.toUpperCase()}
                        </span>
                        {l.label}
                        {locale === l.id && <span className="ml-auto text-accent text-[10px]">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-4 bg-white/20 mx-1" />

            {/* Cart */}
            <button
              onClick={() => { setCartOpen(true); setMobileOpen(false); }}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ShoppingBag className="w-[16px] h-[16px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-[pulse-glow_2s_ease-in-out_infinite]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA — desktop */}
            <Link
              href="/create"
              className="hidden md:inline-flex items-center gap-1.5 ml-3 font-sans text-[11px] tracking-[0.12em] uppercase font-semibold px-6 py-2.5 bg-white text-black rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
            >
              {ctaLabel}
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all ml-0.5"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-[190] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-cream/95 backdrop-blur-2xl border-l border-soft/20 z-[195] flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-soft/15">
                <Image src="/mainLogo.png" alt="Printify" width={100} height={34} className="h-7 w-auto" />
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-soft/20 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <ul className="flex flex-col px-5 py-3">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {item.isLink ? (
                      <Link href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3.5 font-sans text-[13px] text-muted hover:text-ink transition-colors border-b border-soft/10">
                        {label(item)}
                        <span className="text-[10px] text-soft">→</span>
                      </Link>
                    ) : (
                      <a href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3.5 font-sans text-[13px] text-muted hover:text-ink transition-colors border-b border-soft/10">
                        {label(item)}
                        <span className="text-[10px] text-soft">→</span>
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>

              {/* Controls */}
              <div className="px-5 py-4 space-y-3">
                {/* Language row */}
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-soft/30 overflow-hidden">
                    {LOCALES.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLocale(l.id)}
                        className={`px-3 py-2.5 font-sans text-[11px] font-medium transition-all ${
                          locale === l.id ? 'bg-ink text-cream' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {l.id === 'ar' ? 'ع' : l.id.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto px-5 pb-6">
                <Link
                  href="/create"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-ink text-cream py-3.5 rounded-full font-sans text-[11px] tracking-[0.12em] uppercase font-medium hover:bg-accent transition-colors"
                >
                  {ctaLabel} →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
