'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Camera, Smartphone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { locale, setLocale } = useLanguage();

  const t = {
    desc: locale === 'ar' ? 'أغطية هاتف مخصصة حرفية, كل قطعة تحكي قصتك. توصيل في كل الجزائر.'
      : locale === 'en' ? 'Artisan custom phone cases, every piece tells your story. Delivery across Algeria.'
      : 'Coques personnalisées artisanales, chaque pièce raconte votre histoire. Livraison dans toute l\'Algérie.',
    nav: locale === 'ar' ? 'تصفح' : 'Navigation',
    support: locale === 'ar' ? 'الدعم' : 'Support',
    models: locale === 'ar' ? 'الموديلات' : locale === 'en' ? 'Models' : 'Modèles',
    links: {
      shop: locale === 'ar' ? 'المتجر' : locale === 'en' ? 'Shop' : 'Boutique',
      customize: locale === 'ar' ? 'خصّصي' : locale === 'en' ? 'Customize' : 'Personnaliser',
      story: locale === 'ar' ? 'قصتنا' : locale === 'en' ? 'Our Story' : 'Notre Histoire',
      howTo: locale === 'ar' ? 'كيفية الطلب' : locale === 'en' ? 'How to order' : 'Comment commander',
      delivery: locale === 'ar' ? 'التوصيل' : locale === 'en' ? 'Delivery' : 'Livraison',
      whatsapp: locale === 'ar' ? 'واتساب' : 'Contact WhatsApp',
    },
  };

  // Hardcoded colors so dark mode toggling doesn't invert this always-dark section
  const colors = {
    bg: '#000000',
    brand: '#F1F2F4',
    heading: '#00D4FF',
    text: '#8B8F96',
    textHover: '#F1F2F4',
    border: 'rgba(255,255,255,0.08)',
    iconBorder: 'rgba(255,255,255,0.12)',
  };

  return (
    <footer className="px-5 md:px-12 lg:px-20 pt-14 pb-8" style={{ background: colors.bg }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-12 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <Image src="/mainLogo.png" alt="Printify" width={140} height={46} className="h-10 w-auto" />
          </div>
          <p className="font-sans text-[13px] leading-[1.75] max-w-[260px] mb-5" style={{ color: colors.text }}>{t.desc}</p>
          <div className="flex gap-2.5">
            {[
              { icon: Camera, label: 'Instagram' },
              { icon: Smartphone, label: 'Phone' },
              { icon: Mail, label: 'Email' },
            ].map(({ icon: Icon, label }) => (
              <a key={label} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                 style={{ border: `1px solid ${colors.iconBorder}`, color: colors.text }}
                 aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <div>
          <p className="font-sans text-[10px] font-medium tracking-[0.15em] uppercase mb-5" style={{ color: colors.heading }}>{t.nav}</p>
          <div className="flex flex-col gap-2.5">
            <Link href="/#products" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.shop}</Link>
            <Link href="/create" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.customize}</Link>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.story}</a>
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="font-sans text-[10px] font-medium tracking-[0.15em] uppercase mb-5" style={{ color: colors.heading }}>{t.support}</p>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.howTo}</a>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.delivery}</a>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>{t.links.whatsapp}</a>
          </div>
        </div>

        {/* Models */}
        <div>
          <p className="font-sans text-[10px] font-medium tracking-[0.15em] uppercase mb-5" style={{ color: colors.heading }}>{t.models}</p>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>iPhone 13 / 14 / 15 / 16</a>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>Samsung S24 / S25</a>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>Xiaomi / Redmi</a>
            <a href="#" className="font-sans text-[13px] transition-colors hover:opacity-80" style={{ color: colors.text }}>Huawei / Oppo</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1440px] mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: `1px solid ${colors.border}` }}>
        <p className="font-sans text-[11px]" style={{ color: colors.text }}>© 2026 PRINTIFY. Tous droits réservés.</p>
        <div className="flex gap-4">
          <button onClick={() => setLocale('fr')} className="font-sans text-[11px] transition-opacity hover:opacity-70" style={{ color: colors.text }}>Français</button>
          <button onClick={() => setLocale('en')} className="font-sans text-[11px] transition-opacity hover:opacity-70" style={{ color: colors.text }}>English</button>
          <button onClick={() => setLocale('ar')} className="font-sans text-[11px] transition-opacity hover:opacity-70" style={{ color: colors.text }}>العربية</button>
        </div>
      </div>
    </footer>
  );
}
