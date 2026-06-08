import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type DetailItem = {
    label: string;
    value: string | number;
};

type ResultadoAvaliacao_DetailsProps = {
    items: DetailItem[];
};

export function ResultadoAvaliacao_Details({
    items,
}: ResultadoAvaliacao_DetailsProps) {
    const colorScheme = useColorScheme();
    const labelColor = useThemeColor({}, 'label');
    const textColor = useThemeColor({}, 'text');
    const buttonColor = useThemeColor({}, 'buttonColor');
    const backgroundColor = useThemeColor(
        { light: '#F8FAFC', dark: '#0F172A' },
        'background'
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={[styles.title, { color: labelColor }]}>
                DETALHES DA AVALIAÇÃO
            </ThemedText>

            <View
                style={[
                    styles.detailsBox,
                    { backgroundColor },
                ]}
            >
                {items.map((item, index) => (
                    <View key={index}>
                        <View style={styles.detailRow}>
                            <ThemedText style={[styles.detailLabel, { color: labelColor }]}>
                                {item.label}
                            </ThemedText>
                            <ThemedText style={[styles.detailValue, { color: buttonColor }]}>
                                {typeof item.value === 'number'
                                    ? item.value.toFixed(2)
                                    : item.value}
                            </ThemedText>
                        </View>
                        {index < items.length - 1 && (
                            <View
                                style={[
                                    styles.divider,
                                    { borderBottomColor: Colors[colorScheme ?? 'light'].inputBorder },
                                ]}
                            />
                        )}
                    </View>
                ))}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
        marginBottom: 24,
    },
    title: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    detailsBox: {
        borderRadius: 10,
        padding: 12,
        gap: 0,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    divider: {
        borderBottomWidth: 1,
    },
});
