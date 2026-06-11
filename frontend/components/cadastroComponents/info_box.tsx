import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type InfoBoxProps = {
  title: string;
  description: string;
};

export function InfoBox({ title, description }: InfoBoxProps) {
  const buttonColor = useThemeColor({}, 'buttonColor');
  const infoBackground = useThemeColor(
    { light: '#F0F7FF', dark: '#1F2426' },
    'background'
  );

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: infoBackground,
          borderLeftColor: buttonColor,
        },
      ]}
    >
      <View style={styles.header}>
        <IconSymbol name="info.circle.fill" size={20} color={buttonColor} />
        <ThemedText style={[styles.title, { color: buttonColor }]}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
