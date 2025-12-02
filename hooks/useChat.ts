import { useState } from "react";
import { recommendProducts, searchProducts } from "../services/chatApi";
import { useAuthStore } from "../stores/useAuthStore";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text?: string;
  products?: any[];
}

export function useChat() {
  const { customer_id } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Agregar mensaje al chat
  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Enviar texto del usuario
  const sendUserMessage = async (text: string) => {
    if (!customer_id) {
      console.warn("⚠ No hay customer_id, inicia sesión primero");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      // --- Llamada al API de búsqueda ---
      const response = await searchProducts(customer_id, text);

      const botMessage: ChatMessage = {
        id: Date.now().toString() + "-bot",
        sender: "bot",
        text: `Encontré ${response.results.length} opciones para ti`,
        products: response.results,
      };

      addMessage(botMessage);
    } catch (error: any) {
      addMessage({
        id: Date.now().toString() + "-error",
        sender: "bot",
        text: "Lo siento, hubo un error procesando tu búsqueda",
      });
      console.error("Chat error:", error);
    }

    setLoading(false);
  };

  // Recomendaciones rápidas (SVD)
  const sendQuickRecommend = async () => {
    if (!customer_id) return;

    setLoading(true);

    try {
      const response = await recommendProducts(customer_id);

      const botMessage: ChatMessage = {
        id: Date.now().toString() + "-rec",
        sender: "bot",
        text: "Te dejo algunas recomendaciones basadas en tu estilo",
        products: response.recommendations,
      };

      addMessage(botMessage);
    } catch (error) {
      addMessage({
        id: Date.now().toString() + "-error",
        sender: "bot",
        text: "No pude obtener recomendaciones en este momento",
      });
    }

    setLoading(false);
  };

  return {
    messages,
    loading,
    sendUserMessage,
    sendQuickRecommend,
  };
}
