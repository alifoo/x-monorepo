export function getSupabaseConfig() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are required for Supabase auth.',
    );
  }

  return { url, anonKey };
}

export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
}
