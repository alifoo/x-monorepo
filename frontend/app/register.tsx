import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import { Screen } from '@/components/Screen';
import { AuthHeader } from '@/components/authComponents/auth_header';
import { AuthInfoModal } from '@/components/authComponents/auth_info_modal';
import { AuthScreenLayout } from '@/components/authComponents/auth_screen_layout';
import { RegisterForm } from '@/components/authComponents/registerComponents/register_form';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/services/auth';
import type { UserRole } from '@/services/types/api';
import { inviteUser } from '@/services/users';

export default function RegisterScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  // Creating professionals is admin-only (backend also enforces this with 403).
  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  };

  const handleRegister = async (
    name: string,
    email: string,
    roles: UserRole[],
    password: string,
    confirmPassword: string,
  ) => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Informe o nome do profissional.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Informe um e-mail profissional válido.');
      return;
    }

    if (roles.length === 0) {
      setErrorMessage('Selecione ao menos um tipo de usuário.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteUser({
        name: name.trim(),
        email: email.trim(),
        roles,
        password,
      });
      setSuccessVisible(true);
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <AuthScreenLayout>
        <AuthHeader subtitle="Cadastrar usuário" />
        <RegisterForm
          onSubmit={handleRegister}
          onCancel={goBack}
          isLoading={isSubmitting}
          errorMessage={errorMessage}
        />
      </AuthScreenLayout>

      <AuthInfoModal
        visible={successVisible}
        title="Usuário cadastrado"
        message="O profissional foi cadastrado e já pode entrar com o e-mail e a senha definidos."
        onClose={() => {
          setSuccessVisible(false);
          goBack();
        }}
      />
    </Screen>
  );
}
