import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { defaultAuthService } from '@/services/auth';
import type {
  AuthService,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '@/services/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isRegistering: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  authService?: AuthService;
};

export function AuthProvider({ children, authService = defaultAuthService }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    let isMounted = true;

    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authService]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      setIsSigningIn(true);
      try {
        const authenticatedUser = await authService.signIn(credentials);
        setUser(authenticatedUser);
      } finally {
        setIsSigningIn(false);
      }
    },
    [authService],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setIsRegistering(true);
      try {
        const authenticatedUser = await authService.register(credentials);
        setUser(authenticatedUser);
      } finally {
        setIsRegistering(false);
      }
    },
    [authService],
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, [authService]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isSigningIn,
      isRegistering,
      signIn,
      register,
      signOut,
    }),
    [user, isLoading, isSigningIn, isRegistering, signIn, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
