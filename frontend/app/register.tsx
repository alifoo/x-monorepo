import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { AuthHeader } from '@/components/authComponents/auth_header';
import { RegisterForm } from '@/components/authComponents/registerComponents/register_form';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { AuthError } from '@/services/auth';

export default function CadastroScreen() {
  const { register, isRegistering } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      await register({ name, email, password });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Não foi possível concluir o cadastro. Tente novamente.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AuthHeader />
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isRegistering}
            errorMessage={errorMessage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingHorizontal: 40,
    gap: 20,
  },
});
