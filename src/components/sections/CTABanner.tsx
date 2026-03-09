'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function CTABanner() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] to-ink" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-accent/15 rounded-full blur-[150px] opacity-60" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-syne font-extrabold text-5xl md:text-6xl text-white">{t('cta_title')}</h2>
          <p className="font-body text-white/60 text-lg mt-4">{t('cta_sub')}</p>
          <div className="mt-10">
            <a
              href="#design"
              className="inline-flex items-center justify-center bg-accent h-16 rounded-full px-10 font-body font-medium text-lg text-ink hover:scale-105 transition-transform duration-200 animate-pulse-glow"
            >
              {t('cta_button')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
