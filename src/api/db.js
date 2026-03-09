import { supabase } from '@/lib/supabase';

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const products = {
  list: async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  filter: async (filters = {}) => {
    let query = supabase.from('products').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  get: async (id) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (product) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export const categories = {
  list: async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data;
  },
  filter: async (filters = {}) => {
    let query = supabase.from('categories').select('*');
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

// ─── RENTALS ─────────────────────────────────────────────────────────────────
export const rentals = {
  list: async (limit = 200) => {
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
  filter: async (filters = {}, limit = 50) => {
    let query = supabase.from('rentals').select('*').order('created_at', { ascending: false }).limit(limit);
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  create: async (rental) => {
    const { data, error } = await supabase.from('rentals').insert(rental).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from('rentals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
};