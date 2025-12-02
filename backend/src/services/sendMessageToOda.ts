import axios, { AxiosError } from "axios";

export async function sendMessageToOda(
  text: string,
  userId: string
): Promise<string> {
  const ODA_URL = process.env.ODA_WEBHOOK_URL;
  const ODA_SECRET = process.env.ODA_SECRET;

  if (!ODA_URL || !ODA_SECRET) {
    throw new Error("ODA configuration missing (URL or SECRET)");
  }

  const body = {
    message: {
      type: "text",
      text,
    },
    userId,
  };

  try {
    const { data } = await axios.post(ODA_URL, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature": ODA_SECRET,
      },
    });

    console.log("Respuesta ODA:", data);

    return data?.message?.text || "No response from ODA";
  } catch (error) {
    const err = error as AxiosError;

    console.error("❌ Error enviando mensaje a ODA:");
    console.error("Status:", err.response?.status);
    console.error("Body:", err.response?.data);

    throw error;
  }
}
