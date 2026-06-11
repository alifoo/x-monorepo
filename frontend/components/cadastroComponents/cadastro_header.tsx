import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type CadastroHeaderProps = {
  step?: number;
  totalSteps?: number;
};

export function CadastroHeader({ step = 1, totalSteps = 2 }: CadastroHeaderProps) {
  const titleColor = useThemeColor({}, 'text');
  const stepColor = useThemeColor({}, 'label');

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.step, { color: stepColor }]}>
        PASSO {step} DE {totalSteps}
      </ThemedText>
      <ThemedText style={[styles.title, { color: titleColor }]}>
        Informações Pessoais
      </ThemedText>
      <ThemedText style={[styles.description, { color: stepColor }]}>
        Preencha os dados básicos do paciente para iniciar o rastreio da Síndrome de X Frágil.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 40,
    gap: 8,
  },
  step: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
