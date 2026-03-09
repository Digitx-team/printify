'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function CountUp({ target, decimals = 0, duration = 2, delay = 0 }: { target: number; decimals?: number; duration?: number; delay?: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return <>{decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()}</>;
}

const SHOWCASE_CASES = [
  { src: '/products/case-amirah.png', name: 'Amirah', nameAr: 'أميرة' },
  { src: '/products/case-deer.png', name: 'Gazelle', nameAr: 'منى' },
  { src: '/products/case-shaikha.png', name: 'Shaikha', nameAr: 'شيخة' },
  { src: '/products/case-floral.png', name: 'Floral', nameAr: 'زهرة' },
];

function CaseImage({ src, className, size = 'md', priority = false }: { src: string; className?: string; size?: 'sm' | 'md' | 'lg'; priority?: boolean }) {
  const dims = size === 'lg' ? 'w-[200px] h-[400px]' : size === 'md' ? 'w-[150px] h-[300px]' : 'w-[110px] h-[220px]';
  const radius = size === 'lg' ? 'rounded-[24px]' : size === 'md' ? 'rounded-[18px]' : 'rounded-[14px]';
  const imgSize = size === 'lg' ? '200px' : size === 'md' ? '150px' : '110px';

  return (
    <div className={`${dims} relative shrink-0 ${className || ''}`}>
      <div className={`absolute inset-0 ${radius} overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.15)]`}>
        <Image src={src} alt="Phone case" fill className="object-cover" sizes={imgSize} priority={priority} />
      </div>
    </div>
  );
}

export default function Hero() {
  const { locale } = useLanguage();
  const [activeCase, setActiveCase] = useState(0);

  // Auto-rotate cases every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCase(prev => (prev + 1) % SHOWCASE_CASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    badge: locale === 'ar' ? '✦ أغطية حرفية' : locale === 'en' ? '✦ Artisan Cases' : '✦ Coques Artisanales',
    title: locale === 'ar' ? ['احمل', 'قصتك', 'في كفّك'] : locale === 'en' ? ['Carry your', 'story', 'in your pocket'] : ['Portez votre', 'histoire', 'dans votre poche'],
    subtitle: locale === 'ar'
      ? 'كل غطاء قطعة فنية فريدة، صورة شخصية، خط عربي، رسم مخصص.'
      : locale === 'en'
        ? 'Every case is a unique art piece.'
        : 'Chaque coque est une œuvre unique.',
    desc: locale === 'ar'
      ? 'تُطبع بعناية وتُسلَّم بمحبة، اختر صورتك، خطّك، تصميمك.'
      : locale === 'en'
        ? 'Personal photo, Arabic calligraphy, bespoke illustration. Printed with care, delivered with love across Algeria.'
        : 'Photo personnelle, calligraphie arabe, illustration sur mesure. Imprimée avec soin, livrée avec amour dans toute l\'Algérie.',
    cta: locale === 'ar' ? 'أنشئ غطائي' : locale === 'en' ? 'Create my case' : 'Créer ma coque',
    see: locale === 'ar' ? 'شاهد الأعمال' : locale === 'en' ? 'See creations' : 'Voir les créations',
    stat1: locale === 'ar' ? 'طلب' : locale === 'en' ? 'Orders' : 'Commandes',
    stat2: locale === 'ar' ? 'تقييم' : locale === 'en' ? 'Rating' : 'Note',
    stat3: locale === 'ar' ? 'توصيل' : locale === 'en' ? 'Delivery' : 'Livraison',
  };

  return (
    <section className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 pt-[70px] relative overflow-hidden">
      {/* Grain */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left — Text */}
      <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 py-10 lg:py-16 relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="w-6 h-px bg-accent" />
          <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-accent">{t.badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif text-[clamp(38px,5vw,72px)] font-light leading-[1.08] tracking-[-0.01em] text-ink"
        >
          {t.title[0]}<br />
          <em className="italic text-accent font-normal">{t.title[1]}</em><br />
          {t.title[2]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-[clamp(16px,1.8vw,22px)] italic font-light leading-relaxed text-muted mt-3"
        >
          {t.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-[13px] leading-[1.85] text-muted max-w-[400px] mt-4 mb-8 tracking-[0.01em]"
        >
          {t.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/create" className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[11px] tracking-[0.1em] uppercase font-medium overflow-hidden rounded-sm" style={{ background: '#111111', color: '#F7F8FA' }}>
            <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-[1]">{t.cta}</span>
            <span className="relative z-[1] transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <a href="#products" className="flex items-center gap-2 font-sans text-[11px] tracking-[0.08em] uppercase text-muted hover:text-ink transition-colors">
            <span className="w-8 h-8 rounded-full border border-soft flex items-center justify-center text-[10px] hover:border-ink transition-colors">▶</span>
            {t.see}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-8 mt-12"
        >
          {[
            { num: 1200, suffix: '+', label: t.stat1 },
            { num: 4.9, suffix: '', label: t.stat2, isAccent: true, decimals: 1 },
            { num: 48, suffix: 'h', label: t.stat3 },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className={`font-serif text-3xl md:text-4xl font-light leading-none ${s.isAccent ? 'text-accent' : 'text-ink'}`}>
                <CountUp target={s.num} decimals={s.decimals || 0} duration={2} delay={i * 0.2} />{s.suffix}
              </span>
              <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-muted">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Phone showcase with REAL product photos */}
      <div className="relative z-[2] flex items-center justify-center px-6 py-8 lg:px-10 hidden lg:flex">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex items-center justify-center w-full"
        >
          {/* Deco circle */}
          <div className="absolute w-[420px] h-[420px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            style={{ background: 'radial-gradient(circle at 40% 40%, var(--color-sand) 0%, var(--color-cream) 70%)' }}
          />
          <div className="absolute w-[480px] h-[480px] rounded-full border border-warm/20 top-1/2 left-1/2 z-0"
            style={{ animation: 'spin 45s linear infinite', transform: 'translate(-50%,-50%)' }}
          />

          {/* 3-phone layout with actual case images */}
          <div className="relative z-[5] flex items-end gap-4">
            {/* Left phone (tilted) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden xl:block"
              style={{ transform: 'rotate(-8deg) translateY(-20px)' }}
            >
              <CaseImage src={SHOWCASE_CASES[(activeCase + 3) % 4].src} size="sm" className="opacity-70" />
            </motion.div>

            {/* Center phone (main) */}
            <div className="flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <CaseImage src={SHOWCASE_CASES[activeCase].src} size="lg" priority />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right phone (tilted) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="hidden xl:block"
              style={{ transform: 'rotate(8deg) translateY(-20px)' }}
            >
              <CaseImage src={SHOWCASE_CASES[(activeCase + 1) % 4].src} size="sm" className="opacity-70" />
            </motion.div>
          </div>

          {/* Thumbnail selector — pick active case */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[6]">
            {SHOWCASE_CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveCase(i)}
                className={`w-12 h-[72px] rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-md ${
                  i === activeCase ? 'border-accent -translate-y-1 scale-105' : 'border-transparent hover:border-warm hover:-translate-y-0.5'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image src={c.src} alt={c.name} fill className="object-cover" sizes="48px" />
                </div>
              </button>
            ))}
          </div>

          {/* Floating card */}
          <div className="absolute top-[10%] -left-[5%] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(44,31,20,0.1)] z-10 animate-float min-w-[140px]" style={{ background: '#FFFFFF' }}>
            <p className="font-sans text-[9px] tracking-[0.1em] uppercase mb-1" style={{ color: '#6B7280' }}>
              {locale === 'ar' ? 'آخر طلب' : locale === 'en' ? 'Latest order' : 'Dernière commande'}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sand overflow-hidden relative shrink-0">
                <Image src={SHOWCASE_CASES[activeCase].src} alt="" fill className="object-cover" sizes="32px" />
              </div>
              <div>
                <p className="font-sans text-[11px] font-medium" style={{ color: '#111111' }}>{SHOWCASE_CASES[activeCase].name} ✦</p>
                <p className="font-sans text-[9px]" style={{ color: '#6B7280' }}>iPhone 15 Pro</p>
              </div>
            </div>
          </div>

          {/* Rating card */}
          <div className="absolute bottom-[15%] right-0 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(44,31,20,0.1)] z-10 animate-float-2 text-center" style={{ background: '#FFFFFF' }}>
            <div className="flex gap-0.5 text-xs justify-center" style={{ color: '#FFD54F' }}>★★★★★</div>
            <p className="font-serif text-xl font-light" style={{ color: '#111111' }}>4.9</p>
            <p className="font-sans text-[9px] tracking-[0.08em] uppercase" style={{ color: '#6B7280' }}>
              {locale === 'ar' ? 'رضا' : locale === 'en' ? 'Satisfaction' : 'Satisfaction'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mobile phone showcase */}
      <div className="lg:hidden flex flex-col items-center px-6 pb-10 relative z-[2]">
        <div className="flex items-end gap-3 mb-4">
          <div style={{ transform: 'rotate(-6deg)' }}>
            <CaseImage src={SHOWCASE_CASES[(activeCase + 3) % 4].src} size="sm" className="opacity-60" />
          </div>
          <CaseImage src={SHOWCASE_CASES[activeCase].src} size="md" priority />
          <div style={{ transform: 'rotate(6deg)' }}>
            <CaseImage src={SHOWCASE_CASES[(activeCase + 1) % 4].src} size="sm" className="opacity-60" />
          </div>
        </div>
        <div className="flex gap-2">
          {SHOWCASE_CASES.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveCase(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === activeCase ? 'bg-accent scale-110' : 'bg-soft'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
