import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ResultadoAvaliacao_Header() {
    const backgroundColor = useThemeColor({}, 'background');
    const titleColor = useThemeColor({}, 'text');

    return (
        <ThemedView lightColor={backgroundColor} darkColor={backgroundColor} style={styles.container}>
            <ThemedText
                type="title"
                style={[styles.title, { color: titleColor }]}
            >
                Resultado da Avaliação
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
});