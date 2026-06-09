import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { ResultadoAvaliacao_Form } from '@/components/resultadoAvaliacao/resultadoAvaliacao_form';
import { ThemedView } from '@/components/themed-view';

export default function ResultadoAvaliacao() {
    return (
        <ThemedView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ResultadoAvaliacao_Form
                    score={0.68}
                    maxScore={1.0}
                    alertMessage="O resultado sugere possível manifestação de características relacionadas à Síndrome de X Frágil."
                    detailItems={[
                        { label: 'Características Fenotípicas', value: 0.45 },
                        { label: 'Comportamento e Cognição', value: 0.50 },
                        { label: 'Características Físicas', value: 0.68 },
                        { label: 'Padrões Espaçotempo', value: 0.42 },
                    ]}
                />
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    keyboard: { flex: 1 },
});