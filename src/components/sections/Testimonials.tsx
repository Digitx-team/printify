'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const REVIEWS = [
  {
    stars: 5,
    text: "Ma coque avec mon prénom en calligraphie arabe est absolument magnifique. Tout le monde me la demande !",
    textAr: "الغطاء بالخط العربي رائع! الكل يسألني عنه.",
    author: 'Sara B.', model: 'iPhone 15 Pro, Calligraphie', initial: 'S',
  },
  {
    stars: 5,
    text: "الغطاء جاء أحسن من توقعاتي، الطباعة واضحة والألوان زاهية. راح نطلب مرة ثانية بالتأكيد!",
    textAr: "الغطاء جاء أحسن من توقعاتي، الطباعة واضحة والألوان زاهية.",
    author: 'Nour M.', model: 'Samsung S24, Photo', initial: 'ن', isArabic: true,
  },
  {
    stars: 5,
    text: "Livraison rapide, emballage parfait, et la coque est exactement comme sur les photos. Très satisfaite !",
    textAr: "توصيل سريع وتغليف ممتاز. الغطاء مطابق تماماً للصور.",
    author: 'Amira K.', model: 'Xiaomi 14, Illustration', initial: 'A',
  },
];

export default function Testimonials() {
  const { locale } = useLanguage();

  const eyebrow = locale === 'ar' ? 'آراء العملاء' : locale === 'en' ? 'Customer Reviews' : 'Avis Clients';
  const title = locale === 'ar' ? 'أحببن غطاءهن <em>الفريد</em>' : locale === 'en' ? 'They loved their <em>case</em>' : 'Elles ont adoré leur <em>coque</em>';

  return (
    <section id="testimonials" className="relative px-5 md:px-12 lg:px-20 py-16 md:py-24 overflow-hidden" style={{ background: '#0A0A0B' }}>
      {/* Decorative quote */}
      <span className="absolute -top-5 left-10 md:left-16 font-serif text-[200px] md:text-[280px] leading-none font-light pointer-events-none select-none" style={{ color: 'rgba(201,168,130,0.06)' }}>&ldquo;</span>

      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-6 h-px" style={{ background: '#00D4FF' }} />
        <span className="font-sans text-[10px] font-medium tracking-[0.18em] uppercase" style={{ color: '#00D4FF' }}>{eyebrow}</span>
      </div>
      <h2
        className="font-serif text-[clamp(28px,3.5vw,48px)] font-light leading-[1.15] [&>em]:italic"
        style={{ color: '#F1F2F4' }}
        dangerouslySetInnerHTML={{ __html: title.replace('<em>', '<em style="color:#33DFFF">') }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 mt-10 md:mt-14">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="p-6 md:p-8 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,130,0.1)' }}
          >
            <div className="flex gap-1 mb-4 text-sm">
              {Array.from({ length: review.stars }).map((_, j) => (
                <span key={j} style={{ color: '#FFD54F' }}>★</span>
              ))}
            </div>
            <p className={`font-serif text-[15px] md:text-[17px] font-light italic leading-[1.75] mb-5 ${review.isArabic ? 'font-ar' : ''}`}
               style={{ color: 'rgba(245,240,232,0.85)', direction: review.isArabic ? 'rtl' : 'ltr' }}>
              &ldquo;{locale === 'ar' ? review.textAr : review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${review.isArabic ? 'font-ar' : 'font-serif'} text-base`}
                   style={{ background: '#00D4FF', color: '#0A0A0B' }}>
                {review.initial}
              </div>
              <div>
                <p className="font-sans text-[13px] font-medium" style={{ color: '#F1F2F4' }}>{review.author}</p>
                <p className="font-sans text-[11px] mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>{review.model}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
