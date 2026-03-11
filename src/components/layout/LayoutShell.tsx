"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { locale } = useLanguage();

  // Dynamically update dir and lang on <html> based on current language
  useEffect(() => {
    const html = document.documentElement;
    if (locale === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', locale === 'en' ? 'en' : 'fr');
    }
  }, [locale]);

  // Admin routes get a completely clean layout — no site navbar/footer
  if (isAdmin) {
    return <>{children}</>;
  }

  // Regular site pages get the full chrome
  return (
    <>
      <FacebookPixel />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
