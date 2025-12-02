// app/catalog.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const RED = "#EA0040";

type CatalogCategory = {
  id: string;
  name: string;
  image: any;
  type?: string; // TIPO: ... del description_vector_rag
};

export default function CatalogScreen() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

// catalog.tsx
const categories: CatalogCategory[] = [
  {
    id: "1",
    name: "Mujer",
    image: require("@/assets/images/categorias/mujer.png"),
  },
  {
    id: "2",
    name: "Hombre",
    image: require("@/assets/images/categorias/hombre.png"),
  },
  {
    id: "3",
    name: "Jumpers",
    image: require("@/assets/images/categorias/jumper.png"),
    type: "Jump",
  },
  {
    id: "4",
    name: "Calcetas",
    image: require("@/assets/images/categorias/socks.png"),
    type: "Sock",
  },
  {
    id: "5",
    name: "Pijamas",
    image: require("@/assets/images/categorias/pijama.png"),
    type: "Pyjama",
  },
  {
    id: "6",
    name: "Suéteres",
    image: require("@/assets/images/categorias/sweater.png"),
    type: "Sweater",
  },
  {
    id: "7",
    name: "Shorts",
    image: require("@/assets/images/categorias/short.png"),
    type: "short",
  },
  {
    id: "8",
    name: "Leggins",
    image: require("@/assets/images/categorias/leggins.png"),
    type: "Legging",
  },
];



  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* BUSCADOR + CARRITO */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar por categoría o producto..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
          style={[
            styles.searchInput,
            { borderColor: searchFocused ? RED : "#CFCFCF" },
          ]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />

        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Image
            source={require("@/assets/images/icon-card.png")}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {filteredCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category-products",
                params: {
                  category: cat.name,
                  type: cat.type ?? "", // "" → sin filtro
                },
              })
            }
          >
            <Image source={cat.image} style={styles.cardImage} />
            <Text style={styles.cardText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 16,
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
  cartIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    resizeMode: "contain",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    width: "42%",
    backgroundColor: "#fafafa",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  cardImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
