import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { LoginForm } from "@/components/authComponents/loginComponents/login_form";
import { LoginHeader } from "@/components/authComponents/auth_header";
import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // sua lógica de autenticação aqui
    console.log("Login:", email, password);
    router.replace("/(tabs)");
  };

  const handleForgotPassword = () => {
    console.log("Esqueci minha senha");
  };

  return (
    <ThemedView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <LoginHeader />
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        </ScrollView>
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
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingHorizontal: 40,
    gap: 20,
  },
});
