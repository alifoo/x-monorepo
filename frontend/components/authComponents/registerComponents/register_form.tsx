import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AuthDivider } from '@/components/authComponents/auth_divider';
import { AuthOutlineButton } from '@/components/authComponents/auth_outline_button';
import { formStyles } from '@/components/authComponents/formStyles';
import { FormButton } from '@/components/ui/form-button';
import { FormInput } from '@/components/ui/form-input';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { UserRole } from '@/services/types/api';

type RegisterFormProps = {
  onSubmit: (
    name: string,
    email: string,
    roles: UserRole[],
    password: string,
    confirmPassword: string,
  ) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Profissional de saúde', value: 'healthcare_professional' },
  { label: 'Administrador', value: 'administrator' },
];

export function RegisterForm({
  onSubmit,
  onCancel,
  isLoading = false,
  errorMessage = null,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<UserRole[]>(['healthcare_professional']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleRole = (value: UserRole) => {
    setRoles((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value],
    );
  };
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');
  const labelColor = useThemeColor({}, 'label');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'inputBorder');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonColor = useThemeColor({}, 'buttonColor');

  return (
    <View style={formStyles.container}>
      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        NOME
      </ThemedText>
      <FormInput
        value={name}
        onChangeText={setName}
        placeholder="Nome do profissional"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="words"
        iconName="person.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        E-MAIL PROFISSIONAL
      </ThemedText>
      <FormInput
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
        TIPO DE USUÁRIO (selecione um ou mais)
      </ThemedText>
      <View style={styles.rolesRow}>
        {ROLE_OPTIONS.map((option) => {
          const selected = roles.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.roleButton,
                {
                  borderColor: selected ? buttonColor : borderColor,
                  backgroundColor: selected ? buttonColor : inputBackground,
                },
              ]}
              onPress={() => toggleRole(option.value)}
              activeOpacity={0.85}
            >
              <ThemedText
                style={[
                  styles.roleLabel,
                  { color: selected ? '#FFFFFF' : buttonColor },
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        SENHA
      </ThemedText>
      <FormInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mínimo de 6 caracteres"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        iconName="lock.fill"
      />

      <ThemedText style={[formStyles.label, { color: labelColor }]}>
        CONFIRMAR SENHA
      </ThemedText>
      <FormInput
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

      <View style={formStyles.actionsSection}>
        <FormButton
          onPress={() =>
            void onSubmit(name, email, roles, password, confirmPassword)
          }
          disabled={isLoading}
          label={isLoading ? 'Cadastrando...' : 'Cadastrar usuário'}
          grouped
        />
        <AuthDivider />
        <AuthOutlineButton label="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rolesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 14,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
