import { supabase } from '../../lib/supabase';

/**
 * Browser Supabase client for this Vite app.
 * Use this helper anywhere UI code needs Auth or Postgres access.
 * Do not create additional clients — one shared instance keeps the session in sync.
 */
export function createClient() {
  return supabase;
}
