import {
  AuthError,
  type AuthService,
  type AuthUser,
  type LoginCredentials,
  type RegisterCredentials,
} from './types';

const MOCK_USER: AuthUser = {
  id: 'mock-healthcare-professional',
  name: 'Dr. Ana Silva',
  email: 'medico@hospital.com',
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

    async register({ name, email, password }: RegisterCredentials) {
      await delay(700);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = name.trim();

      if (!normalizedName) {
        throw new AuthError('Informe seu nome.');
      }

      if (!normalizedEmail.includes('@')) {
        throw new AuthError('Informe um e-mail profissional válido.');
      }

      if (password.length < 6) {
        throw new AuthError('A senha deve ter pelo menos 6 caracteres.');
      }

      currentUser = {
        id: 'mock-registered-user',
        name: normalizedName,
        email: normalizedEmail,
      };

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
