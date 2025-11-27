import { router } from "expo-router";
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

const RED = "#EA0040";
const { width } = Dimensions.get("window");

// Fake Data
const carouselItems = [
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/icon.png"),
  require("@/assets/images/partial-react-logo.png"),
];

const seguirComprando = [
  {
    id: "1",
    img: require("@/assets/images/icon.png"),
    name: "Producto carrito 1",
  },
  {
    id: "2",
    img: require("@/assets/images/icon.png"),
    name: "Producto carrito 2",
  },
  {
    id: "3",
    img: require("@/assets/images/icon.png"),
    name: "Producto carrito 3",
  },
];

const ofertas = [
  { id: "1", img: require("@/assets/images/react-logo.png"), name: "Oferta 1" },
  { id: "2", img: require("@/assets/images/react-logo.png"), name: "Oferta 2" },
  { id: "3", img: require("@/assets/images/react-logo.png"), name: "Oferta 3" },
];

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [searchFocused, setSearchFocused] = useState(false);

  // Auto–carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      let next = (currentIndex + 1) % carouselItems.length;
      setCurrentIndex(next);
      carouselRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* HEADER: Buscador + Carrito */}
        <View style={styles.header}>
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
        <Text style={styles.sectionTitle}>Últimos productos vistos</Text>

        <Animated.FlatList
          ref={carouselRef}
          data={carouselItems}
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image source={item} style={styles.carouselImage} />
            </View>
          )}
        />

        {/* SEGUIR COMPRANDO */}
        <Text style={styles.sectionTitle}>Seguir comprando</Text>

        <View style={styles.grid}>
          {seguirComprando.map((p) => (
            <View key={p.id} style={styles.card}>
              <Image source={p.img} style={styles.cardImg} />
              <Text style={styles.cardText}>{p.name}</Text>
            </View>
          ))}
        </View>

        {/* OFERTAS PARA TI */}
        <Text style={styles.sectionTitle}>Ofertas para ti</Text>

        <View style={styles.grid}>
          {ofertas.map((p) => (
            <View key={p.id} style={styles.card}>
              <Image source={p.img} style={styles.cardImg} />
              <Text style={styles.cardText}>{p.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ⭐ BOTÓN FLOTANTE DEL CHAT ⭐ */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.push("/chat")}
      >
        <Image
          source={require("@/assets/images/chat-icon.png")}
          style={styles.chatIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
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
    marginLeft: 12,
  },

  cartIcon: {
    width: 36,
    height: 36,
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
    elevation: 3,
  },

  carouselImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  card: {
    width: "47%",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  cardImg: {
    width: 80,
    height: 80,
    marginBottom: 8,
    resizeMode: "contain",
  },

  cardText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  // ⭐ CHAT BUTTON
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: RED,
    width: 65,
    height: 65,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  chatIcon: {
    width: 55,
    height: 55,
    tintColor: "#fff",
  },
});
