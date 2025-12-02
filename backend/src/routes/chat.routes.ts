import { Router } from "express";
import { sendMessageToOda } from "../services/oda.service";

const router = Router();

router.post("/chat/oda", async (req, res) => {
  try {
    const { message, userId } = req.body as {
      message?: string;
      userId?: string;
    };

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: "message y userId son requeridos",
      });
    }

    const reply = await sendMessageToOda(message, userId);

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Error en /chat/oda:", error);
    return res.status(500).json({
      success: false,
      error: "No se pudo enviar el mensaje a ODA",
    });
  }
});

export default router;
