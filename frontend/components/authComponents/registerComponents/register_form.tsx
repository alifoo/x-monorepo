import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RegisterInput } from '@/components/authComponents/registerComponents/register_input';
import { RegisterButton } from '@/components/authComponents/registerComponents/register_button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';

type RegisterFormProps = {
  onSubmit: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function RegisterForm({
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');
  const labelColor = useThemeColor({}, 'label');
  const errorColor = useThemeColor({}, 'error');

  return (
    <ThemedView style={formStyles.container}>
      <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        NOME
      </ThemedText>
      <RegisterInput
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="words"
        iconName="person.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        E-MAIL PROFISSIONAL
      </ThemedText>
      <RegisterInput
        value={email}
        onChangeText={setEmail}
        placeholder="nome@hospital.com"
        placeholderTextColor={placeholderTextColor}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="envelope.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        SENHA
      </ThemedText>
      <RegisterInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        CONFIRMAR SENHA
      </ThemedText>
      <RegisterInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Digite a senha novamente"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      {errorMessage ? (
        <ThemedText style={[formStyles.errorText, { color: errorColor }]}>
          {errorMessage}
        </ThemedText>
      ) : null}

      <RegisterButton
        onPress={() => void onSubmit(name, email, password, confirmPassword)}
        disabled={isLoading}
        label={isLoading ? 'Cadastrando...' : 'Cadastrar'}
      />
    </ThemedView>
  );
}
