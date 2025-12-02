import { Request, Response } from "express";
import { odaRecommend, odaSearch } from "../services/oda.service";

export async function chatSearch(req: Request, res: Response) {
  try {
    const { customer_id, query_text } = req.body;

    if (!customer_id || !query_text) {
      return res
        .status(400)
        .json({ error: "customer_id y query_text son requeridos" });
    }

    const data = await odaSearch({ customer_id, query_text });

    return res.json(data);
  } catch (error) {
    console.error("Error en chatSearch:", error);
    return res.status(500).json({ error: "Error en el chatbot (search)" });
  }
}

export async function chatRecommend(req: Request, res: Response) {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id es requerido" });
    }

    const data = await odaRecommend({ customer_id });

    return res.json(data);
  } catch (error) {
    console.error("Error en chatRecommend:", error);
    return res.status(500).json({ error: "Error en el chatbot (recommend)" });
  }
}
