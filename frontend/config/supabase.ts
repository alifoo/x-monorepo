import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { getSupabaseConfig } from './env';

type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createAuthStorage(): AuthStorage {
  if (Platform.OS === 'web') {
    return {
      getItem: (key) => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return Promise.resolve(window.localStorage.getItem(key));
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return Promise.resolve();
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return Promise.resolve();
        window.localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }

  // SecureStore is native-only; avoid importing it on web (SSR crashes).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SecureStore = require('expo-secure-store') as typeof import('expo-secure-store');

  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = getSupabaseConfig();
    client = createClient(url, anonKey, {
      auth: {
        storage: createAuthStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}
