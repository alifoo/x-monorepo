export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/** Contrato do serviço de autenticação — troque a implementação via AuthProvider. */
export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<AuthUser>;
  register(credentials: RegisterCredentials): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
