import { ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ChecklistClinicoScreen() {
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});

  // Dados do paciente
  const patientName = 'João Silva';
  const patientAge = 8;

  const SYMPTOM_ITEMS = [
    { id: 'dificuldade_aprendizado', label: 'Dificuldade de aprendizado' },
    { id: 'deficit_atencao', label: 'Déficit de atenção' },
    { id: 'comportamento_agressivo', label: 'Comportamento agressivo' },
    { id: 'hiperatividade', label: 'Hiperatividade' },
    { id: 'evita_contato_visual', label: 'Evita contato visual' },
    { id: 'face_alongada', label: 'Face alongada' },
    { id: 'orelhas_proeminentes', label: 'Orelhas proeminentes' },
    { id: 'hiperflexibilidade', label: 'Hiperflexibilidade articular' },
  ];

  const handleToggleSymptom = (id: string) => {
    setSymptoms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([, value]) => value)
      .map(([key]) => key);

    console.log('Sintomas selecionados:', selectedSymptoms);
    alert(`Avaliação concluída com ${selectedSymptoms.length} sintomas`);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.title}>Lista de Sintomas</ThemedText>
        <ThemedText style={styles.subtitle}>{patientName}, {patientAge} anos</ThemedText>

        {SYMPTOM_ITEMS.map((item) => (
          <ThemedView key={item.id} style={styles.itemContainer}>
            <ThemedText
              style={[
                styles.itemLabel,
                symptoms[item.id] && styles.itemLabelChecked,
              ]}
              onPress={() => handleToggleSymptom(item.id)}
            >
              {symptoms[item.id] ? '✓ ' : '☐ '} {item.label}
            </ThemedText>
          </ThemedView>
        ))}

        <ThemedView
          style={styles.button}
          onTouchEnd={handleSubmit}
        >
          <ThemedText style={styles.buttonText}>Finalizar Avaliação</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLabel: {
    fontSize: 14,
    paddingVertical: 8,
  },
  itemLabelChecked: {
    fontWeight: '600',
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    backgroundColor: '#1A56DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
