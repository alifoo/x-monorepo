import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChecklistHeaderProps = {
  patientName: string;
  patientAge?: number;
};

export function ChecklistHeader({ patientName, patientAge }: ChecklistHeaderProps) {
  const titleColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'label');

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.title, { color: titleColor }]}>
        Lista de Sintomas
      </ThemedText>
      <ThemedText style={[styles.description, { color: subtitleColor }]}>
        Avalie o presente ou passado nos sintomas abaixo com base na observação clínica e histórico do paciente.
      </ThemedText>
      
      <ThemedView style={styles.patientInfo}>
        <ThemedView style={styles.patientIconContainer}>
          <ThemedText style={styles.patientIcon}>👤</ThemedText>
        </ThemedView>
        <ThemedView>
          <ThemedText style={[styles.patientName, { color: titleColor }]}>
            {patientName}
          </ThemedText>
          {patientAge && (
            <ThemedText style={[styles.patientAge, { color: subtitleColor }]}>
              {patientAge} anos
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
  },
  patientIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDE4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientIcon: {
    fontSize: 20,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
  },
  patientAge: {
    fontSize: 12,
  },
});
