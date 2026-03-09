import { createClient } from '@supabase/supabase-js';

// Use an UNTYPED client for admin operations to prevent 
// postgrest-js from auto-expanding relationships via Database types
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    .select('id, order_id, quantity, unit_price, is_custom, custom_description, phone_model, product_id')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('fetchOrderItems error:', itemsError);
  }

  // Merge items into orders
  return orders.map(order => ({
    ...order,
    order_items: (items || []).filter(item => item.order_id === order.id),
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

