import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Image, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { Colors } from "../constants/theme";
import { useAuthStore } from "../stores/useAuthStore";

const { height, width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  // Estado del Customer ID
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);

  // Zustand Store
  const hydratedCustomerId = useAuthStore((state) => state.customer_id);
  const saveId = useAuthStore((state) => state.setCustomerId);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  // Si ya hay sesión guardada entrar directo a home
  useEffect(() => {
    if (hasHydrated && hydratedCustomerId) {
      router.replace("/(tabs)");
      return;
    }

    if (!hasHydrated) {
      const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => {
        if (useAuthStore.getState().customer_id) {
          router.replace("/(tabs)");
        }
      });

      return () => unsubscribe?.();
    }
  }, [hasHydrated, hydratedCustomerId]);

  const handleLogin = async () => {
    if (!customerId.trim()) {
      Alert.alert("Error", "Por favor ingresa un Customer ID válido.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id: customerId }),
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);

      // Manejo de errores del backend
      if (!response.ok) {
        Alert.alert(
          "Error",
          data.message || "No se pudo iniciar sesión. Intenta nuevamente."
        );
        return;
      }

      // Cliente no encontrado
      if (!data.success || data.data?.length === 0) {
        Alert.alert("Error", "Customer ID no encontrado.");
        return;
      }

      saveId(customerId);
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light.background,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        {/* BOTÓN DE REGRESO */}
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={Colors.light.tint}
          onPress={() => router.push("/welcome")}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            zIndex: 10,
          }}
        />

        {/* IMAGEN */}
        <Image
          source={require("../assets/images/shopping.png")}
          style={{
            width: width * 0.8,
            height: height * 0.32,
            resizeMode: "contain",
            marginBottom: 20,
          }}
        />

        {/* TITULO */}
        <Text
          style={{
            textAlign: "center",
            marginBottom: 18,
            color: Colors.light.tint,
            fontWeight: "700",
            fontSize: 26,
          }}
        >
          Bienvenida a ShopMate
        </Text>

        {/* INPUT Customer ID */}
        <TextInput
          label="Customer ID"
          placeholder="Ej: 100234"
          mode="outlined"
          value={customerId}
          onChangeText={setCustomerId}
          keyboardType="default"
          autoCapitalize="none"
          style={{
            width: "100%",
            marginBottom: 18,
            borderRadius: 28,
            backgroundColor: "white",
          }}
          outlineColor="#e5b5ba"
          activeOutlineColor="#EA0040"
          theme={{ roundness: 28 }}
        />

        {/* BOTÓN */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          buttonColor={Colors.light.tint}
          textColor="#fff"
          style={{
            borderRadius: 28,
            width: "100%",
            paddingVertical: 4,
            marginBottom: 20,
          }}
          labelStyle={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Iniciar sesión
        </Button>

        {/* FOOTER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "gray", fontSize: 15 }}>
            ¿No tienes cuenta?
          </Text>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text
              style={{
                color: Colors.light.tint,
                fontWeight: "600",
                fontSize: 15,
                marginLeft: 4,
              }}
            >
              Regístrate aquí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
