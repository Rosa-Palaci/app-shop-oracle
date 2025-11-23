import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Login</Text>
      <Text style={styles.subtitle}>
        Aquí luego pondremos el formulario de inicio de sesión.
      </Text>

      <Button
        title="Volver a bienvenida"
        onPress={() => router.replace("/welcome")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
});
