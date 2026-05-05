
const STORAGE_KEY = 'nerd_supabase_credentials';

export interface SupabaseCredentials {
  projectId: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const DEFAULTS: SupabaseCredentials = {
  projectId: '',
  supabaseUrl: '',
  supabaseKey: '',
};

export function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/(?:\/rest\/v1)+$/i, '');
}

export function getProjectRefFromUrl(url: string): string {
  try {
    return new URL(normalizeSupabaseUrl(url)).hostname.split('.')[0] ?? '';
  } catch {
    return '';
  }
}

export function getCredentials(): SupabaseCredentials {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return JSON.parse(raw) as SupabaseCredentials;
  } catch {
    return DEFAULTS;
  }
}

export function saveCredentials(creds: SupabaseCredentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    projectId: creds.projectId.trim(),
    supabaseUrl: normalizeSupabaseUrl(creds.supabaseUrl),
    supabaseKey: creds.supabaseKey.trim(),
  }));
  // Dispatch event so Supabase client can reinitialize
  window.dispatchEvent(new CustomEvent('supabase-credentials-changed'));
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('supabase-credentials-changed'));
}

export function isConnected(): boolean {
  const creds = getCredentials();
  return !!(creds.projectId && creds.supabaseUrl && creds.supabaseKey);
}
