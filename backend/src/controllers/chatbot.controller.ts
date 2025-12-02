import { Request, Response } from "express";
import {
  retailAiRecommend,
  retailAiSearch,
} from "../services/retailAi.service";
import { OdaRequestError, sendMessageToOda } from "../services/oda.service";

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
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res
        .status(400)
        .json({ error: "text y userId son requeridos para ODA" });
    }

    const ack = await sendMessageToOda(text, userId);

    return res.json({
      success: true,
      ack,
    });
  } catch (error) {
    console.error("Error en chatbotOdaMessage:", error);
    if (error instanceof OdaRequestError) {
      return res.status(error.status ?? 502).json({
        error: error.message,
        details: error.details,
      });
    }

    return res.status(500).json({
      error: "Error enviando mensaje al asistente ODA",
    });
  }
}
