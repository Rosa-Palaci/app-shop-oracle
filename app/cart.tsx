import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Colors } from "../constants/theme";
import { useAuthStore } from "../stores/useAuthStore";

const RED = "#EA0040";

export default function CartScreen() {
  const router = useRouter();

  // Estado real del usuario
  const customerId = useAuthStore((state) => state.customer_id);

  // Temporal: carrito vacío
  const isEmpty = true;

  return (
    <>
      {/* Ocultar header nativo */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* FLECHA ROJA (igual al login) */}
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={Colors.light.tint}
          onPress={() => router.back()}
          style={styles.backButton}
        />

        {/* TÍTULO */}
        <Text style={styles.title}>Mi bolsa</Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {isEmpty ? (
            <View style={styles.emptyContainer}>
              {/* Imagen vacía */}
              <Image
                source={require("@/assets/images/cart.png")}
                style={styles.emptyImage}
              />

              <Text style={styles.emptyTitle}>Tu bolsa está vacía</Text>

              <Text style={styles.emptyText}>
                Agrega productos para verlos aquí.
              </Text>

              {/* SOLO mostrar botón si NO está loggeada */}
              {!customerId && (
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>
              {/* Aquí irán las cards cuando el carrito tenga productos */}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: RED,
    marginTop: 100,
    marginBottom: 20,
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyImage: {
    width: 260,
    height: 260,
    marginBottom: 20,
    resizeMode: "contain",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  loginButton: {
    backgroundColor: RED,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
