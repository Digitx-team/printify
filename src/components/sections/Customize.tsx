'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { BRANDS, PHONE_MODELS, WILAYAS } from '@/lib/constants';

export default function Customize() {
  const { locale } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeBrand, setActiveBrand] = useState('');
  const filteredModels = PHONE_MODELS.filter(m => m.brand.id === activeBrand);

  const t = {
    eyebrow: locale === 'ar' ? 'كيف يعمل' : locale === 'en' ? 'How it works' : 'Comment ça marche',
    title: locale === 'ar' ? 'غطاؤك في <em>3 خطوات</em>' : locale === 'en' ? 'Your case in <em>3 steps</em>' : 'Votre coque en <em>3 étapes</em>',
    steps: [
      { num: '01', icon: '📱',
        title: locale === 'ar' ? 'اختر موديل هاتفك' : locale === 'en' ? 'Choose your model' : 'Choisissez votre modèle',
        desc: locale === 'ar' ? 'آيفون، سامسونج، شاومي... اختر جهازك بدقة.' : locale === 'en' ? 'iPhone, Samsung, Xiaomi… select your exact device.' : 'iPhone, Samsung, Xiaomi, Redmi… sélectionnez votre appareil exact.' },
      { num: '02', icon: '🎨',
        title: locale === 'ar' ? 'ارفع تصميمك' : locale === 'en' ? 'Upload your design' : 'Uploadez votre design',
        desc: locale === 'ar' ? 'صورة، نص، خط عربي, أو صف ما تريد ونبدع لك.' : locale === 'en' ? 'Photo, text, calligraphy, or describe and we create for you.' : 'Photo, texte, calligraphie, ou décrivez et on crée pour vous.' },
      { num: '03', icon: '📦',
        title: locale === 'ar' ? 'نوصل لبابك' : locale === 'en' ? 'We deliver to your door' : 'On livre à votre porte',
        desc: locale === 'ar' ? 'طباعة فاخرة، تغليف أنيق، توصيل خلال 48 ساعة.' : locale === 'en' ? 'Premium print, careful packaging, 48h delivery across Algeria.' : 'Impression premium, emballage soigné, livraison en 48h partout en Algérie.' },
    ],
    panelTitle: locale === 'ar' ? 'خصّص غطاءك' : locale === 'en' ? 'Customize my case' : 'Personnaliser ma coque',
    panelSub: locale === 'ar' ? 'يظهر تصميمك على الغطاء فوراً' : locale === 'en' ? 'Your design appears in real time on the case' : 'Votre design apparaît en temps réel sur la coque',
    upload: locale === 'ar' ? 'انقر أو اسحب' : locale === 'en' ? 'Click or drag' : 'Cliquez ou glissez',
    uploadSub: locale === 'ar' ? 'صورتك هنا' : locale === 'en' ? 'your image here' : 'votre image ici',
    brand: locale === 'ar' ? 'الماركة' : locale === 'en' ? 'Brand' : 'Marque',
    model: locale === 'ar' ? 'الموديل' : locale === 'en' ? 'Model' : 'Modèle',
    name: locale === 'ar' ? 'الاسم' : locale === 'en' ? 'First Name' : 'Prénom',
    phone: locale === 'ar' ? 'الهاتف' : locale === 'en' ? 'Phone' : 'Téléphone',
    desc: locale === 'ar' ? 'وصف / نص للإضافة' : locale === 'en' ? 'Description / Text to add' : 'Description / Texte à ajouter',
    wilaya: locale === 'ar' ? 'الولاية' : locale === 'en' ? 'Wilaya' : 'Wilaya',
    submit: locale === 'ar' ? 'أرسلي طلبي' : locale === 'en' ? 'Send my order' : 'Envoyer ma commande',
    success: locale === 'ar' ? '✓ تم إرسال الطلب!' : locale === 'en' ? '✓ Order sent!' : '✓ Commande envoyée !',
    preview: locale === 'ar' ? 'معاينة' : locale === 'en' ? 'Preview' : 'Aperçu',
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [previewUrl]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="order" className="px-8 md:px-20 py-24 bg-cream">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
        {/* Left — Steps */}
        <div>
          <div className="section-eyebrow mb-3">{t.eyebrow}</div>
          <h2
            className="font-serif text-[clamp(32px,3.5vw,52px)] font-light text-ink leading-[1.15] mt-3 [&>em]:italic [&>em]:text-accent"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />

          <div className="flex flex-col mt-10">
            {t.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-6 py-7 border-b border-sand last:border-b-0"
              >
                <span className="font-serif text-[13px] font-light text-muted pt-0.5 w-7 shrink-0">{step.num}</span>
                <div className="flex-1">
                  <p className="font-sans text-[15px] font-medium text-ink mb-1">{step.title}</p>
                  <p className="font-sans text-[13px] text-muted leading-relaxed">{step.desc}</p>
                </div>
                <div className="w-11 h-11 rounded-[10px] bg-sand flex items-center justify-center text-xl shrink-0">{step.icon}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Order form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 md:p-10 shadow-[0_24px_80px_rgba(44,31,20,0.08)]"
        >
          <h3 className="font-serif text-[22px] font-light text-ink mb-1">{t.panelTitle}</h3>
          <p className="font-sans text-xs text-muted mb-7">{t.panelSub}</p>

          <div className="flex gap-7 items-start">
            {/* Mini phone preview */}
            <div className="relative shrink-0 w-[110px] h-[215px] hidden sm:block">
              <svg className="absolute inset-0 w-full h-full z-[3] drop-shadow-[0_8px_24px_rgba(44,31,20,0.2)]" viewBox="0 0 110 215" fill="none">
                <rect x="1" y="1" width="108" height="213" rx="22" fill="#111111" stroke="#333333" strokeWidth="1"/>
                <rect x="5" y="5" width="100" height="205" rx="18" fill="#1E1F23"/>
                <rect x="38" y="9" width="34" height="10" rx="5" fill="#111111"/>
                <rect x="-1" y="55" width="3" height="16" rx="1.5" fill="#333333"/>
                <rect x="-1" y="78" width="3" height="24" rx="1.5" fill="#333333"/>
                <rect x="108" y="66" width="3" height="34" rx="1.5" fill="#333333"/>
              </svg>
              <div className="absolute top-[7px] left-[7px] right-[7px] bottom-[7px] rounded-[16px] overflow-hidden bg-sand z-[2]">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted">
                    <span className="text-2xl">📸</span>
                    <span className="font-sans text-[10px] tracking-[0.08em] uppercase">{t.preview}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-3">
              {/* Upload */}
              <label htmlFor="fileInput">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={onDrop}
                  className={`border-[1.5px] border-dashed rounded-lg p-6 text-center transition-all mb-3 ${
                    isDragOver ? 'border-accent bg-accent/[0.04]' : 'border-soft bg-cream'
                  }`}
                >
                  <div className="text-2xl mb-2">☁️</div>
                  <p className="font-sans text-xs text-muted">
                    <strong className="text-accent">{t.upload}</strong><br />{t.uploadSub}
                  </p>
                  <p className="font-sans text-[10px] text-muted tracking-wider mt-1">JPG · PNG · PDF · max 10MB</p>
                </div>
              </label>
              <input ref={fileInputRef} type="file" id="fileInput" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              {/* Brand & Model */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.brand}</label>
                  <select
                    className="w-full h-[42px] bg-cream border border-sand rounded px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors appearance-none"
                    onChange={(e) => setActiveBrand(e.target.value)}
                    value={activeBrand}
                  >
                    <option value="">-- {t.brand} --</option>
                    {BRANDS.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.model}</label>
                  <select className="w-full h-[42px] bg-cream border border-sand rounded px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors appearance-none">
                    <option value="">-- {t.model} --</option>
                    {filteredModels.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name, Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.name}</label>
                  <input className="w-full h-[42px] bg-cream border border-sand rounded px-3 font-sans text-[13px] text-ink placeholder:text-muted/50 outline-none focus:border-accent transition-colors" placeholder="Amirah..." />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.phone}</label>
                  <input className="w-full h-[42px] bg-cream border border-sand rounded px-3 font-sans text-[13px] text-ink placeholder:text-muted/50 outline-none focus:border-accent transition-colors" placeholder="06 XX XX XX XX" />
                </div>
              </div>

              {/* Wilaya */}
              <div>
                <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.wilaya}</label>
                <select className="w-full h-[42px] bg-cream border border-sand rounded px-3 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors appearance-none">
                  <option value="">-- {t.wilaya} --</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-sans text-[10px] tracking-[0.1em] uppercase text-muted mb-1.5">{t.desc}</label>
                <textarea
                  className="w-full bg-cream border border-sand rounded p-3 font-sans text-[13px] text-ink placeholder:text-muted/50 resize-y min-h-[70px] outline-none focus:border-accent transition-colors leading-relaxed"
                  placeholder={locale === 'ar' ? 'مثلاً: اسم بالخط العربي...' : 'ex: prénom en calligraphie arabe, style minimaliste...'}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="group relative w-full mt-3 bg-ink text-cream py-4 font-sans text-xs tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-3 overflow-hidden transition-all"
                style={submitted ? { background: '#22C55E' } : {}}
              >
                <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
                <span className="relative z-[1]">{submitted ? t.success : t.submit}</span>
                {!submitted && <span className="relative z-[1]">→</span>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
