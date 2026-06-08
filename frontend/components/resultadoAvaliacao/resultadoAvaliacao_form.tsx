import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ResultadoAvaliacao_Header } from '@/components/resultadoAvaliacao/resultadoAvaliacao_header';
import { ResultadoAvaliacao_ScoreCard } from '@/components/resultadoAvaliacao/resultadoAvaliacao_score_card';
import { ResultadoAvaliacao_AlertCard } from '@/components/resultadoAvaliacao/resultadoAvaliacao_alert_card';
import { ResultadoAvaliacao_Details } from '@/components/resultadoAvaliacao/resultadoAvaliacao_details';
import { ResultadoAvaliacao_Actions } from '@/components/resultadoAvaliacao/resultadoAvaliacao_actions';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formStyles } from '@/components/authComponents/formStyles';

type ResultadoAvaliacao_FormProps = {
    onDownloadPDF?: () => void | Promise<void>;
    onBackHome?: () => void;
    onNewEvaluation?: () => void;
    isLoading?: boolean;
    score?: number;
    maxScore?: number;
    alertMessage?: string;
    detailItems?: Array<{
        label: string;
        value: string | number;
    }>;
};

export function ResultadoAvaliacao_Form({
    onDownloadPDF,
    onBackHome,
    onNewEvaluation,
    isLoading = false,
    score = 0.68,
    maxScore = 1.0,
    alertMessage = 'O resultado sugere possível manifestação de características relacionadas à Síndrome de X Frágil.',
    detailItems = [
        { label: 'Características Fenotípicas', value: 0.45 },
        { label: 'Comportamento e Cognição', value: 0.50 },
        { label: 'Características Físicas', value: 0.68 },
        { label: 'Padrões Espaçotempo', value: 0.42 },
    ],
}: ResultadoAvaliacao_FormProps) {
    const labelColor = useThemeColor({}, 'label');

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <ResultadoAvaliacao_Header />

            <ThemedView style={formStyles.container}>
                <ResultadoAvaliacao_ScoreCard
                    score={score}
                    maxScore={maxScore}
                />

                <ResultadoAvaliacao_AlertCard
                    title="SUSPEITA DE X FRÁGIL"
                    description={alertMessage}
                    type="warning"
                />

                <ThemedText style={[formStyles.label, { color: labelColor }]}>
                    RECOMENDAÇÃO CLÍNICA
                </ThemedText>

                <ResultadoAvaliacao_AlertCard
                    title="ENCAMINHAMENTO INDICADO"
                    description="Exame molecular para confirmação diagnóstica. Recomenda-se referência para serviço de genética clínica para avaliação especializada."
                    type="info"
                />

                <ResultadoAvaliacao_Details items={detailItems} />

                <ResultadoAvaliacao_Actions
                    onDownloadPDF={onDownloadPDF}
                    onBackHome={onBackHome}
                    onNewEvaluation={onNewEvaluation}
                    isLoading={isLoading}
                />
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        paddingHorizontal: 24,
    },
});
