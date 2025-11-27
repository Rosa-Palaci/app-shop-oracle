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
import { useCartStore } from "../stores/useCartStore";

const RED = "#EA0040";

export default function CartScreen() {
  const router = useRouter();

  const customerId = useAuthStore((state) => state.customer_id);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const isEmpty = items.length === 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor={Colors.light.tint}
          onPress={() => router.back()}
          style={styles.backButton}
        />

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
              {items.map((item) => (
                <View key={item.articleId} style={styles.itemCard}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Text>Sin imagen</Text>
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>
                      Producto #{item.articleId}
                    </Text>
                    <Text
                      style={styles.itemDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearCart}
              >
                <Text style={styles.clearButtonText}>Vaciar bolsa</Text>
              </TouchableOpacity>
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

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    resizeMode: "cover",
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: "#555",
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});