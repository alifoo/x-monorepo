import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ResultadoAvaliacao_Header() {
    const colorScheme = useColorScheme();
    const backgroundColor = useThemeColor({}, 'background');
    const titleColor = useThemeColor({}, 'text');
    const labelColor = useThemeColor({}, 'label');
    const iconBoxColor = useThemeColor({}, 'iconBoxColor');

    return (
        <ThemedView lightColor={backgroundColor} darkColor={backgroundColor} style={styles.container}>
            <ThemedView
                lightColor={iconBoxColor}
                darkColor={iconBoxColor}
                style={styles.iconBox}
            >
                <IconSymbol
                    name="checkmark.circle.fill"
                    size={28}
                    color={Colors[colorScheme ?? 'light'].buttonColor}
                />
            </ThemedView>
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
        gap: 12,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
});
