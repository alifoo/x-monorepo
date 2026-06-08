import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ResultadoAvaliacao_ScoreCardProps = {
    score: number;
    maxScore?: number;
};

export function ResultadoAvaliacao_ScoreCard({
    score,
    maxScore = 1.0,
}: ResultadoAvaliacao_ScoreCardProps) {
    const colorScheme = useColorScheme();
    const buttonColor = useThemeColor({}, 'buttonColor');
    const backgroundColor = useThemeColor(
        { light: '#F0F7FF', dark: '#1F2426' },
        'background'
    );
    const textColor = useThemeColor({}, 'text');

    const percentage = (score / maxScore) * 100;

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderColor: buttonColor,
                },
            ]}
        >
            <ThemedText style={[styles.label, { color: Colors[colorScheme ?? 'light'].label }]}>
                PONTUAÇÃO GERAL
            </ThemedText>

            <View style={styles.scoreContainer}>
                <ThemedText style={[styles.scoreValue, { color: buttonColor }]}>
                    {score.toFixed(2)}
                </ThemedText>
                <ThemedText style={[styles.scoreMax, { color: Colors[colorScheme ?? 'light'].label }]}>
                    / {maxScore.toFixed(1)}
                </ThemedText>
            </View>

            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: buttonColor,
                        },
                    ]}
                />
            </View>

            <View style={styles.percentageContainer}>
                <ThemedText style={[styles.percentage, { color: textColor }]}>
                    Probabilidade: {Math.round(percentage)}%
                </ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 20,
        gap: 16,
        borderWidth: 2,
        marginBottom: 16,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '700',
    },
    scoreMax: {
        fontSize: 18,
        fontWeight: '600',
    },
    progressContainer: {
        height: 8,
        backgroundColor: 'rgba(0, 94, 184, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentageContainer: {
        alignItems: 'center',
    },
    percentage: {
        fontSize: 14,
        fontWeight: '600',
    },
});
