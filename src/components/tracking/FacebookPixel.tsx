'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStoreSetting } from '@/lib/api';

// ─── Declare global fbq type ───
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: (...args: any[]) => void;
  }
}

// ─── Helper to track custom events ───
export function fbEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

export function fbPageView() {
  fbEvent('PageView');
}

export function fbAddToCart(productName: string, price: number, currency = 'DZD') {
  fbEvent('AddToCart', {
    content_name: productName,
    content_type: 'product',
    value: price,
    currency,
  });
}

export function fbPurchase(orderNumber: string, total: number, currency = 'DZD') {
  fbEvent('Purchase', {
    content_name: orderNumber,
    value: total,
    currency,
  });
}

export function fbViewContent(productName: string, price: number, currency = 'DZD') {
  fbEvent('ViewContent', {
    content_name: productName,
    content_type: 'product',
    value: price,
    currency,
  });
}

export function fbInitiateCheckout(total: number, numItems: number, currency = 'DZD') {
  fbEvent('InitiateCheckout', {
    value: total,
    num_items: numItems,
    currency,
  });
}

// ─── Facebook Pixel Component ───
// Loads the Pixel ID dynamically from Supabase (set via Dashboard → Integrations)
export default function FacebookPixel() {
  const pathname = usePathname();
  const [pixelId, setPixelId] = useState<string | null>(null);

  // Fetch pixel ID from Supabase on mount
  useEffect(() => {
    getStoreSetting('fb_pixel_id')
      .then((id) => {
        if (id && id.trim()) {
          setPixelId(id.trim());
        }
      })
      .catch(console.error);
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pixelId) {
      fbPageView();
    }
  }, [pathname, pixelId]);

  // Don't render anything if no Pixel ID
  if (!pixelId) return null;

  return (
    <>
      <Script
        id="fb-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
