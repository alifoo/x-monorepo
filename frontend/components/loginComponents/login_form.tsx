import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoginInput } from '@/components/loginComponents/login_input';
import { LoginButton } from '@/components/loginComponents/login_button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  onForgotPassword: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function LoginForm({
  onSubmit,
  onForgotPassword,
  isLoading = false,
  errorMessage = null,
}: LoginFormProps) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordVisible, setPasswordVisible] = useState(false);
const colorScheme = useColorScheme();
const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');
const labelColor = useThemeColor({}, 'label');
const errorColor = useThemeColor({}, 'error');

return (
    <ThemedView style={formStyles.container}>
    <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        E-MAIL PROFISSIONAL
    </ThemedText>
    <LoginInput
        value={email}
        onChangeText={setEmail}
        placeholder="nome@hospital.com"
        placeholderTextColor={placeholderTextColor}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="envelope.fill"
    />

    <ThemedView style={formStyles.passwordLabelRow}>
        <ThemedText style={[formStyles.label, { color: labelColor }]}> 
        SENHA
        </ThemedText>
        <TouchableOpacity onPress={onForgotPassword}>
        <ThemedText
            style={[formStyles.forgotText, { color: Colors[colorScheme ?? 'light'].tint }]}
        >
            Esqueci minha senha
        </ThemedText>
        </TouchableOpacity>
    </ThemedView>

    <LoginInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!passwordVisible}
        iconName="lock.fill"
        rightIconName={passwordVisible ? 'eye.slash.fill' : 'eye.fill'}
        onRightIconPress={() => setPasswordVisible(!passwordVisible)}
    />

    {errorMessage ? (
      <ThemedText style={[formStyles.errorText, { color: errorColor }]}> 
        {errorMessage}
      </ThemedText>
    ) : null}

    <LoginButton
      onPress={() => void onSubmit(email, password)}
      disabled={isLoading}
      label={isLoading ? 'Entrando...' : 'Entrar'}
    />
    </ThemedView>
);
}