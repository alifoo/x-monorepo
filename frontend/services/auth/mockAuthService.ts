import {
  AuthError,
  type AuthService,
  type AuthUser,
  type LoginCredentials,
} from './types';

const MOCK_USER: AuthUser = {
  id: 'mock-healthcare-professional',
  name: 'Dr. Ana Silva',
  email: 'medico@hospital.com',
  roles: ['administrator'],
};

const MOCK_PASSWORD = '123456';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Implementação em memória para desenvolvimento e testes de UI. */
export function createMockAuthService(): AuthService {
  let currentUser: AuthUser | null = null;

  return {
    async signIn({ email, password }: LoginCredentials) {
      await delay(700);

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        throw new AuthError('Informe um e-mail profissional válido.');
      }

      if (password.length < 6) {
        throw new AuthError('A senha deve ter pelo menos 6 caracteres.');
      }

      if (normalizedEmail !== MOCK_USER.email || password !== MOCK_PASSWORD) {
        throw new AuthError('E-mail ou senha incorretos.');
      }

      currentUser = { ...MOCK_USER, email: normalizedEmail };
      return currentUser;
    },

    async signOut() {
      await delay(300);
      currentUser = null;
    },

    async getCurrentUser() {
      await delay(150);
      return currentUser;
    },
  };
}

/** Instância singleton usada por padrão no app. */
export const mockAuthService = createMockAuthService();
