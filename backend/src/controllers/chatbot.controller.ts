import { Request, Response } from "express";
import {
  retailAiRecommend,
  retailAiSearch,
} from "../services/retailAi.service";
import { sendMessageToOda } from "../services/oda.service";

type AxiosLikeError = {
  isAxiosError?: boolean;
  response?: {
    status?: number;
    statusText?: string;
    data?: unknown;
  };
  message: string;
};

export async function chatbotSearch(req: Request, res: Response) {
  try {
    const { customer_id, query_text } = req.body;

    if (!customer_id || !query_text) {
      return res
        .status(400)
        .json({ error: "customer_id y query_text son requeridos" });
    }

    const data = await retailAiSearch({ customer_id, query_text });

    // aquí podrías transformar la respuesta si quisieras,
    // pero por ahora la regresamos tal cual:
    return res.json(data);
  } catch (error) {
    console.error("Error en chatbotSearch:", error);
    return res.status(500).json({ error: "Error en el chatbot (search)" });
  }
}

export async function chatbotRecommend(req: Request, res: Response) {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id es requerido" });
    }

    const data = await retailAiRecommend({ customer_id });

    return res.json(data);
  } catch (error) {
    console.error("Error en chatbotRecommend:", error);
    return res.status(500).json({ error: "Error en el chatbot (recommend)" });
  }
}

export async function chatbotOdaMessage(req: Request, res: Response) {
  try {
    const { text, userId } = req.body ?? {};

    if (typeof text !== "string" || !text.trim() || typeof userId !== "string") {
      return res.status(400).json({
        error: "text (string) y userId (string) son requeridos para ODA",
      });
    }

    const ack = await sendMessageToOda(text.trim(), userId.trim());

    return res.json({
      success: true,
      ack,
    });
  } catch (error) {
    const axiosError = error as AxiosLikeError;
    if (axiosError?.isAxiosError) {
      console.error("Error en chatbotOdaMessage (Axios)", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
      });

      const statusCode = axiosError.response?.status ?? 502;
      return res.status(statusCode).json({
        error: "Error enviando mensaje al asistente ODA",
        details: axiosError.response?.data ?? axiosError.message,
      });
    }

    console.error("Error inesperado en chatbotOdaMessage:", error);
    return res.status(500).json({
      error: "Error inesperado enviando mensaje al asistente ODA",
    });
  }
}
