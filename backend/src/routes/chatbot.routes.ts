import { Router } from "express";
import {
  chatbotSearch,
  chatbotRecommend,
} from "../controllers/chatbot.controller";

const router = Router();

// POST /api/chat/search llama a /search
router.post("/chat/search", chatbotSearch);

// POST /api/chat/recommend llama a /recommend
router.post("/chat/recommend", chatbotRecommend);

export default router;
