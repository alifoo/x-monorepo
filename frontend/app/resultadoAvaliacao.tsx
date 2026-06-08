import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';

import { ResultadoAvaliacao_Form } from '@/components/resultadoAvaliacao/resultadoAvaliacao_form';
import { ThemedView } from '@/components/themed-view';

export default function ResultadoAvaliacao() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadPDF = async () => {
        try {
            setIsLoading(true);
            // Implementação do download de PDF será feita posteriormente no backend
            console.log('Gerando PDF do resultado da avaliação');

            // Aguarda um momento para simular a requisição
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log('PDF baixado com sucesso');
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao baixar PDF:', error);
            setIsLoading(false);
        }
    };

    const handleBackHome = () => {
        // Volta para a tela inicial
        router.replace('/(tabs)');
    };

    const handleNewEvaluation = () => {
        // Vai para uma nova avaliação
        router.push('/checklistClinico');
    };

    return (
        <ThemedView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ResultadoAvaliacao_Form
                    onDownloadPDF={handleDownloadPDF}
                    onBackHome={handleBackHome}
                    onNewEvaluation={handleNewEvaluation}
                    isLoading={isLoading}
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
    screen: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
    },
});
