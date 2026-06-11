import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CadastroInput } from '@/components/cadastroComponents/cadastro_input';
import { CadastroHeader } from '@/components/cadastroComponents/cadastro_header';
import { BiologicoSelector } from '@/components/cadastroComponents/biologico_selector';
import { CadastroButton } from '@/components/cadastroComponents/cadastro_button';
import { InfoBox } from '@/components/cadastroComponents/info_box';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';

type CadastroFormProps = {
  onSubmit: (
    nomeCompleto: string,
    idade: string,
    sexoBiologico: string,
    nomeResponsavel: string
  ) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function CadastroForm({
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: CadastroFormProps) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [idade, setIdade] = useState('');
  const [sexoBiologico, setSexoBiologico] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const labelColor = useThemeColor({}, 'label');
  const errorColor = useThemeColor({}, 'error');

  const isFormValid = () => {
    return (
      nomeCompleto.trim() !== '' &&
      idade.trim() !== '' &&
      sexoBiologico !== ''
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <CadastroHeader step={1} totalSteps={2} />

      <ThemedView style={formStyles.container}>
        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          NOME COMPLETO
        </ThemedText>
        <CadastroInput
          placeholder="Digite o nome completo"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          autoCapitalize="words"
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          IDADE
        </ThemedText>
        <CadastroInput
          placeholder="Ex: 8"
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          SEXO BIOLÓGICO
        </ThemedText>
        <BiologicoSelector
          value={sexoBiologico}
          onChange={setSexoBiologico}
        />

        <ThemedText style={[formStyles.label, { color: labelColor }]}>
          NOME DO RESPONSÁVEL
        </ThemedText>
        <CadastroInput
          placeholder="Nome do pai, mãe ou tutor"
          value={nomeResponsavel}
          onChangeText={setNomeResponsavel}
          autoCapitalize="words"
        />

        <ThemedView style={styles.infoBox}>
          <InfoBox
            title="Seção Biológica"
            description="O protocolo de triagem baseada-se em critérios físicos e comportamentais para suspeita de TEA."
          />
        </ThemedView>

        {errorMessage ? (
          <ThemedText style={[formStyles.errorText, { color: errorColor }]}>
            {errorMessage}
          </ThemedText>
        ) : null}

        <CadastroButton
          label={isLoading ? 'Salvando...' : 'Ir para Checklist'}
          onPress={() =>
            void onSubmit(nomeCompleto, idade, sexoBiologico, nomeResponsavel)
          }
          disabled={!isFormValid() || isLoading}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingHorizontal: 40,
    gap: 20,
  },
  infoBox: {
    marginVertical: 8,
  },
});
