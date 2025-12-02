import axios from "axios";
import crypto from "crypto";

export type OdaAckResponse = {
  status?: string;
  accepted?: boolean;
  messageId?: string;
  error?: unknown;
};

type OdaOutboundPayload = {
  userId: string;
  messagePayload: {
    type: "text";
    text: string;
  };
};

/**
 * Enviar un mensaje al canal Webhook de ODA.
 *
 * 📌 Importante sobre la URL:
 * El canal Webhook de ODA expone un listener en la forma
 *   https://.../connectors/v2/listeners/webhook/channels/<channelId>
 * Para enviar mensajes proactivos, ODA exige usar el endpoint
 *   .../channels/<channelId>/messages
 * Por ello, si la variable ODA_WEBHOOK_URL no termina en /messages,
 * aquí se agrega automáticamente para evitar 403/404.
 */
export async function sendMessageToOda(
  text: string,
  userId: string
): Promise<OdaAckResponse> {
  const ODA_URL = process.env.ODA_WEBHOOK_URL;
  const ODA_SECRET = process.env.ODA_SECRET;

  if (!ODA_URL || !ODA_SECRET) {
    throw new Error("ODA configuration is missing (ODA_WEBHOOK_URL or ODA_SECRET)");
  }

  const baseUrl = ODA_URL.replace(/\/?$/, "");
  const messagesUrl = baseUrl.endsWith("/messages")
    ? baseUrl
    : `${baseUrl}/messages`;

  const payload: OdaOutboundPayload = {
    userId,
    messagePayload: {
      type: "text",
      text,
    },
  };

  const serializedBody = JSON.stringify(payload);

  // ODA valida la firma HMAC-SHA256 (Base64) en el header X-Hub-Signature con el prefijo "sha256=".
  const signature = `sha256=${crypto
    .createHmac("sha256", ODA_SECRET)
    .update(serializedBody, "utf8")
    .digest("base64")}`;

  try {
    console.log(`👉 Enviando mensaje a ODA (URL final): ${messagesUrl}`);
    console.log("Payload:", serializedBody);

    const { data, status } = await axios.post<OdaAckResponse>(
      messagesUrl,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Hub-Signature": signature,
        },
        timeout: 15000,
      }
    );

    console.log("✅ Respuesta de ODA", { status, data });
    return data;
  } catch (error) {
    const axiosError = error as any;
    if (axiosError?.isAxiosError) {
      console.error("❌ Error enviando mensaje a ODA", {
        url: messagesUrl,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        headers: axiosError.response?.headers,
        data: axiosError.response?.data,
      });
      // Re-lanzamos el error de Axios para que el controlador pueda decidir el status HTTP a devolver.
      throw axiosError;
    }

    console.error("❌ Error inesperado enviando mensaje a ODA", error);
    throw error;
  }
}
