import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/types';

/**
 * Server-side cached data fetching.
 * Uses Next.js `fetch` with `revalidate` to cache responses.
 * Products: revalidate every 5 minutes
 * Shipping rates: revalidate every 30 minutes
 */

function getServerSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function getServerSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

// ─── Cached Products Fetch (revalidate every 5 min) ───
export async function getCachedProducts(): Promise<Product[]> {
  const url = getServerSupabaseUrl();
  const key = getServerSupabaseKey();
  if (!url || !key) return [];

  try {
    // Use fetch API with Next.js revalidation (server-side cache)
    const res = await fetch(
      `${url}/rest/v1/products?status=eq.active&order=created_at.desc&select=id,name,price,category,description,popular,image_url,product_images(image_url,is_primary)`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!res.ok) {
      // Fallback without join
      const fallback = await fetch(
        `${url}/rest/v1/products?status=eq.active&order=created_at.desc&select=id,name,price,category,description,popular,image_url`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          next: { revalidate: 300 },
        },
      );
      if (!fallback.ok) return [];
      const data = await fallback.json();
      return mapProducts(data, false);
    }

    const data = await res.json();
    return mapProducts(data, true);
  } catch (err) {
    console.error('Error fetching cached products:', err);
    return [];
  }
}

// ─── Cached Shipping Rates Fetch (revalidate every 30 min) ───
export async function getCachedShippingRates() {
  const url = getServerSupabaseUrl();
  const key = getServerSupabaseKey();
  if (!url || !key) return [];

  try {
    const res = await fetch(
      `${url}/rest/v1/shipping_rates?order=wilaya_code&select=*`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      },
    );

    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Error fetching cached shipping rates:', err);
    return [];
  }
}

// ─── Map raw DB rows → Product type ───
function mapProducts(data: any[], useJoin: boolean): Product[] {
  return (data || []).map((p: any) => {
    let imageUrl = '/products/case-amirah.png';

    if (useJoin) {
      const imgs = p.product_images || [];
      const primary = imgs.find((img: any) => img.is_primary);
      imageUrl = primary?.image_url || imgs[0]?.image_url || p.image_url || imageUrl;
    } else {
      imageUrl = p.image_url || imageUrl;
    }

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category as Product['category'],
      description: p.description || '',
      popular: p.popular || false,
      image: imageUrl,
    };
  });
}
