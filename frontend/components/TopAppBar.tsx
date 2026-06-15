import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ProfileMenuSheet } from '@/components/ProfileMenuSheet';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getUserInitials } from '@/utils/user';

export type TopAppBarVariant = 'menu' | 'back';

export type TopAppBarProps = {
  variant?: TopAppBarVariant;
  onBack?: () => void;
};

export function TopAppBar({ variant = 'menu', onBack }: TopAppBarProps) {
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#E2E8F0', dark: '#384047' }, 'cardBorder');
  const accentColor = useThemeColor({}, 'tint');
  const avatarBorderColor = useThemeColor({ light: '#C2C6D4', dark: '#384047' }, 'inputBorder');
  const avatarBackground = useThemeColor({}, 'iconBoxColor');
  const avatarTextColor = useThemeColor({}, 'iconColor');

  const displayName = user?.name?.trim() || 'Profissional';
  const leadingIcon = variant === 'back' ? 'chevron.left' : 'line.3.horizontal';

  const handleLeadingPress = () => {
    if (variant === 'back') {
      if (onBack) {
        onBack();
        return;
      }

      if (router.canGoBack()) {
        router.back();
        return;
      }

      router.replace('/(tabs)');
      return;
    }

    setMenuVisible(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setMenuVisible(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <View style={[styles.bar, { backgroundColor, borderBottomColor: borderColor }]}>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.leadingButton}
            onPress={handleLeadingPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={variant === 'back' ? 'Voltar' : 'Abrir menu'}
          >
            <IconSymbol name={leadingIcon as never} size={22} color={accentColor} />
          </TouchableOpacity>

          <ThemedText style={[styles.greeting, { color: accentColor }]} numberOfLines={1}>
            Olá, {displayName}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[
            styles.avatar,
            {
              borderColor: avatarBorderColor,
              backgroundColor: avatarBackground,
            },
          ]}
          onPress={variant === 'menu' ? () => setMenuVisible(true) : undefined}
          activeOpacity={variant === 'menu' ? 0.7 : 1}
          disabled={variant !== 'menu'}
          accessibilityRole={variant === 'menu' ? 'button' : undefined}
          accessibilityLabel={variant === 'menu' ? 'Abrir menu do perfil' : undefined}
        >
          <ThemedText style={[styles.initials, { color: avatarTextColor }]}>
            {getUserInitials(user?.name)}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {variant === 'menu' ? (
        <ProfileMenuSheet
          visible={menuVisible}
          name={user?.name}
          email={user?.email}
          isLoggingOut={isLoggingOut}
          onClose={() => setMenuVisible(false)}
          onLogout={() => void handleLogout()}
          onCadastrarUsuario={
            isAdmin
              ? () => {
                  setMenuVisible(false);
                  router.push('/register');
                }
              : undefined
          }
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    alignSelf: 'stretch',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  leadingButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
    flexShrink: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 14,
    fontWeight: '700',
  },
});
