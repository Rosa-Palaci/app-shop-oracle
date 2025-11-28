// app/product/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import { useCartStore } from "../../stores/useCartStore";

const RED = "#EA0040";

// 🔹 Extraer información de descriptionVector
const parseDescription = (text?: string) => {
  if (!text) {
    return { name: "Producto", group: "", color: "", type: "", detail: "" };
  }

  const extract = (label: string) => {
    const regex = new RegExp(`${label}:\\s*([^;]+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    name: extract("NOMBRE"),
    group: extract("GRUPO"),
    color: extract("COLOR"),
    type: extract("TIPO"),
    detail: extract("DETALLE"),
  };
};

export default function ProductDetailScreen() {
  const router = useRouter(); // 👈 AHORA USAMOS useRouter (como en cart.tsx)

  const params = useLocalSearchParams<{
    id?: string;
    imageUrl?: string;
    description?: string;
  }>();

  const id = params.id ?? "";
  const imageUrl = params.imageUrl ?? "";
  const description = params.description ?? "";

  const addItem = useCartStore((state) => state.addItem);

  const { name, group, color, type, detail } = parseDescription(description);

  const handleAddToCart = () => {
    addItem({
      articleId: Number(id),
      imageUrl,
      description,
    });

    router.push("/cart");
  };

  return (
    <>
      {/* Ocultamos header nativo */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* 🔥 Flecha igual a la de CartScreen */}
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={RED}
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            {/* Imagen */}
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>Sin imagen</Text>
              </View>
            )}

            {/* Título con el nombre del producto */}
            <Text style={styles.title}>{name}</Text>

            {/* Cajita bonita con info */}
            <View style={styles.infoBox}>
              {group ? (
                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>Grupo: </Text> {group}
                </Text>
              ) : null}

              {color ? (
                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>Color: </Text> {color}
                </Text>
              ) : null}

              {type ? (
                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>Tipo: </Text> {type}
                </Text>
              ) : null}

              {detail ? (
                <Text style={[styles.infoText, { marginTop: 8 }]}>
                  <Text style={styles.infoLabel}>Detalle: </Text> {detail}
                </Text>
              ) : null}
            </View>

            {/* Botón agregar al carrito */}
            <TouchableOpacity style={styles.addCartButton} onPress={handleAddToCart}>
              <Text style={styles.addCartText}>Agregar al carrito 🛒</Text>
            </TouchableOpacity>
          </View>
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

  content: {
    padding: 16,
    paddingTop: 100, // espacio para la flecha
  },

  card: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 16,
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
    color: RED,
    textAlign: "center",
  },

  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  infoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },

  infoLabel: {
    fontWeight: "700",
    color: RED,
  },

  addCartButton: {
    backgroundColor: RED,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  addCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
