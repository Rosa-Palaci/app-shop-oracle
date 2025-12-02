// app/product/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAuthStore } from "../../stores/useAuthStore";

const RED = "#EA0040";
const API_BASE = "http://localhost:3000";

type ApiProduct = {
  articleId: number;
  imageUrl: string | null;
  descriptionVector: string | null;
};

// 🔹 Parsea la descripción tipo:
// NOMBRE: ...; GRUPO: ...; COLOR: ...; TIPO: ...; DETALLE: ...
const parseDescription = (text?: string | null) => {
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
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string;
    imageUrl?: string;
    description?: string;
  }>();

  const id = params.id ?? "";
  const imageUrl = params.imageUrl ?? "";
  const description = params.description ?? "";

  const addItem = useCartStore((state) => state.addItem);
  const customerId = useAuthStore((state: any) => state.customer_id);

  // 🔹 Aquí ya sale todo lo que venga en la descripción
  const { name, group, color, type, detail } = parseDescription(description);

  const [similarProducts, setSimilarProducts] = useState<ApiProduct[]>([]);

  // 🔹 Productos similares usando el servicio de recomendaciones
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!id || !customerId) {
        console.log("Sin id o sin customerId, no pido recomendaciones");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/recommend-related`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            articleId: Number(id),
          }),
        });

        const json = await res.json();
        console.log("Respuesta /api/recommend-related:", json);

        if (!res.ok || !json.success) {
          console.warn("Error en recommend-related:", json);
          return;
        }

        if (Array.isArray(json.data)) {
          setSimilarProducts(json.data);
        }
      } catch (error) {
        console.error("Error cargando productos similares:", error);
      }
    };

    fetchSimilar();
  }, [id, customerId]);

  const handleAddToCart = () => {
    addItem({
      articleId: Number(id),
      imageUrl,
      description,
    });

    router.push("/cart");
  };

  const getProductName = (desc: string | null) =>
    parseDescription(desc).name || "Producto";

  const handleOpenSimilar = (product: ApiProduct) => {
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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* Flecha */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconButton icon="arrow-left" size={30} iconColor={RED} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Imagen */}
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>Sin imagen</Text>
            </View>
          )}

          {/* Título */}
          <Text style={styles.title}>{name}</Text>

          {/* Cajita con info estructurada */}
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
          <TouchableOpacity
            style={styles.addCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addCartText}>Agregar al carrito</Text>
          </TouchableOpacity>

          {/* PRODUCTOS SIMILARES */}
          {similarProducts.length > 0 && (
            <>
              <Text style={styles.similarTitle}>Productos similares</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarList}
              >
                {similarProducts.map((p) => (
                  <View key={p.articleId} style={styles.similarCard}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleOpenSimilar(p)}
                      style={{ width: "100%" }}
                    >
                      {p.imageUrl ? (
                        <Image
                          source={{ uri: p.imageUrl }}
                          style={styles.similarImage}
                        />
                      ) : (
                        <View style={styles.similarImagePlaceholder}>
                          <Text>Sin imagen</Text>
                        </View>
                      )}

                      <Text style={styles.similarName} numberOfLines={2}>
                        {getProductName(p.descriptionVector)}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleOpenSimilar(p)}
                    >
                      <Text style={styles.buyButtonText}>Comprar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
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
    zIndex: 20,
  },
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: RED,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 4,
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
    marginBottom: 24,
  },
  addCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  similarList: {
  paddingBottom: 10,
},

similarCard: {
  width: 160,
  height: 230, 
  marginRight: 14,
  backgroundColor: "#fafafa",
  borderRadius: 16,
  padding: 12,
  alignItems: "center",
  justifyContent: "space-between",
  overflow: "hidden",
},

similarImage: {
  width: "100%",
  height: 120,
  borderRadius: 12,
  marginBottom: 6,
  resizeMode: "cover",
},
  similarImagePlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  similarName: {
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
  color: "#333",
  height: 40, 
},

buyButton: {
  backgroundColor: RED,
  paddingVertical: 8,
  borderRadius: 10,
  width: "100%",
  alignItems: "center",
},
  buyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
