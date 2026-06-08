import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

import { getApiBaseUrl } from '@/config/env';
import { getSupabaseClient } from '@/config/supabase';
import { createApiClient } from '@/services/api/client';
import { AuthError, type AuthService, type AuthUser, type LoginCredentials } from './types';

type UserDto = AuthUser;

function mapSupabaseAuthError(error: SupabaseAuthError): AuthError {
  const normalized = error.message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return new AuthError('E-mail ou senha incorretos.');
  }

  if (normalized.includes('email not confirmed')) {
    return new AuthError('Confirme seu e-mail antes de entrar.');
  }

  return new AuthError(error.message);
}

export function createSupabaseAuthService(): AuthService {
  const supabase = getSupabaseClient();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });

  async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
    return api.get<UserDto>('/users/me', accessToken);
  }

  return {
    async signIn({ email, password }: LoginCredentials) {
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw mapSupabaseAuthError(error);
      }

      const accessToken = data.session?.access_token;
      if (!accessToken) {
        throw new AuthError('Não foi possível iniciar a sessão. Tente novamente.');
      }

      try {
        return await fetchCurrentUser(accessToken);
      } catch (error) {
        await supabase.auth.signOut();

        if (error instanceof AuthError) {
          throw error;
        }

        throw new AuthError('Não foi possível carregar seu perfil. Tente novamente.');
      }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new AuthError('Não foi possível sair. Tente novamente.');
      }
    },

    async getCurrentUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw new AuthError('Não foi possível restaurar a sessão.');
      }

      if (!session?.access_token) {
        return null;
      }

      try {
        return await fetchCurrentUser(session.access_token);
      } catch (error) {
        await supabase.auth.signOut();

        if (error instanceof AuthError) {
          return null;
        }

        throw error;
      }
    },
  };
}

let supabaseAuthServiceInstance: AuthService | null = null;

/** Singleton lazy — só inicializa Supabase quando usado pela primeira vez. */
export function getSupabaseAuthService(): AuthService {
  if (!supabaseAuthServiceInstance) {
    supabaseAuthServiceInstance = createSupabaseAuthService();
  }

  return supabaseAuthServiceInstance;
}
