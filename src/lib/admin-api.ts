import { supabase } from './supabase';

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
  category: string;
  description: string;
  popular: boolean;
  status: string;
  stock: number;
  sku: string;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert(product as any)
    .select()
    .single();
  if (error) throw error;
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
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, customer_name, customer_phone, wilaya, address, notes,
      status, total_amount, shipping_cost, created_at, updated_at,
      order_items (
        id, quantity, unit_price, is_custom, custom_description, phone_model,
        products ( id, name, price ),
        order_item_images ( id, image_url, sort_order )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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

// Brands & phone models are hardcoded in the frontend constants
// No need to fetch them from the database

// ─── DASHBOARD STATS ─────────────────────────

export async function fetchDashboardStats() {
  const [ordersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at'),
    supabase.from('products').select('id, stock, status'),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    activeProducts,
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

