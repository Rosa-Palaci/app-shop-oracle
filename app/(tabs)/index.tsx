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

type Product = {
  articleId: number;
  imageUrl: string | null;
  descriptionVector: string | null;
};

// Helper para sacar el NOMBRE desde descriptionVector
const getProductName = (description: string | null): string => {
  if (!description) return "Producto";

  const match = description.match(/NOMBRE:\s*([^;]+)/i);
  if (!match) return "Producto";

  return match[1].trim();
};

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<FlatList<Product>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  // Fetch al API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        } else {
          console.warn("Respuesta inesperada de /api/products:", json);
        }
      } catch (error) {
        console.error("Error fetching products (HomeScreen):", error);
      }
    };

    fetchProducts();
  }, []);

  // Derivar secciones desde los productos
  const carouselItems = products.slice(0, 5);
  const seguirComprando = products.slice(5, 9);
  const ofertas = products.slice(9, 13);

  // Auto–carrusel
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

  // Navegar al detalle con params
  const goToProductDetail = (product: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: product.articleId.toString(),
        imageUrl: product.imageUrl ?? "",
        description: product.descriptionVector ?? "",
      },
    });
  };

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

        {carouselItems.length > 0 ? (
          <Animated.FlatList
            ref={carouselRef}
            data={carouselItems}
            horizontal
            pagingEnabled
            keyExtractor={(item) => item.articleId.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => goToProductDetail(item)}
              >
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
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={[styles.carouselItem, { alignSelf: "center" }]}>
            <Text>Cargando productos...</Text>
          </View>
        )}

        {/* SEGUIR COMPRANDO */}
        <Text style={styles.sectionTitle}>Seguir comprando</Text>

        <View style={styles.grid}>
          {seguirComprando.length > 0 ? (
            seguirComprando.map((p) => (
              <TouchableOpacity
                key={p.articleId}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => goToProductDetail(p)}
              >
                {p.imageUrl ? (
                  <Image source={{ uri: p.imageUrl }} style={styles.cardImg} />
                ) : (
                  <Text>Sin imagen</Text>
                )}
                <Text style={styles.cardText}>
                  {getProductName(p.descriptionVector)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginLeft: 16 }}>
              Aún no hay más productos para mostrar.
            </Text>
          )}
        </View>

        {/* OFERTAS PARA TI */}
        <Text style={styles.sectionTitle}>Ofertas para ti</Text>

        <View style={styles.grid}>
          {ofertas.length > 0 ? (
            ofertas.map((p) => (
              <TouchableOpacity
                key={p.articleId}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => goToProductDetail(p)}
              >
                {p.imageUrl ? (
                  <Image source={{ uri: p.imageUrl }} style={styles.cardImg} />
                ) : (
                  <Text>Sin imagen</Text>
                )}
                <Text style={styles.cardText}>
                  {getProductName(p.descriptionVector)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginLeft: 16 }}>
              Pronto tendremos ofertas para ti.
            </Text>
          )}
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
  cartButton: { marginLeft: 12 },
  cartIcon: { width: 36, height: 36, resizeMode: "contain" },
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
    overflow: "hidden",
  },
  carouselImage: { width: "100%", height: "100%", resizeMode: "cover" },
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
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: 120, marginBottom: 8, resizeMode: "cover" },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 8,
  },
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
  chatIcon: { width: 55, height: 55, tintColor: "#fff" },
});
