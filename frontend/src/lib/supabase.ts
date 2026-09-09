import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (with fallback defaults if env not loaded)
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://dasrkwfegjqhkalawdfu.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Jrd2ZlZ2pxaGthbGF3ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NzM3NDcsImV4cCI6MjEwMzI0OTc0N30.4jyEQVj5PdcuBOz0JWwnLHcIpfga9ft8QO3giBtZs2s';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Service to sync loan applications to Supabase or fallback store
 */
export async function syncApplicationToCloud(application: any) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .upsert(application);
      if (error) {
        console.warn('Supabase sync warning:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      console.warn('Supabase error:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: true, fallback: true };
}

/**
 * Log user searches to Supabase for admin inspection
 */
export async function logSearchToCloud(searchData: any) {
  if (supabase) {
    try {
      await supabase.from('search_logs').insert(searchData);
    } catch (err) {
      console.warn('Failed to log search to Supabase:', err);
    }
  }
}
