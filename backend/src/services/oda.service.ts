import axios, { AxiosError } from "axios";

type OdaResponse = {
  message?: {
    text?: string;
  };
};

export async function sendMessageToOda(
  text: string,
  userId: string
): Promise<string> {
  if (!process.env.ODA_WEBHOOK_URL || !process.env.ODA_SECRET) {
    throw new Error("ODA configuration is missing");
  }

  try {
    const { data } = await axios.post<OdaResponse>(
      process.env.ODA_WEBHOOK_URL,
      {
        message: {
          type: "text",
          text,
        },
        userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Hub-Signature": process.env.ODA_SECRET,
        },
      }
    );

    return data.message?.text ?? "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const statusText = axiosError.response?.statusText;
      const details = axiosError.response?.data;

      console.error("Error sending message to ODA:", {
        status,
        statusText,
        details,
      });

      throw new Error(
        status ? `ODA request failed with status ${status}` : "ODA request failed"
      );
    }

    throw error;
  }
}
