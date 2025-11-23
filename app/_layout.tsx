// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Le decimos al router que la primera pantalla sea "welcome"
export const unstable_settings = {
  initialRouteName: "welcome",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantalla de bienvenida */}
        <Stack.Screen name="welcome" options={{ headerShown: false }} />

        {/* Tus tabs actuales (index/explore) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Pantalla de login */}
        <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />

        {/* Modal que ya tenías */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
