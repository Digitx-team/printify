'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Smartphone, Upload, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { locale } = useLanguage();

  const t = {
    eyebrow: locale === 'ar' ? 'كيف يعمل' : locale === 'en' ? 'How it works' : 'Comment ça marche',
    title: locale === 'ar' ? 'غطاؤك في 3 خطوات' : locale === 'en' ? 'Your case in 3 steps' : 'Votre coque en 3 étapes',
    titleAccent: locale === 'ar' ? '3 خطوات' : locale === 'en' ? '3 steps' : '3 étapes',
    cta: locale === 'ar' ? 'ابدأ الآن' : locale === 'en' ? 'Start now' : 'Commencer maintenant',
    steps: [
      {
        icon: Smartphone,
        title: locale === 'ar' ? 'اختر موديل هاتفك' : locale === 'en' ? 'Choose your model' : 'Choisissez votre modèle',
        desc: locale === 'ar' ? 'آيفون، سامسونج، شاومي...' : locale === 'en' ? 'iPhone, Samsung, Xiaomi…' : 'iPhone, Samsung, Xiaomi, Redmi…',
      },
      {
        icon: Upload,
        title: locale === 'ar' ? 'ارفع تصميمك' : locale === 'en' ? 'Upload your design' : 'Uploadez votre design',
        desc: locale === 'ar' ? 'صورة، نص، خط عربي' : locale === 'en' ? 'Photo, text, calligraphy' : 'Photo, texte, calligraphie',
      },
      {
        icon: Truck,
        title: locale === 'ar' ? 'نوصل لبابك' : locale === 'en' ? 'We deliver' : 'On livre chez vous',
        desc: locale === 'ar' ? 'توصيل خلال 48 ساعة' : locale === 'en' ? '48h delivery across Algeria' : 'Livraison en 48h dans toute l\'Algérie',
      },
    ],
  };

  return (
    <section className="px-5 md:px-12 lg:px-20 py-16 md:py-24 bg-cream">
      <div className="text-center mb-12">
        <div className="section-eyebrow justify-center mb-2">{t.eyebrow}</div>
        <h2 className="font-serif text-[clamp(28px,3.5vw,48px)] font-light text-ink leading-[1.15]">
          {locale === 'ar' ? t.title : (
            <>Votre coque en <em className="italic text-accent">{t.titleAccent}</em></>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
        {t.steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white border border-soft/40 flex items-center justify-center group-hover:border-accent group-hover:shadow-md transition-all duration-300">
              <step.icon className="w-6 h-6 text-accent" />
            </div>
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-accent mb-2 block">0{i + 1}</span>
            <p className="font-sans text-[14px] font-medium text-ink mb-1">{step.title}</p>
            <p className="font-sans text-[12px] text-muted leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/create"
          className="group relative inline-flex items-center gap-3 bg-ink text-cream px-8 py-3.5 font-sans text-[11px] tracking-[0.1em] uppercase font-medium overflow-hidden rounded-sm"
        >
          <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-[1]">{t.cta}</span>
          <span className="relative z-[1] transition-transform group-hover:translate-x-0.5 arrow-flip">→</span>
        </Link>
      </div>
    </section>
  );
}
