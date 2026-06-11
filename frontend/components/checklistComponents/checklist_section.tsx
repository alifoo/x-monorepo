import { StyleSheet, View, ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChecklistSectionProps = ViewProps & {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ChecklistSection({
  title,
  description,
  children,
  style,
}: ChecklistSectionProps) {
  const titleColor = useThemeColor({}, 'text');
  const descriptionColor = useThemeColor({}, 'label');
  const borderColor = useThemeColor({}, 'inputBorder');

  return (
    <ThemedView
      style={[
        styles.container,
        { borderColor },
        style,
      ]}
    >
      <ThemedText style={[styles.title, { color: titleColor }]}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={[styles.description, { color: descriptionColor }]}>
          {description}
        </ThemedText>
      )}
      <View style={styles.content}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#DDE4EE',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  content: {
    gap: 0,
  },
});
