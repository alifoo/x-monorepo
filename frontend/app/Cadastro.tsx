import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { CadastroForm } from '@/components/cadastroComponents/cadastro_form';

export default function CadastroScreen() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCadastro = async (
    nomeCompleto: string,
    idade: string,
    sexoBiologico: string,
    nomeResponsavel: string
  ) => {
    setErrorMessage(null);

    try {
      // Validate
      if (!nomeCompleto.trim() || !idade.trim() || !sexoBiologico) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      console.log('Dados do cadastro:', {
        nomeCompleto,
        idade,
        sexoBiologico,
        nomeResponsavel,
      });

      // Navigate to next step
    } catch (error) {
      setErrorMessage('Não foi possível completar o cadastro. Tente novamente.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <CadastroForm
          onSubmit={handleCadastro}
          errorMessage={errorMessage}
        />
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
});
