import { TouchableOpacity, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type ResultadoAvaliacao_ActionsProps = {
    onDownloadPDF?: () => void | Promise<void>;
    onBackHome?: () => void;
    onNewEvaluation?: () => void;
    isLoading?: boolean;
};

export function ResultadoAvaliacao_Actions({
    onDownloadPDF,
    onBackHome,
    onNewEvaluation,
    isLoading = false,
}: ResultadoAvaliacao_ActionsProps) {
    const buttonColor = useThemeColor({}, 'buttonColor');
    const labelColor = useThemeColor({}, 'label');
    const backgroundColor = useThemeColor(
        { light: '#FFFFFF', dark: '#1F2426' },
        'background'
    );
    const greenColor = '#10B981';

    return (
        <ThemedView style={styles.container}>
            {/* Primary Button - Download PDF */}
            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    { backgroundColor: buttonColor },
                    isLoading && styles.buttonDisabled,
                ]}
                onPress={onDownloadPDF}
                disabled={isLoading}
                activeOpacity={0.85}
            >
                <IconSymbol name="arrow.down.circle.fill" size={20} color="#FFFFFF" />
                <ThemedText style={styles.primaryLabel}>Baixar Relatório (PDF)</ThemedText>
            </TouchableOpacity>

            {/* Secondary Buttons Row */}
            <View style={styles.secondaryButtonsRow}>
                {/* Back to Home Button */}
                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        { backgroundColor, borderColor: labelColor },
                    ]}
                    onPress={onBackHome}
                    disabled={isLoading}
                    activeOpacity={0.85}
                >
                    <IconSymbol name="house.fill" size={18} color={labelColor} />
                    <ThemedText style={[styles.secondaryLabel, { color: labelColor }]}>
                        Voltar ao{'\n'}Início
                    </ThemedText>
                </TouchableOpacity>

                {/* New Evaluation Button */}
                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        { backgroundColor, borderColor: greenColor },
                    ]}
                    onPress={onNewEvaluation}
                    disabled={isLoading}
                    activeOpacity={0.85}
                >
                    <IconSymbol name="plus.circle.fill" size={18} color={greenColor} />
                    <ThemedText style={[styles.secondaryLabel, { color: greenColor }]}>
                        Nova{'\n'}Avaliação
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        marginTop: 24,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 56,
        gap: 10,
        shadowColor: '#1A56DB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    primaryLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 100,
        borderWidth: 2,
        gap: 8,
    },
    secondaryLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
