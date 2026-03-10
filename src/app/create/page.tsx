'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronRight, Upload, Smartphone, FileText, Send, X as XIcon, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { BRANDS, PHONE_MODELS, WILAYAS } from '@/lib/constants';
import { submitCustomOrder } from '@/lib/api';

const STEPS = ['model', 'design', 'order'] as const;
type Step = typeof STEPS[number];

export default function CreatePage() {
  const { locale } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<Step>('model');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [isOtherPhone, setIsOtherPhone] = useState(false);
  const [otherPhoneText, setOtherPhoneText] = useState('');
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const MAX_PHOTOS = 3;
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [address, setAddress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredModels = PHONE_MODELS.filter(m => m.brand.id === brand);
  const selectedModelObj = PHONE_MODELS.find(m => m.id === model);
  const selectedBrand = BRANDS.find(b => b.id === brand);
  const stepIndex = STEPS.indexOf(step);

  // Determine the final phone model name for the order
  const finalPhoneModel = isOtherPhone ? otherPhoneText : (selectedModelObj?.name || '');
  const finalBrandSlug = isOtherPhone ? 'other' : (brand || '');
  const canProceedStep1 = isOtherPhone ? otherPhoneText.trim().length > 0 : !!model;

  useEffect(() => {
    return () => { photos.forEach(p => URL.revokeObjectURL(p.preview)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const remaining = MAX_PHOTOS - photos.length;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remaining);
    const newPhotos = imageFiles.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleSubmit = async () => {
    if (!customerName || !customerPhone || !wilaya) return;
    setSubmitting(true);
    try {
      await submitCustomOrder({
        customerName,
        customerPhone,
        wilaya,
        address,
        brandSlug: finalBrandSlug,
        phoneModel: finalPhoneModel,
        description,
        photos: photos.map(p => p.file),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false); setStep('model'); setPhotos([]);
        setBrand(''); setModel(''); setIsOtherPhone(false); setOtherPhoneText('');
        setDescription(''); setCustomerName(''); setCustomerPhone(''); setWilaya(''); setAddress('');
      }, 4000);
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const t = {
    back: locale === 'ar' ? 'رجوع' : locale === 'en' ? 'Back' : 'Retour',
    title: locale === 'ar' ? 'خصّص غطاءك' : locale === 'en' ? 'Customize your case' : 'Personnalisez votre coque',
    stepLabels: locale === 'ar'
      ? ['الموديل', 'التصميم', 'الطلب']
      : locale === 'en'
        ? ['Model', 'Design', 'Order']
        : ['Modèle', 'Design', 'Commande'],
    brandLabel: locale === 'ar' ? 'اختر الماركة' : locale === 'en' ? 'Choose brand' : 'Choisissez la marque',
    modelLabel: locale === 'ar' ? 'اختر الموديل' : locale === 'en' ? 'Choose model' : 'Choisissez le modèle',
    selectBrand: locale === 'ar' ? '-- اختر الماركة --' : locale === 'en' ? '-- Select brand --' : '-- Sélectionner la marque --',
    selectModel: locale === 'ar' ? '-- اختر الموديل --' : locale === 'en' ? '-- Select model --' : '-- Sélectionner le modèle --',
    otherPhone: locale === 'ar' ? 'هاتف آخر' : locale === 'en' ? 'Other phone' : 'Autre téléphone',
    otherPhonePlaceholder: locale === 'ar' ? 'اكتب اسم هاتفك...' : locale === 'en' ? 'Type your phone model...' : 'Tapez le modèle de votre téléphone...',
    descLabel: locale === 'ar' ? 'وصف / نص للإضافة (اختياري)' : locale === 'en' ? 'Description / text to add (optional)' : 'Description / texte à ajouter (optionnel)',
    name: locale === 'ar' ? 'الاسم' : locale === 'en' ? 'Full name' : 'Nom complet',
    phone: locale === 'ar' ? 'الهاتف' : locale === 'en' ? 'Phone' : 'Téléphone',
    wilaya: locale === 'ar' ? 'الولاية' : locale === 'en' ? 'Wilaya' : 'Wilaya',
    address: locale === 'ar' ? 'العنوان' : locale === 'en' ? 'Address' : 'Adresse',
    submit: locale === 'ar' ? 'أرسلي طلبي' : locale === 'en' ? 'Send my order' : 'Envoyer ma commande',
    submitting: locale === 'ar' ? 'جاري الإرسال...' : locale === 'en' ? 'Sending...' : 'Envoi...',
    success: locale === 'ar' ? 'تم إرسال طلبك!' : locale === 'en' ? 'Order sent!' : 'Commande envoyée !',
    successSub: locale === 'ar' ? 'سنتواصل معك قريباً عبر الهاتف' : locale === 'en' ? 'We\'ll contact you soon' : 'Nous vous contacterons bientôt',
    next: locale === 'ar' ? 'التالي' : locale === 'en' ? 'Next' : 'Suivant',
    prev: locale === 'ar' ? 'السابق' : locale === 'en' ? 'Previous' : 'Précédent',
    preview: locale === 'ar' ? 'معاينة' : locale === 'en' ? 'Preview' : 'Aperçu',
  };

  const stepIcons = [Smartphone, Upload, FileText];

  const cardBg = isDark ? '#16171A' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.15)';
  const inputBg = isDark ? '#0A0A0B' : 'rgba(226,228,233,0.3)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(203,213,225,0.4)';
  const pageBg = isDark ? '#0A0A0B' : undefined;
  const accentColor = '#00D4FF';

  // Custom select style
  const selectStyle = (hasValue: boolean) => ({
    background: isDark ? '#111214' : '#FAFBFC',
    border: `2px solid ${hasValue ? accentColor : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.4)')}`,
    color: isDark ? '#F1F2F4' : '#111111',
    boxShadow: hasValue ? `0 0 0 3px ${isDark ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.08)'}` : 'none',
  });

  return (
    <div className="min-h-[100dvh] pt-[70px] pb-10 px-4 md:px-8 bg-cream transition-colors duration-400" style={pageBg ? { background: pageBg } : undefined}>
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-muted hover:text-ink transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <h1 className="font-serif text-[clamp(28px,3.5vw,44px)] font-light text-ink mb-8">{t.title}</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 max-w-md">
          {STEPS.map((s, i) => {
            const Icon = stepIcons[i];
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div key={s} className="flex items-center flex-1">
                <button
                  onClick={() => { if (isDone) setStep(s); }}
                  className={`flex items-center gap-2 transition-all ${isDone ? 'cursor-pointer' : isActive ? '' : 'opacity-40'}`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all"
                    style={{
                      background: isDone ? '#22C55E' : isActive ? (isDark ? '#F1F2F4' : '#111111') : 'transparent',
                      color: isDone ? '#fff' : isActive ? (isDark ? '#0A0A0B' : '#F7F8FA') : undefined,
                      borderColor: isDone ? '#22C55E' : isActive ? (isDark ? '#F1F2F4' : '#111111') : (isDark ? '#2A2C31' : '#CBD5E1'),
                    }}>
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`font-sans text-[11px] tracking-wider uppercase hidden sm:inline ${isActive ? 'font-medium' : ''}`}
                    style={{ color: isActive ? (isDark ? '#F1F2F4' : '#111111') : (isDark ? '#8B8F96' : '#6B7280') }}>
                    {t.stepLabels[i]}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${isDone ? 'bg-green' : 'bg-soft/60'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main content */}
          <div className="rounded-xl p-6 md:p-8 min-h-[400px] transition-all" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(44,31,20,0.06)' }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-ink mb-2">{t.success}</h3>
                  <p className="font-sans text-sm text-muted">{t.successSub}</p>
                </motion.div>
              ) : step === 'model' ? (
                <motion.div key="model" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  {/* Brand dropdown */}
                  <label className="block font-sans text-[11px] tracking-[0.12em] uppercase font-medium mb-3" style={{ color: isDark ? '#A0A4AB' : '#6B7280' }}>
                    📱 {t.brandLabel}
                  </label>
                  <div className="relative mb-6">
                    <select
                      value={brand}
                      onChange={(e) => { setBrand(e.target.value); setModel(''); setIsOtherPhone(false); }}
                      disabled={isOtherPhone}
                      className="w-full h-[52px] rounded-2xl px-5 pr-12 font-sans text-[15px] font-medium outline-none transition-all appearance-none cursor-pointer disabled:opacity-40"
                      style={selectStyle(!!brand && !isOtherPhone)}
                    >
                      <option value="">{t.selectBrand}</option>
                      {BRANDS.filter(b => b.id !== 'all').map(b => (
                        <option key={b.id} value={b.id}>{b.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: isDark ? '#8B8F96' : '#9CA3AF' }} />
                  </div>

                  {/* Model dropdown */}
                  {brand && !isOtherPhone && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                      <label className="block font-sans text-[11px] tracking-[0.12em] uppercase font-medium mb-3" style={{ color: isDark ? '#A0A4AB' : '#6B7280' }}>
                        🔍 {t.modelLabel}
                      </label>
                      <div className="relative">
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full h-[52px] rounded-2xl px-5 pr-12 font-sans text-[15px] font-medium outline-none transition-all appearance-none cursor-pointer"
                          style={selectStyle(!!model)}
                        >
                          <option value="">{t.selectModel}</option>
                          {filteredModels.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name}{m.popular ? ' ★' : ''}{m.subtitle ? ` · ${m.subtitle}` : ''}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: isDark ? '#8B8F96' : '#9CA3AF' }} />
                      </div>
                    </motion.div>
                  )}

                  {/* Other phone checkbox */}
                  <div className="mt-4 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: isOtherPhone ? accentColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(203,213,225,0.6)'),
                          background: isOtherPhone ? accentColor : 'transparent',
                        }}
                        onClick={() => { setIsOtherPhone(!isOtherPhone); setBrand(''); setModel(''); }}
                      >
                        {isOtherPhone && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className="font-sans text-[13px] font-medium transition-colors group-hover:text-accent"
                        style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}
                        onClick={() => { setIsOtherPhone(!isOtherPhone); setBrand(''); setModel(''); }}
                      >
                        {t.otherPhone}
                      </span>
                    </label>
                  </div>

                  {/* Other phone text input */}
                  {isOtherPhone && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                      <input
                        type="text"
                        value={otherPhoneText}
                        onChange={(e) => setOtherPhoneText(e.target.value)}
                        placeholder={t.otherPhonePlaceholder}
                        className="w-full h-[52px] rounded-2xl px-5 font-sans text-[15px] font-medium outline-none transition-all"
                        style={selectStyle(!!otherPhoneText.trim())}
                      />
                    </motion.div>
                  )}

                  {/* Next */}
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => canProceedStep1 && setStep('design')}
                      disabled={!canProceedStep1}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 font-sans text-[11px] tracking-[0.1em] uppercase font-medium rounded-sm overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: isDark ? '#F1F2F4' : '#111111', color: isDark ? '#0A0A0B' : '#F7F8FA' }}
                    >
                      <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300 group-disabled:hidden" />
                      <span className="relative z-[1]">{t.next}</span>
                      <ChevronRight className="w-3.5 h-3.5 relative z-[1]" />
                    </button>
                  </div>
                </motion.div>
              ) : step === 'design' ? (
                <motion.div key="design" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block font-sans text-[10px] tracking-[0.12em] uppercase font-medium mb-2" style={{ color: isDark ? '#A0A4AB' : '#4B5563' }}>
                      {locale === 'ar' ? 'ارفع تصميمك' : locale === 'en' ? 'Upload your design' : 'Uploadez votre design'}
                    </label>
                    <span className="font-sans text-[10px]" style={{ color: isDark ? '#8B8F96' : '#6B7280' }}>{photos.length} / {MAX_PHOTOS}</span>
                  </div>

                  {/* Photo grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group" style={{ border: `1px solid ${isDark ? 'rgba(92,122,94,0.3)' : 'rgba(92,122,94,0.3)'}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.preview} alt={`Design ${i + 1}`} className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(i)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                          <XIcon className="w-3 h-3" />
                        </button>
                        {i === 0 && <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-accent text-cream text-[8px] font-sans tracking-wider uppercase">Main</span>}
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <label
                        htmlFor="fileInput"
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={onDrop}
                        className="aspect-square rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all hover:border-accent/50"
                        style={{
                          borderColor: isDragOver ? accentColor : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(203,213,225,0.5)'),
                          background: isDragOver ? (isDark ? 'rgba(0,212,255,0.06)' : 'rgba(0,212,255,0.05)') : (isDark ? 'rgba(22,23,26,0.5)' : 'rgba(226,228,233,0.3)'),
                        }}
                      >
                        <Upload className="w-5 h-5 mb-1" style={{ color: isDark ? '#8B8F96' : '#6B7280' }} />
                        <span className="font-sans text-[9px] tracking-wider uppercase" style={{ color: isDark ? '#8B8F96' : '#6B7280' }}>
                          {photos.length === 0 ? (locale === 'ar' ? 'رفع' : locale === 'en' ? 'Upload' : 'Uploader') : `+${MAX_PHOTOS - photos.length}`}
                        </span>
                      </label>
                    )}
                  </div>

                  <input ref={fileInputRef} type="file" id="fileInput" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                  <p className="font-sans text-[10px] mt-3" style={{ color: isDark ? '#8B8F96' : '#6B7280' }}>
                    {locale === 'ar' ? 'حتى 3 صور · JPG · PNG · max 10MB' : locale === 'en' ? 'Up to 3 photos · JPG · PNG · max 10MB' : 'Jusqu\'à 3 photos · JPG · PNG · max 10 Mo'}
                  </p>

                  {/* Description */}
                  <div className="mt-6">
                    <label className="block font-sans text-[10px] tracking-[0.12em] uppercase font-medium mb-2" style={{ color: isDark ? '#A0A4AB' : '#4B5563' }}>{t.descLabel}</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-lg p-4 font-sans text-[13px] text-ink placeholder:text-muted/50 resize-y min-h-[80px] outline-none focus:border-accent transition-colors leading-relaxed"
                      style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                      placeholder={locale === 'ar' ? 'مثلاً: اسم بالخط العربي...' : 'ex: prénom en calligraphie arabe, style minimaliste...'}
                    />
                  </div>

                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep('model')} className="font-sans text-xs tracking-wider uppercase text-muted hover:text-ink transition-colors flex items-center gap-1">← {t.prev}</button>
                    <button onClick={() => setStep('order')} className="group relative inline-flex items-center gap-2 px-6 py-3 font-sans text-[11px] tracking-[0.1em] uppercase font-medium rounded-sm overflow-hidden" style={{ background: isDark ? '#F1F2F4' : '#111111', color: isDark ? '#0A0A0B' : '#F7F8FA' }}>
                      <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      <span className="relative z-[1]">{t.next}</span>
                      <ChevronRight className="w-3.5 h-3.5 relative z-[1]" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="order" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-[10px] tracking-[0.12em] uppercase font-medium mb-1.5" style={{ color: isDark ? '#A0A4AB' : '#4B5563' }}>{t.name}</label>
                        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full h-[44px] rounded-lg px-4 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" style={{ background: inputBg, border: `1px solid ${inputBorder}` }} />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[0.12em] uppercase font-medium mb-1.5" style={{ color: isDark ? '#A0A4AB' : '#4B5563' }}>{t.phone}</label>
                        <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full h-[44px] rounded-lg px-4 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" style={{ background: inputBg, border: `1px solid ${inputBorder}` }} type="tel" placeholder="06 XX XX XX XX" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-[10px] tracking-[0.12em] uppercase text-muted mb-1.5">{t.wilaya}</label>
                        <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="w-full h-[44px] rounded-lg px-4 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors appearance-none" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
                          <option value="">-- {t.wilaya} --</option>
                          {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[0.12em] uppercase text-muted mb-1.5">{t.address}</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-[44px] rounded-lg px-4 font-sans text-[13px] text-ink outline-none focus:border-accent transition-colors" style={{ background: inputBg, border: `1px solid ${inputBorder}` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep('design')} className="font-sans text-xs tracking-wider uppercase text-muted hover:text-ink transition-colors flex items-center gap-1">← {t.prev}</button>
                    <button
                      onClick={handleSubmit}
                      disabled={!customerName || !customerPhone || !wilaya || submitting}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 font-sans text-[11px] tracking-[0.1em] uppercase font-medium rounded-sm overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: isDark ? '#F1F2F4' : '#111111', color: isDark ? '#0A0A0B' : '#F7F8FA' }}
                    >
                      <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300 group-disabled:hidden" />
                      <Send className="w-3.5 h-3.5 relative z-[1]" />
                      <span className="relative z-[1]">{submitting ? t.submitting : t.submit}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar — Live preview */}
          <div className="hidden lg:block">
            <div className="sticky top-[110px] rounded-xl p-6 transition-all" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(44,31,20,0.06)' }}>
              <p className="font-sans text-[10px] tracking-[0.12em] uppercase mb-4 text-center" style={{ color: isDark ? '#8B8F96' : '#6B7280' }}>{t.preview}</p>
              <div className="relative w-[140px] h-[280px] mx-auto">
                <div className="absolute inset-0 rounded-[24px] bg-[#111111] shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                  <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[35%] h-[4%] bg-[#111111] rounded-full z-10" />
                </div>
                <div className="absolute inset-[4%] rounded-[20px] overflow-hidden bg-sand">
                  {photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photos[0].preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted">
                      <Upload className="w-6 h-6" />
                      <span className="font-sans text-[9px] tracking-wider uppercase">{t.preview}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Selected model display */}
              {(finalPhoneModel || selectedBrand) && (
                <div className="mt-4 text-center">
                  <p className="font-sans text-[11px] text-ink font-medium">{finalPhoneModel}</p>
                  {selectedBrand && !isOtherPhone && (
                    <p className="font-sans text-[10px] text-muted">{selectedBrand.label}</p>
                  )}
                  {isOtherPhone && otherPhoneText && (
                    <p className="font-sans text-[10px] text-accent">Other phone</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
