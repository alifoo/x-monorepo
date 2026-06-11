import { StyleSheet, View, ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

type CadastroSectionProps = ViewProps & {
  title: string;
  children: React.ReactNode;
};

export function CadastroSection({ title, children, style }: CadastroSectionProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.content}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  content: {
    gap: 14,
  },
});
