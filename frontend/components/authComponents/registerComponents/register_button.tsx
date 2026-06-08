import { TouchableOpacity, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type RegisterButtonProps = {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
};

export function RegisterButton({
  onPress,
  label = 'Cadastrar',
  disabled = false,
}: RegisterButtonProps) {
  const tint = useThemeColor({}, 'buttonColor');

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: tint, opacity: disabled ? 0.7 : 1 }]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <IconSymbol name="arrow.right.circle.fill" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 52,
    marginTop: 24,
    gap: 8,
    shadowColor: '#1A56DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
