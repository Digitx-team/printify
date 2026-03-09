'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { BRANDS, PHONE_MODELS } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import type { PhoneModel } from '@/types';

function BrandTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-5 py-2 font-body text-sm transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-accent text-ink shadow-lg shadow-accent/25'
          : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function ModelCard({ model, selected, onSelect, popularLabel }: { model: PhoneModel; selected: boolean; onSelect: () => void; popularLabel: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={onSelect}
      className={`bg-surface2 rounded-2xl p-5 border cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-accent ring-1 ring-accent shadow-lg shadow-accent/20'
          : 'border-white/[0.06] hover:border-white/20'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-body font-semibold text-white text-sm">{model.name}</p>
          <p className="font-body text-xs text-white/50 mt-1">{model.subtitle}</p>
        </div>
        {model.popular && (
          <span className="bg-success/20 text-success text-xs font-mono px-2 py-0.5 rounded-full shrink-0">
            {popularLabel}
          </span>
        )}
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
          <CheckCircle className="w-5 h-5 text-accent" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ModelSelector() {
  const [activeBrand, setActiveBrand] = useState('all');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { t } = useLanguage();

  const filtered = PHONE_MODELS.filter((m) => activeBrand === 'all' || m.brand.id === activeBrand);

  return (
    <section id="models" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs text-accent uppercase tracking-widest">{t('model_label')}</span>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white mt-3">{t('model_title')}</h2>
          <p className="font-body text-white/50 text-base mt-4 max-w-lg mx-auto">{t('model_sub')}</p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {BRANDS.map((brand) => (
            <BrandTab
              key={brand.id}
              label={brand.id === 'all' ? t('model_all') : brand.label}
              active={activeBrand === brand.id}
              onClick={() => { setActiveBrand(brand.id); setSelectedModel(null); }}
            />
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                selected={selectedModel === model.id}
                onSelect={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                popularLabel={t('model_popular')}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="font-body text-white/40 text-sm text-center mt-8">
          {t('model_not_found')}{' '}
          <a href="#contact" className="text-accent hover:underline cursor-pointer">{t('model_contact')}</a>
        </p>
      </div>
    </section>
  );
}
