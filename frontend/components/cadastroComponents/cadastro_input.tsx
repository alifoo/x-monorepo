import { TextInput, TextInputProps, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type CadastroInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function CadastroInput({
  lightColor,
  darkColor,
  ...textInputProps
}: CadastroInputProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'inputBackground'
  );
  const borderColor = useThemeColor({}, 'inputBorder');
  const textColor = useThemeColor({}, 'inputText');
  const placeholderTextColor = useThemeColor({}, 'placeholderTextColor');

  return (
    <ThemedView
      lightColor={backgroundColor}
      darkColor={backgroundColor}
      style={[styles.wrapper, { borderColor }]}
    >
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#DDE4EE',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    color: '#0F172A',
  },
});
