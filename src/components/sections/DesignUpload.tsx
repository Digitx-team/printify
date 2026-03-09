'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileCheck, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DesignUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Create object URL for uploaded file
  useEffect(() => {
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  }, []);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  }, []);
  const removeFile = useCallback(() => {
    setUploadedFile(null); setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <section id="design" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-accent uppercase tracking-widest">{t('upload_label')}</span>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white mt-3">{t('upload_title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Upload Zone */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
                isDragOver ? 'border-accent bg-accent/10 scale-[1.01]' : 'border-accent/30 bg-accent/[0.03]'
              }`}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-success" />
                  </div>
                  <p className="font-body font-medium text-white mt-4">{uploadedFile.name}</p>
                  <p className="font-body text-white/40 text-sm mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button onClick={removeFile} className="mt-4 flex items-center gap-2 text-white/40 hover:text-white/70 font-body text-sm transition-colors">
                    <X className="w-4 h-4" /> {t('upload_remove')}
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-accent/60 mx-auto" />
                  <h3 className="font-syne font-extrabold text-xl text-white mt-4">{t('upload_drag')}</h3>
                  <p className="font-body text-white/40 text-sm mt-2">{t('upload_formats')}</p>
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 border-t border-white/10" />
                    <span className="font-mono text-xs text-white/30">{t('upload_or')}</span>
                    <div className="flex-1 border-t border-white/10" />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-accent/40 text-accent rounded-full px-6 py-2.5 font-body text-sm hover:bg-accent/10 transition-colors cursor-pointer"
                  >
                    {t('upload_browse')}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
                </>
              )}
            </div>

            <div className="mt-6">
              <button onClick={() => setShowTextarea(!showTextarea)} className="font-body text-white/40 text-sm hover:text-white/60 transition-colors cursor-pointer">
                {showTextarea ? t('upload_hide_desc') : t('upload_describe')}
              </button>
              {showTextarea && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-4">
                  <textarea
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] bg-surface2 border border-white/10 focus:border-accent rounded-2xl p-4 font-body text-sm text-white/80 placeholder:text-white/30 resize-none outline-none transition-colors"
                    placeholder={t('upload_placeholder')}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right — Phone Case Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="font-mono text-xs text-white/30 uppercase tracking-widest mb-6">{t('upload_preview_label')}</span>

            {/* Phone Case Mockup with uploaded image */}
            <div className="relative w-60 sm:w-72 h-[480px] sm:h-[560px]">
              {/* Phone body */}
              <div className="w-full h-full bg-[#111111] rounded-[48px] border-[3px] border-[#2A2C31] shadow-2xl shadow-ink/80 relative overflow-hidden">
                {/* Camera cutout */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 bg-[#0A0A0B] rounded-[22px] z-20 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <div className="w-8 h-8 rounded-full bg-[#1E1F23] border-2 border-[#2A2C31]" />
                    <div className="w-8 h-8 rounded-full bg-[#1E1F23] border-2 border-[#2A2C31]" />
                    <div className="w-8 h-8 rounded-full bg-[#1E1F23] border-2 border-[#2A2C31]" />
                    <div className="w-5 h-5 rounded-full bg-[#1E1F23] border border-[#2A2C31] self-center justify-self-center" />
                  </div>
                </div>

                {/* Case back panel — shows uploaded image or default */}
                <div className="absolute inset-[3px] rounded-[45px] overflow-hidden">
                  {previewUrl ? (
                    <div className="w-full h-full relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Your design preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle case edge overlay */}
                      <div className="absolute inset-0 rounded-[45px] ring-1 ring-inset ring-white/10" />
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #0A0A0B 0%, #111111 30%, #00D4FF 60%, #33DFFF 100%)',
                      }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <p className="font-syne font-extrabold text-white text-sm">{t('upload_your_design')}</p>
                      <p className="font-body text-white/50 text-xs mt-1">{t('upload_here')}</p>
                    </div>
                  )}
                </div>

                {/* Side button */}
                <div className="absolute right-[-5px] top-32 w-[3px] h-10 bg-[#2A2C31] rounded-full" />
                <div className="absolute right-[-5px] top-48 w-[3px] h-16 bg-[#2A2C31] rounded-full" />
                <div className="absolute left-[-5px] top-40 w-[3px] h-10 bg-[#2A2C31] rounded-full" />
              </div>
            </div>

            <p className="font-body text-xs text-white/30 italic text-center mt-4 max-w-xs">
              {t('upload_preview_note')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
