import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type BiologicoSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function BiologicoSelector({ value, onChange }: BiologicoSelectorProps) {
  const borderColor = useThemeColor({}, 'inputBorder');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonColor = useThemeColor({}, 'buttonColor');

  const options = [
    { label: 'Masculino', value: 'masculino', icon: 'figure.stand' },
    { label: 'Feminino', value: 'feminino', icon: 'figure' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              {
                borderColor: value === option.value ? buttonColor : borderColor,
                backgroundColor:
                  value === option.value
                    ? buttonColor
                    : inputBackground,
              },
            ]}
            onPress={() => onChange(option.value)}
          >
            <IconSymbol
              name={option.icon as any}
              size={28}
              color={value === option.value ? '#FFFFFF' : buttonColor}
            />
            <ThemedText
              style={[
                styles.optionLabel,
                {
                  color: value === option.value ? '#FFFFFF' : buttonColor,
                },
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
