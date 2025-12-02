import { Router } from "express";
import { chatRecommend, chatSearch } from "../controllers/chat.controller";

const router = Router();

router.post("/chat/search", chatSearch);
router.post("/chat/recommend", chatRecommend);

export default router;
