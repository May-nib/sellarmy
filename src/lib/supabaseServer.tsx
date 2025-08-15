// src/lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!; // ok for server components; use service key only if necessary and secure

export const supabaseServer = createClient(url, anonKey, {
  // server-side defaults: no localStorage, etc.
});

export default supabaseServer;
