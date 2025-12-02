// app/category-products.tsx
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { IconButton, Text } from "react-native-paper";

const API_BASE = "http://localhost:3000";
const RED = "#EA0040";

export const unstable_settings = {
  headerShown: false,
};

type ApiProduct = {
  articleId: number;
  imageUrl: string | null;
  descriptionVector: string | null;
};

const parseDescription = (text?: string | null) => {
  if (!text) return { name: "Producto", type: "" };

  const extract = (label: string) => {
    const regex = new RegExp(`${label}:\\s*([^;]+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    name: extract("NOMBRE"),
    type: extract("TIPO"),
  };
};

export default function CategoryProducts() {
  const { category, type } = useLocalSearchParams<{
    category?: string;
    type?: string;
  }>();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/category-products`);

        if (!res.ok) {
          setError(`Error del servidor (${res.status})`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (!json.success) {
          setError(json.message || "No se pudieron cargar los productos.");
        } else {
          setProducts(json.data || []);
        }
      } catch (e) {
        console.error("Error cargando category-products:", e);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mujer / Hombre → type vacío → sin filtro
  const normalizedType =
    typeof type === "string" && type.length > 0
      ? type.toLowerCase()
      : "";

  const filteredProducts = useMemo(() => {
    if (!normalizedType) return products;

    return products.filter((p) => {
      const info = parseDescription(p.descriptionVector);
      return info.type.toLowerCase().includes(normalizedType);
    });
  }, [products, normalizedType]);

  const renderItem = ({ item }: { item: ApiProduct }) => {
    const info = parseDescription(item.descriptionVector);

    return (
      <View style={styles.card}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ color: "#999", fontSize: 12 }}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.nameText}>{info.name || "Producto"}</Text>
          {info.type ? (
            <Text style={styles.typeText}>Tipo: {info.type}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={theme.tint}
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <Text style={styles.headerTitle}>{category ?? "Categoría"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={RED} />
          <Text style={styles.helperText}>Cargando productos...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.helperText}>
            No se encontraron artículos para esta categoría.
          </Text>
        </View>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.articleId)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: RED,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: RED,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: "#777",
  },
});
