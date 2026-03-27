'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

/* ─── Slide Data ─── */
const SLIDES = [
  {
    image: '/hero/slide-oppo-removebg-preview.png',
    phone: 'Oppo Reno 12',
    design: { en: 'Galaxy', fr: 'Galaxie', ar: 'نجوم' },
  },
  {
    image: '/hero/slide-realme-removebg-preview.png',
    phone: 'Realme GT',
    design: { en: 'Amirahhhhh', fr: 'Princesse Amira', ar: 'أميرة' },
  },
  {
    image: '/hero/slide-poco-removebg-preview.png',
    phone: 'Poco X6 Pro',
    design: { en: 'Gazelle', fr: 'La Gazelle', ar: 'ماي' },
  },
  {
    image: '/hero/slide-redmi-removebg-preview.png',
    phone: 'Redmi Note 13 Pro',
    design: { en: 'Shaikha', fr: 'Shaikha', ar: 'شيخة' },
  },
  {
    image: '/hero/slide-xiaomi-removebg-preview.png',
    phone: 'Xiaomi 14',
    design: { en: 'Floral Rose', fr: 'Rose Florale', ar: 'زهرة' },
  },
  {
    image: '/hero/slide-samsung-removebg-preview.png',
    phone: 'Samsung Galaxy S25 Ultra',
    design: { en: 'Arabic Calligraphy', fr: 'Calligraphie Arabe', ar: 'خط عربي' },
  },
  {
    image: '/hero/slide-iphone-removebg-preview.png',
    phone: 'iPhone 16 Pro Max',
    design: { en: 'Floral Elegance', fr: 'Élégance Florale', ar: 'أناقة زهرية' },
  },
  {
    image: '/hero/slide-pixel-removebg-preview.png',
    phone: 'Google Pixel 9 Pro',
    design: { en: 'Portrait Art', fr: 'Art Portrait', ar: 'فن البورتريه' },
  },
  {
    image: '/hero/slide-galaxy-a-removebg-preview.png',
    phone: 'Samsung Galaxy A55',
    design: { en: 'Geometric Gold', fr: 'Géométrie Dorée', ar: 'هندسي ذهبي' },
  },
];

const AUTOPLAY_MS = 5000;

/* ─── Letter-by-letter (or word-by-word for Arabic) animated text ─── */
const IS_ARABIC = /[\u0600-\u06FF]/;

function TypedText({
  text,
  delay = 0,
  className,
  style,
  isGradient = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  isGradient?: boolean;
}) {
  const isArabic = IS_ARABIC.test(text);
  // Arabic: animate word-by-word to preserve cursive connections
  // Latin: animate letter-by-letter
  const segments = useMemo(
    () => (isArabic ? text.split(' ') : text.split('')),
    [text, isArabic],
  );

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isArabic ? 0.15 : 0.04,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isArabic ? 0.3 : 0.15, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ ...style, display: 'inline-block' }}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={`${seg}-${i}`}
          variants={child}
          style={{ 
            display: 'inline-block', 
            paddingInline: '0.15em', 
            marginInline: '-0.15em',
            paddingBlock: '0.2em',
            marginBlock: '-0.2em'
          }}
          className={isGradient ? 'bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent' : ''}
        >
          {isArabic ? (i < segments.length - 1 ? seg + '\u00A0' : seg) : (seg === ' ' ? '\u00A0' : seg)}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Helper: get segment count for delay calculation
function getSegmentCount(text: string) {
  return IS_ARABIC.test(text) ? text.split(' ').length : text.length;
}

// Helper: get stagger duration for delay calculation
function getStaggerMs(text: string) {
  return IS_ARABIC.test(text) ? 0.15 : 0.04;
}

export default function Hero() {
  const { locale } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  /* auto-play */
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [current]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const slide = SLIDES[current];

  /* ─── Text ─── */
  const t = {
    badge:
      locale === 'ar' ? '✦ أغطية فاخرة' : locale === 'fr' ? '✦ Coques Premium' : '✦ Premium Cases',
    titleL1:
      locale === 'ar' ? 'فخامتك' : locale === 'fr' ? 'Transformez votre' : 'Transform your',
    titleL2:
      locale === 'ar' ? 'تبدأ من هاتفك' : locale === 'fr' ? 'téléphone en art' : 'phone into art',
    subtitle:
      locale === 'ar'
        ? 'أغطية مخصصة تُطبع بحب — لكل الهواتف'
        : locale === 'fr'
          ? 'Coques personnalisées imprimées avec amour — pour tous les téléphones'
          : 'Custom cases printed with love — for every phone',
    cta:
      locale === 'ar' ? 'صمّم غطاءك' : locale === 'fr' ? 'Créer ma coque' : 'Design yours',
    browse:
      locale === 'ar' ? 'تصفح المجموعة' : locale === 'fr' ? 'Voir la collection' : 'Browse collection',
    stat1Label: locale === 'ar' ? 'طلب' : locale === 'fr' ? 'Commandes' : 'Orders',
    stat2Label: locale === 'ar' ? 'تقييم' : locale === 'fr' ? 'Note' : 'Rating',
    stat3Label: locale === 'ar' ? 'توصيل' : locale === 'fr' ? 'Livraison' : 'Delivery',
    forLabel: locale === 'ar' ? 'متوفر لـ' : locale === 'fr' ? 'Disponible pour' : 'Available for',
  };

  // Delay for line 2 based on line 1 segment count (words for Arabic, chars for Latin)
  const line1Delay = 0.5;
  const line2Delay = line1Delay + getSegmentCount(t.titleL1) * getStaggerMs(t.titleL1) + 0.15;

  /* ─── Framer variants ─── */
  const imgVariants = {
    enter: (d: number) => ({
      opacity: 0,
      scale: 1.08,
      x: d > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (d: number) => ({
      opacity: 0,
      scale: 0.95,
      x: d > 0 ? -60 : 60,
    }),
  };

  return (
    <section
      className="relative w-full min-h-[100dvh] flex flex-col lg:flex-row items-center overflow-x-clip"
      style={{ background: 'linear-gradient(145deg, #0a0b0f 0%, #111218 50%, #0d0e13 100%)' }}
    >
      {/* ── ambient glow (no blur filter — uses large gradient for soft look) ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, rgba(0,212,255,0.02) 40%, transparent 70%)',
        }}
      />

      {/* ── subtle grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ═══════ Text Column (FIRST on mobile, left on desktop) ═══════ */}
      <div className="relative z-10 w-full lg:w-[42%] flex flex-col justify-center items-center lg:items-start text-center lg:text-start px-4 md:px-10 lg:px-16 xl:px-24 pt-[100px] lg:pt-0 pb-4 lg:pb-0 order-first overflow-visible">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="h-px w-8 bg-cyan-400/50" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-cyan-400" style={{ fontFamily: 'var(--font-sans)' }}>
            {t.badge}
          </span>
        </motion.div>

        {/* heading — letter by letter */}
        <h1
          className="text-[clamp(36px,5.5vw,72px)] font-light leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-serif)', color: '#f1f2f4' }}
        >
          <TypedText text={t.titleL1} delay={line1Delay} />
          <br />
          <TypedText
            text={t.titleL2}
            delay={line2Delay}
            isGradient
            className="font-normal italic"
          />
          {/* blinking cursor */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: line2Delay + getSegmentCount(t.titleL2) * getStaggerMs(t.titleL2) + 0.2,
            }}
            className="inline-block w-[3px] h-[0.85em] bg-cyan-400 ml-1 align-middle"
          />
        </h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: line2Delay + getSegmentCount(t.titleL2) * getStaggerMs(t.titleL2) + 0.1 }}
          className="mt-5 text-[14px] lg:text-[15px] leading-relaxed max-w-[420px]"
          style={{ fontFamily: 'var(--font-sans)', color: 'rgba(241,242,244,0.55)' }}
        >
          {t.subtitle}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: line2Delay + getSegmentCount(t.titleL2) * getStaggerMs(t.titleL2) + 0.3 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 lg:mt-10"
        >
          <Link
            href="/create"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-[12px] font-semibold tracking-[0.08em] uppercase overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8e0 100%)',
              color: '#0a0b0f',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-[1]">{t.cta}</span>
            <span className="relative z-[1] transition-transform group-hover:translate-x-1 arrow-flip">→</span>
          </Link>

          <Link
            href="/#products"
            className="flex items-center gap-2.5 text-[12px] tracking-[0.06em] uppercase transition-colors"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(241,242,244,0.5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f1f2f4')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(241,242,244,0.5)')}
          >
            <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[10px] transition-all hover:border-cyan-400/50 hover:bg-white/5">
              ▶
            </span>
            {t.browse}
          </Link>
        </motion.div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: line2Delay + getSegmentCount(t.titleL2) * getStaggerMs(t.titleL2) + 0.5 }}
          className="flex gap-6 lg:gap-8 mt-10 lg:mt-14"
        >
          {[
            { value: '1,200+', label: t.stat1Label },
            { value: '4.9', label: t.stat2Label, accent: true },
            { value: '48h', label: t.stat3Label },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span
                className={`text-2xl md:text-3xl font-light leading-none ${s.accent ? 'text-cyan-400' : ''}`}
                style={{ fontFamily: 'var(--font-serif)', color: s.accent ? undefined : '#f1f2f4' }}
              >
                {s.value}
              </span>
              <span
                className="text-[9px] tracking-[0.14em] uppercase"
                style={{ fontFamily: 'var(--font-sans)', color: 'rgba(241,242,244,0.35)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════ MOBILE: Phone Image (below text now) ═══════ */}
      <div className="lg:hidden relative z-10 w-full flex flex-col items-center pb-6 order-last">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`mobile-img-${current}`}
            custom={direction}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="relative w-[260px] h-[390px] sm:w-[300px] sm:h-[450px]"
          >
            <Image
              src={slide.image}
              alt={`${slide.phone} case`}
              fill
              className="object-contain"
              sizes="280px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile phone model label */}
        <motion.div
          key={`m-badge-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center gap-1 mt-3"
        >
          <span
            className="px-4 py-1.5 rounded-full text-[10px] font-medium tracking-[0.05em]"
            style={{
              fontFamily: 'var(--font-sans)',
              color: '#f1f2f4',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {slide.phone}
          </span>
          <span
            className="text-[9px] italic tracking-wider"
            style={{ fontFamily: 'var(--font-serif)', color: 'rgba(0,212,255,0.6)' }}
          >
            {slide.design[locale as 'en' | 'fr' | 'ar'] || slide.design.en}
          </span>
        </motion.div>

        {/* Mobile indicators */}
        <div className="flex items-center gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 7,
                height: 7,
                background: i === current ? '#00d4ff' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════ Right: Phone Showcase (Desktop) ═══════ */}
      <div className="hidden lg:flex relative z-10 w-[58%] min-h-[100dvh] items-center justify-center">
        {/* ambient rings */}
        <div
          className="absolute w-[580px] h-[580px] rounded-full border pointer-events-none"
          style={{
            borderColor: 'rgba(0,212,255,0.06)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-[460px] h-[460px] rounded-full border pointer-events-none"
          style={{
            borderColor: 'rgba(0,212,255,0.04)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6 }}
            className="relative w-[420px] h-[640px] xl:w-[500px] xl:h-[750px]"
          >
            <Image
              src={slide.image}
              alt={`${slide.phone} case`}
              fill
              className="object-contain lg:drop-shadow-[0_24px_80px_rgba(0,212,255,0.15)]"
              sizes="(max-width: 1280px) 420px, 500px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* phone model badge */}
        <motion.div
          key={`badge-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span
            className="text-[10px] tracking-[0.12em] uppercase"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(241,242,244,0.3)' }}
          >
            {t.forLabel}
          </span>
          <span
            className="px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.05em]"
            style={{
              fontFamily: 'var(--font-sans)',
              color: '#f1f2f4',
              background: 'rgba(22,23,26,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {slide.phone}
          </span>
          <span
            className="text-[10px] italic tracking-wider"
            style={{ fontFamily: 'var(--font-serif)', color: 'rgba(0,212,255,0.6)' }}
          >
            {slide.design[locale as 'en' | 'fr' | 'ar'] || slide.design.en}
          </span>
        </motion.div>
      </div>

      {/* ═══════ Desktop Slide Indicators — bottom center ═══════ */}
      <div className="hidden lg:flex absolute bottom-8 inset-x-0 z-20 justify-center items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? '#00d4ff' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* ═══════ Bottom gradient fade ═══════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0b0f, transparent)' }}
      />
    </section>
  );
}

