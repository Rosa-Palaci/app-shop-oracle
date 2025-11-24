import { StyleSheet, Text, View } from "react-native";

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de compras</Text>
      <Text style={styles.text}>
        Aquí aparecerán los productos añadidos al carrito.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#EA0040",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
