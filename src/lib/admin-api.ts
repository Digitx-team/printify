import { createClient } from '@supabase/supabase-js';

// Use an UNTYPED client for admin operations to prevent 
// postgrest-js from auto-expanding relationships via Database types
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── IMAGE UPLOAD ─────────────────────────────

export async function uploadProductImage(file: File, productId: string, isPrimary = false): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl;

  // If primary, un-flag all existing primary images first
  if (isPrimary) {
    await supabase
      .from('product_images')
      .update({ is_primary: false } as any)
      .eq('product_id', productId)
      .eq('is_primary', true);
  }

  // Save to product_images table
  const { error: dbError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      is_primary: isPrimary,
    } as any);

  if (dbError) {
    console.error('DB insert error:', dbError);
  }

  // If primary, also update the product's image_url field
  if (isPrimary) {
    await supabase
      .from('products')
      .update({ image_url: imageUrl } as any)
      .eq('id', productId);
  }

  return imageUrl;
}

export async function deleteProductImage(imageUrl: string, productId: string) {
  // Extract file path from URL
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    await supabase.storage.from('product-images').remove([filePath]);
  }

  // Remove from product_images table
  await supabase
    .from('product_images')
    .delete()
    .eq('image_url', imageUrl)
    .eq('product_id', productId);
}

// ─── PRODUCTS ────────────────────────────────

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, category, description, popular, status, stock, sku, image_url, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduct(product: {
  name: string;
  price: number;
  category?: string;
  description?: string;
  popular?: boolean;
  status?: string;
  stock?: number;
  sku?: string;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      category: product.category || 'personalized',
      status: product.status || 'active',
      popular: product.popular || false,
    } as any)
    .select()
    .single();
  if (error) {
    console.error('createProduct error:', error);
    throw error;
  }
  return data;
}

export async function updateProduct(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── ORDERS ──────────────────────────────────

export async function fetchAllOrders() {
  // Fetch orders (no nested joins to avoid stale PostgREST schema cache issues)
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, wilaya, address, notes, status, total_amount, shipping_cost, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('fetchAllOrders error:', ordersError);
    throw ordersError;
  }

  if (!orders || orders.length === 0) return [];

  // Fetch order_items separately
  const orderIds = orders.map(o => o.id);
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, quantity, unit_price, is_custom, custom_description, phone_model, product_id, custom_name')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('fetchOrderItems error:', itemsError);
  }

  // Fetch product details for non-custom items
  const productIds = [...new Set((items || []).filter(i => i.product_id).map(i => i.product_id))];
  let productsMap: Record<string, { name: string; image_url: string | null }> = {};
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, image_url')
      .in('id', productIds);
    if (products) {
      products.forEach((p: any) => { productsMap[p.id] = { name: p.name, image_url: p.image_url }; });
    }
  }

  // Merge items + product info into orders
  return orders.map(order => ({
    ...order,
    order_items: (items || []).filter(item => item.order_id === order.id).map(item => ({
      ...item,
      product_name: item.product_id ? productsMap[item.product_id]?.name || null : null,
      product_image: item.product_id ? productsMap[item.product_id]?.image_url || null : null,
    })),
  }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: status as any })
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Lightweight query for chart — only needs dates and amounts, no joins
export async function fetchOrdersForChart() {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── SHIPPING RATES ─────────────────────────

export async function fetchShippingRates() {
  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .order('wilaya_code');
  if (error) throw error;
  return data || [];
}

export async function updateShippingRate(id: string, updates: { price_home?: number; price_desk?: number }) {
  const { data, error } = await supabase
    .from('shipping_rates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveAllShippingRates(rates: { id: string; price_home: number; price_desk: number }[]) {
  const promises = rates.map(r =>
    supabase
      .from('shipping_rates')
      .update({ price_home: r.price_home, price_desk: r.price_desk })
      .eq('id', r.id)
  );
  await Promise.all(promises);
}

// ─── COUPONS ─────────────────────────────────

export async function fetchCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCoupon(coupon: {
  code: string;
  type: string;
  value: number;
  min_order: number;
  usage_limit: number;
  expires_at: string | null;
}) {
  const { data, error } = await supabase
    .from('coupons')
    .insert(coupon as any)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCoupon(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}

// Brands & phone models are now fetched from Supabase via api.ts

// ─── CUSTOM ORDERS (from /create personalization page) ───

export async function fetchCustomOrders() {
  const { data, error } = await supabase
    .from('custom_orders')
    .select(`
      id, order_number, customer_name, customer_phone, wilaya, address,
      brand_slug, phone_model, description, status, image_urls,
      created_at, updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchCustomOrders error:', error);
    throw error;
  }
  return data || [];
}

export async function updateCustomOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('custom_orders')
    .update({ status, updated_at: new Date().toISOString() } as any)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── DASHBOARD STATS ─────────────────────────

export async function fetchDashboardStats() {
  const [ordersRes, productsRes, customOrdersRes] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at'),
    supabase.from('products').select('id, stock, status'),
    supabase.from('custom_orders').select('id, status, created_at'),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const customOrders = (customOrdersRes.data as any[]) || [];

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalCustomOrders = customOrders.length;
  const newCustomOrders = customOrders.filter((o: any) => o.status === 'new').length;

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    activeProducts,
    totalCustomOrders,
    newCustomOrders,
  };
}

// ─── STORE SETTINGS ──────────────────────────

export async function fetchStoreSettings() {
  const { data, error } = await supabase
    .from('store_settings' as any)
    .select('key, value, updated_at');
  if (error) throw error;
  return (data || []) as any[];
}

export async function getStoreSetting(key: string): Promise<string> {
  const { data, error } = await supabase
    .from('store_settings' as any)
    .select('value')
    .eq('key', key)
    .single();
  if (error) return '';
  return (data as any)?.value || '';
}

export async function updateStoreSetting(key: string, value: string) {
  const { error } = await supabase
    .from('store_settings' as any)
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) throw error;
}

