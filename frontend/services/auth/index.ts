export { createMockAuthService, mockAuthService } from './mockAuthService';
export { createSupabaseAuthService, getSupabaseAuthService } from './supabaseAuthService';
export {
  AuthError,
  type AuthService,
  type AuthUser,
  type LoginCredentials,
  type RegisterCredentials,
} from './types';

import { getSupabaseAuthService } from './supabaseAuthService';

export const defaultAuthService = getSupabaseAuthService();
