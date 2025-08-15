// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env?.NEXT_PUBLIC_SUPABASE_URL as string) ||
  (process.env?.NEXT_PUBLIC_SUPABASE_URL as string) ||
  '';

const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  '';

if (!url || !anonKey) {
  // Helpful runtime warning if envs are missing
  // eslint-disable-next-line no-console
  console.warn('Supabase environment variables are missing. Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabaseClient = createClient(url, anonKey);
export default supabaseClient;
