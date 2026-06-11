import { TouchableOpacity, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChecklistItemProps = {
  id: string;
  label: string;
  checked: boolean;
  onPress: (id: string) => void;
  disabled?: boolean;
};

export function ChecklistItem({
  id,
  label,
  checked,
  onPress,
  disabled = false,
}: ChecklistItemProps) {
  const borderColor = useThemeColor({}, 'inputBorder');
  const checkboxBackground = useThemeColor({}, 'inputBackground');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const textColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={() => !disabled && onPress(id)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? buttonColor : borderColor,
            backgroundColor: checked ? buttonColor : checkboxBackground,
          },
        ]}
      >
        {checked && (
          <IconSymbol
            name="checkmark.circle.fill"
            size={16}
            color="#FFFFFF"
          />
        )}
      </View>
      <ThemedText style={[styles.label, { color: textColor }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
