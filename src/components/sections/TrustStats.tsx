'use client';

import { motion } from 'framer-motion';
import { Users, Palette, MapPin, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const STATS = [
  { icon: Palette, valueKey: '500+', labelFr: 'Designs créés', labelAr: 'تصميم تم إنشاؤه', labelEn: 'Designs created' },
  { icon: Users, valueKey: '1,200+', labelFr: 'Clients satisfaits', labelAr: 'عميل راضٍ', labelEn: 'Happy clients' },
  { icon: MapPin, valueKey: '48', labelFr: 'Wilayas livrées', labelAr: 'ولاية تم التوصيل إليها', labelEn: 'Wilayas delivered' },
  { icon: Star, valueKey: '4.9/5', labelFr: 'Note moyenne', labelAr: 'التقييم المتوسط', labelEn: 'Average rating' },
];

export default function TrustStats() {
  const { locale } = useLanguage();

  const getLabel = (stat: typeof STATS[0]) => {
    if (locale === 'ar') return stat.labelAr;
    if (locale === 'en') return stat.labelEn;
    return stat.labelFr;
  };

  return (
    <section className="bg-surface border-y border-white/[0.04] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-syne font-bold text-2xl md:text-3xl text-white">{stat.valueKey}</p>
              <p className="font-body text-sm text-white/50 mt-1">{getLabel(stat)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
