import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type AlertType = 'warning' | 'danger' | 'info';

type ResultadoAvaliacao_AlertCardProps = {
    title: string;
    description: string;
    type?: AlertType;
};

export function ResultadoAvaliacao_AlertCard({
    title,
    description,
    type = 'info',
}: ResultadoAvaliacao_AlertCardProps) {
    const iconBoxColor = useThemeColor(
        { light: '#FEF3C7', dark: '#332E1B' },
        'background'
    );

    const getAlertColors = () => {
        switch (type) {
            case 'danger':
                return {
                    backgroundColor: { light: '#FEE2E2', dark: '#422020' },
                    borderColor: '#DC2626',
                    iconColor: '#DC2626',
                    textColor: '#DC2626',
                };
            case 'warning':
                return {
                    backgroundColor: { light: '#FEE2E2', dark: '#422020' },
                    borderColor: '#EF4444',
                    iconColor: '#EF4444',
                    textColor: '#EF4444',
                };
            case 'info':
            default:
                return {
                    backgroundColor: { light: '#F0F7FF', dark: '#1F2426' },
                    borderColor: '#005EB8',
                    iconColor: '#005EB8',
                    textColor: '#005EB8',
                };
        }
    };

    const colors = getAlertColors();

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    borderColor: colors.borderColor,
                },
            ]}
            lightColor={colors.backgroundColor.light}
            darkColor={colors.backgroundColor.dark}
        >
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconBox,
                        { backgroundColor: colors.borderColor + '20' },
                    ]}
                >
                    <IconSymbol
                        name={type === 'danger' ? 'exclamationmark.triangle.fill' : 'exclamationmark.circle.fill'}
                        size={20}
                        color={colors.iconColor}
                    />
                </View>
                <ThemedText
                    style={[styles.title, { color: colors.textColor }]}
                >
                    {title}
                </ThemedText>
            </View>
            <ThemedText style={[styles.description, { color: colors.textColor }]}>
                {description}
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 12,
        gap: 8,
        borderLeftWidth: 4,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 52,
    },
});
