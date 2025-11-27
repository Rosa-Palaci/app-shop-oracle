import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={28} color="#EA0040" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Chat de ayuda</Text>
      </View>

      {/* AREA DE MENSAJES */}
      <ScrollView style={styles.chatArea}>
        <Text style={styles.botMessage}>
          ¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?
        </Text>
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton}>
          <IconSymbol name="paperplane.fill" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#EA0040",
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  botMessage: {
    backgroundColor: "#FFE6EC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: "#333",
  },
  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "#EA0040",
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
});
