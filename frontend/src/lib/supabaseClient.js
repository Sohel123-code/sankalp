import { createClient } from '@supabase/supabase-js'

/**
 * Frontend Supabase client.
 * Used for direct DB queries (e.g. events listing) and realtime subscriptions.
 * Auth state is managed via our Express backend (JWT cookies), not Supabase Auth.
 */
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.warn('[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnon)
