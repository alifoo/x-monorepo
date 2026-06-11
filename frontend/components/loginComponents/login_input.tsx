import { TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type LoginInputProps = TextInputProps & {
iconName: string;
rightIconName?: string;
onRightIconPress?: () => void;
};

export function LoginInput({
iconName,
rightIconName,
onRightIconPress,
...textInputProps
}: LoginInputProps) {
  const backgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'inputText');
  const placeholderTextColor = textInputProps.placeholderTextColor ?? useThemeColor({}, 'placeholderTextColor');

  return (
    <ThemedView
      lightColor={backgroundColor}
      darkColor={backgroundColor}
      style={[styles.wrapper, { borderColor }]}
    >
    <IconSymbol
        name={iconName as any}
        size={16}
        color={iconColor}
        style={styles.leftIcon}
    />
    <TextInput
        style={[styles.input, { color: textColor }]}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
    />
    {rightIconName && onRightIconPress && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
        <IconSymbol name={rightIconName as any} size={16} color={iconColor} />
        </TouchableOpacity>
    )}
    </ThemedView>
);
}

const styles = StyleSheet.create({
wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE4EE',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
},
leftIcon: {
    marginRight: 10,
},
input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    color: '#0F172A',
},
rightIconBtn: {
    paddingLeft: 10,
},
});