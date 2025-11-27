import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Colors } from "../constants/theme";

const RED = "#EA0040";
const { width } = Dimensions.get("window");

type Product = {
  articleId: number;
  imageUrl: string | null;
  descriptionVector: string | null;
};

export default function PublicHomeScreen() {
  const carouselRef = useRef<FlatList<any> | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [carouselItems, setCarouselItems] = useState<Product[]>([]);

  // 🔹 Fetch a tu API de productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setCarouselItems(json.data);
        } else {
          console.warn("Respuesta inesperada de /api/products:", json);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Auto-carrusel (solo si hay items)
  useEffect(() => {
    if (!carouselItems.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % carouselItems.length;

        carouselRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {/* HEADER: Flecha + Buscador + Carrito */}
          <View style={styles.header}>
            {/* Flechita */}
            <IconButton
              icon="arrow-left"
              size={26}
              iconColor={Colors.light.tint}
              onPress={() => router.back()}
              style={styles.backButton}
            />

            {/* Buscador */}
            <TextInput
              placeholder="Buscar productos..."
              placeholderTextColor="#777"
              style={[
                styles.searchInput,
                { borderColor: searchFocused ? RED : "#CFCFCF" },
              ]}
              selectionColor={RED}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />

            {/* Carrito */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push("/cart")}
            >
              <Image
                source={require("@/assets/images/icon-card.png")}
                style={styles.cartIcon}
              />
            </TouchableOpacity>
          </View>

          {/* CAROUSEL */}
          <Text style={styles.sectionTitle}>Ofertas del día</Text>

          {carouselItems.length > 0 ? (
            <Animated.FlatList
              ref={carouselRef}
              data={carouselItems}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.articleId.toString()}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.carouselImage}
                    />
                  ) : (
                    <Text>Sin imagen</Text>
                  )}
                </View>
              )}
            />
          ) : (
            // Opcional: placeholder mientras carga
            <View style={[styles.carouselItem, { alignSelf: "center" }]}>
              <Text>Cargando ofertas...</Text>
            </View>
          )}

          {/* CAJA DE REGISTRO */}
          <View style={styles.registerBox}>
            <Text style={styles.registerTitle}>
              ¡Tu experiencia personalizada te espera!
            </Text>

            <Text style={styles.registerDescription}>
              Inicia sesión para recibir recomendaciones personalizadas, guardar
              tus productos favoritos y mucho más.
            </Text>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.registerButtonText}>Iniciar sesión</Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 25,
    marginBottom: 20,
  },

  backButton: {
    marginRight: 6,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 2,
  },

  cartButton: {
    marginLeft: 10,
  },

  cartIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 12,
    color: RED,
  },

  carouselItem: {
  width: width * 0.8,
  height: 250,
  marginHorizontal: width * 0.1,
  backgroundColor: "#fafafa",
  borderRadius: 20,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
},

  carouselImage: {
  borderRadius: 20,
  resizeMode: "contain",
  width: "100%",
  height: "100%"
},

  registerBox: {
    marginTop: 30,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: "#fff5f7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffc2d1",
  },

  registerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: RED,
    marginBottom: 10,
    textAlign: "center",
  },

  registerDescription: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  registerButton: {
    backgroundColor: RED,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});