import axios, { AxiosError } from "axios";

export type OdaAckResponse = {
  status?: string;
  accepted?: boolean;
  message?: { text?: string };
};

export async function sendMessageToOda(
  text: string,
  userId: string
): Promise<OdaAckResponse> {
  const ODA_URL = process.env.ODA_WEBHOOK_URL;
  const ODA_SECRET = process.env.ODA_SECRET;

  if (!ODA_URL || !ODA_SECRET) {
    throw new Error("ODA configuration is missing");
  }

  // 🔹 Payload correcto para canales Webhook de ODA
  const payload = {
    userId,
    messagePayload: {
      type: "text",
      text,
    },
  };

  try {
    console.log(`👉 Enviando mensaje a ODA: ${ODA_URL}`);
    console.log("Payload:", JSON.stringify(payload));

    const { data, status } = await axios.post<OdaAckResponse>(
      ODA_URL, // Se envía sin /messages
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Hub-Signature": ODA_SECRET, // Necesario para autenticación
        },
      }
    );

    console.log("✅ ¡Mensaje enviado con éxito a ODA!");
    console.log("Status:", status);
    console.log("Respuesta:", JSON.stringify(data));

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("❌ Error enviando mensaje a ODA:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        details: axiosError.response?.data,
      });

      throw new Error(
        axiosError.response?.status
          ? `ODA request failed with status ${axiosError.response.status}`
          : "ODA request failed"
      );
    }
    throw error;
  }
}
