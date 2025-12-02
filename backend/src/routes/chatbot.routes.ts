import { Router } from "express";
import {
  chatbotSearch,
  chatbotRecommend,
  chatbotOdaMessage,
} from "../controllers/chatbot.controller";

const router = Router();

// POST /api/chat/search llama a /search
router.post("/chat/search", chatbotSearch);

// POST /api/chat/recommend llama a /recommend
router.post("/chat/recommend", chatbotRecommend);

// POST /api/chat/oda envia mensajes al asistente Oracle Digital Assistant
router.post("/chat/oda", chatbotOdaMessage);

export default router;
