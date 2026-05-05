// Supabase client — reads credentials from the Credentials tab (localStorage)
// with a fallback to the build-time env vars. The exported `supabase` proxy
// transparently forwards calls to the currently-active client, so when the
// user saves new credentials we can swap the underlying client without
// requiring a full page reload or imports to change.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getCredentials } from '@/lib/supabase-credentials';

const ENV_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ENV_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
}

function resolveCreds(): { url: string; key: string } {
  try {
    const c = getCredentials();
    if (c.supabaseUrl && c.supabaseKey) {
      return { url: normalizeSupabaseUrl(c.supabaseUrl), key: c.supabaseKey.trim() };
    }
  } catch {
    /* ignore */
  }
  return { url: normalizeSupabaseUrl(ENV_URL ?? ''), key: ENV_KEY?.trim() ?? '' };
}

function build(): SupabaseClient<Database> {
  const { url, key } = resolveCreds();
  return createClient<Database>(url, key, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _client: SupabaseClient<Database> = build();

if (typeof window !== 'undefined') {
  window.addEventListener('supabase-credentials-changed', () => {
    _client = build();
  });
}

// Proxy forwards every property access to the live client instance.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_t, prop) {
    const value = (_client as any)[prop];
    return typeof value === 'function' ? value.bind(_client) : value;
  },
}) as SupabaseClient<Database>;
