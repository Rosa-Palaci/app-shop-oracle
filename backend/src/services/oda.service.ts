import axios, { AxiosError } from "axios";

export type OdaAckResponse = {
  status?: string;
  accepted?: boolean;
};

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

  try {
    console.log(`Enviando mensaje a: ${endpoint}`);

    const { data, status } = await axios.post<OdaAckResponse>(
      endpoint,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
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

      throw new Error(
        axiosError.response?.status
          ? `ODA request failed with status ${axiosError.response.status}`
          : "ODA request failed"
      );
    }
    throw error;
  }
}
