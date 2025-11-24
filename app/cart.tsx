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

const RED = "#EA0040";

export default function CartScreen() {
  const router = useRouter();

  // Temporal: carrito vacío
  const isEmpty = true;

  return (
    <>
      {/* Ocultar header nativo */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* FLECHA IGUAL A LOGIN */}
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={Colors.light.tint}
          onPress={() => router.push("/public-home")}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            zIndex: 10,
          }}
        />

        {/* TÍTULO */}
        <Text style={styles.title}>Mi bolsa</Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {isEmpty ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require("@/assets/images/cart.png")}
                style={styles.emptyImage}
              />

              <Text style={styles.emptyTitle}>Tu bolsa está vacía</Text>

              <Text style={styles.emptyText}>
                Agrega productos para verlos aquí.
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/login")}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20 }}>
              {/* Aquí irán las cards del carrito cuando lo implementemos */}
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
