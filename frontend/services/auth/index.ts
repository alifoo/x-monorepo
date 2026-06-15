import { getSupabaseAuthService } from './supabaseAuthService';

export { createMockAuthService, mockAuthService } from './mockAuthService';
export { createSupabaseAuthService, getSupabaseAuthService } from './supabaseAuthService';
export {
  AuthError,
  type AuthService,
  type AuthUser,
  type LoginCredentials,
} from './types';

export const defaultAuthService = getSupabaseAuthService();
