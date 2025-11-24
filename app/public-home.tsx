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

// Fake Data (carousel)
const carouselItems = [
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/partial-react-logo.png"),
];

export default function PublicHomeScreen() {
  const carouselRef = useRef<FlatList<any> | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  // Auto-carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      let next = (currentIndex + 1) % carouselItems.length;
      setCurrentIndex(next);

      carouselRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

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
              onPress={() => router.replace("/welcome")}
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

          <Animated.FlatList
            ref={carouselRef}
            data={carouselItems}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image source={item} style={styles.carouselImage} />
              </View>
            )}
          />

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
    height: 220,
    marginHorizontal: width * 0.1,
    backgroundColor: "#fafafa",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  carouselImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
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
