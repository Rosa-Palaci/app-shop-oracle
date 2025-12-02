import axios, { AxiosError } from "axios";
import { createHmac } from "crypto";

export type OdaAckResponse = {
  status?: string;
  accepted?: boolean;
};

export class OdaRequestError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "OdaRequestError";
    this.status = status;
    this.details = details;
  }
}

export async function sendMessageToOda(
  text: string,
  userId: string
): Promise<OdaAckResponse> {
  if (!process.env.ODA_WEBHOOK_URL) {
    throw new Error("ODA configuration is missing");
  }

  const endpoint = `${process.env.ODA_WEBHOOK_URL}/messages`;

  const payload = {
    userId: userId,
    messagePayload: {
      type: "text",
      text: text,
    },
  };

  const payloadJson = JSON.stringify(payload);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.ODA_SECRET) {
    const signature = createHmac("sha256", process.env.ODA_SECRET)
      .update(payloadJson, "utf8")
      .digest("hex");

    headers["X-Hub-Signature"] = `sha256=${signature}`;
  }

  try {
    console.log(`Enviando mensaje a: ${endpoint}`);

    const { data, status } = await axios.post<OdaAckResponse>(
      endpoint,
      payloadJson,
      {
        headers,
      }
    );

    console.log("✅ ¡ÉXITO! Mensaje recibido por ODA.");
    console.log("Status Code:", status);
    console.log("Respuesta del servidor:", JSON.stringify(data));

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("❌ Error enviando mensaje a ODA:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        details: axiosError.response?.data,
      });

      throw new OdaRequestError(
        axiosError.response?.status
          ? `ODA request failed with status ${axiosError.response.status}`
          : "ODA request failed",
        axiosError.response?.status,
        axiosError.response?.data
      );
    }
    throw error;
  }
}
