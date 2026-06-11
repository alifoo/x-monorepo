import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChecklistHeader } from '@/components/checklistComponents/checklist_header';
import { ChecklistItem } from '@/components/checklistComponents/checklist_item';
import { ChecklistSection } from '@/components/checklistComponents/checklist_section';
import { ChecklistButton } from '@/components/checklistComponents/checklist_button';
import { ChecklistInfoBox } from '@/components/checklistComponents/checklist_info_box';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChecklistFormProps = {
  patientName: string;
  patientAge?: number;
  onSubmit: (symptoms: Record<string, boolean>) => void | Promise<void>;
  isLoading?: boolean;
};

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

const MALE_SPECIFIC_ITEMS = [
  { id: 'macroorquidismo', label: 'Macroorquidismo - ESPECÍFICO PARA SEXO MASCULINO' },
];

const ADDITIONAL_ITEMS = [
  { id: 'atraso_fala', label: 'Atraso na fala' },
  { id: 'movimentos_estereotipados', label: 'Movimentos estereotipados' },
  { id: 'deficiencia_intelectual', label: 'Deficiência intelectual (DI)' },
];

export function ChecklistForm({
  patientName,
  patientAge,
  onSubmit,
  isLoading = false,
}: ChecklistFormProps) {
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});
  const labelColor = useThemeColor({}, 'label');

  const handleToggleSymptom = (id: string) => {
    setSymptoms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = () => {
    void onSubmit(symptoms);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ChecklistHeader patientName={patientName} patientAge={patientAge} />

      <ThemedView style={styles.formContainer}>
        <ChecklistSection title="Sintomas Clínicos">
          {SYMPTOM_ITEMS.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={symptoms[item.id] || false}
              onPress={handleToggleSymptom}
            />
          ))}
        </ChecklistSection>

        <ChecklistSection
          title="Características de Sexo"
          description="Comportamento e características específicas para cada sexo"
        >
          {MALE_SPECIFIC_ITEMS.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={symptoms[item.id] || false}
              onPress={handleToggleSymptom}
            />
          ))}
        </ChecklistSection>

        <ChecklistSection title="Avaliação Adicional">
          {ADDITIONAL_ITEMS.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={symptoms[item.id] || false}
              onPress={handleToggleSymptom}
            />
          ))}
        </ChecklistSection>

        <ChecklistInfoBox
          type="info"
          title="Observação Importante"
          message="Os dados são coletados unicamente de forma confidencial e protegida após a revisão clínica e histórico do paciente. Todos os dados são armazenados de forma segura."
        />

        <ChecklistButton
          label={isLoading ? 'Finalizando...' : 'Finalizar Avaliação'}
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingHorizontal: 20,
    gap: 20,
  },
  formContainer: {
    gap: 20,
  },
});
