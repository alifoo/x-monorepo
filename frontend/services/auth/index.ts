export { createMockAuthService, mockAuthService } from './mockAuthService';
export { createSupabaseAuthService, getSupabaseAuthService } from './supabaseAuthService';
export { AuthError, type AuthService, type AuthUser, type LoginCredentials } from './types';

import { mockAuthService } from './mockAuthService';

/** Serviço padrão injetado no AuthProvider. Troque por `getSupabaseAuthService()` ao integrar. */
export const defaultAuthService = mockAuthService;
