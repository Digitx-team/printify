import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans, Cairo, Space_Mono } from 'next/font/google';
import LayoutShell from '@/components/layout/LayoutShell';

import { Providers } from './providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const arabicFont = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ar',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

// ─── SEO Metadata ───
export const metadata: Metadata = {
  metadataBase: new URL('https://casify.dz'),
  title: {
    default: 'PRINTIFY, أغطية هواتف مخصصة | Coques personnalisées en Algérie',
    template: '%s | PRINTIFY',
  },
  description:
    'أنشئ غطاء هاتفك المخصص, صور شخصية، خط عربي، رسم مخصص. طباعة عالية الجودة وتوصيل لكل الولايات في الجزائر. Créez votre coque personnalisée, livraison partout en Algérie.',
  keywords: [
    'printify',
    'coque personnalisée',
    'أغطية هواتف',
    'غطاء هاتف مخصص',
    'phone case algeria',
    'coque algérie',
    'custom phone case',
    'خط عربي',
    'calligraphy case',
    'iPhone case algeria',
    'Samsung case algeria',
    'أغطية آيفون',
    'أغطية سامسونج',
    'هدية مخصصة',
    'توصيل الجزائر',
  ],
  authors: [{ name: 'Printify', url: 'https://casify.dz' }],
  icons: {
    icon: '/LogoFavicon.png',
    shortcut: '/LogoFavicon.png',
    apple: '/LogoFavicon.png',
  },
  creator: 'Printify',
  publisher: 'Printify',
  formatDetection: { telephone: true, email: true },
  alternates: {
    canonical: 'https://casify.dz',
    languages: {
      'ar-DZ': 'https://casify.dz',
      'fr-DZ': 'https://casify.dz',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_DZ',
    alternateLocale: ['fr_DZ'],
    url: 'https://casify.dz',
    siteName: 'Printify',
    title: 'PRINTIFY, أغطية هواتف مخصصة في الجزائر',
    description:
      'أنشئ غطاء هاتفك المخصص بتصميمك الخاص. صور، خط عربي، رسومات. طباعة عالية الجودة وتوصيل لـ 58 ولاية.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Printify, أغطية هواتف مخصصة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRINTIFY, أغطية هواتف مخصصة في الجزائر',
    description: 'أنشئ غطاء هاتفك المخصص, توصيل لكل الولايات',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // other: { 'facebook-domain-verification': 'your-fb-verification' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F8FA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ─── JSON-LD Structured Data ───
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Printify',
  description: 'أغطية هواتف مخصصة في الجزائر — Custom phone cases in Algeria',
  url: 'https://casify.dz',
  logo: 'https://casify.dz/mainLogo.png',
  image: 'https://casify.dz/og-image.png',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'DZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.7538,
    longitude: 3.0588,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Algeria',
  },
  sameAs: [
    'https://instagram.com/printify.dz',
    'https://facebook.com/printify.dz',
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'DZD',
    lowPrice: '1500',
    highPrice: '5000',
    offerCount: '50',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${arabicFont.variable} ${spaceMono.variable}`}
    >
      <head suppressHydrationWarning>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://jgyuewsnjgqrjsnqhctd.supabase.co" />
        <link rel="preconnect" href="https://jgyuewsnjgqrjsnqhctd.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body suppressHydrationWarning>
        {/* JSON-LD Structured Data — placed in body per Next.js recommendation */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
