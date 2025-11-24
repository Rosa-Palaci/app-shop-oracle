import { Router } from "express";
import { loginCustomer } from "../controllers/customer.controller";

const router = Router();

router.post("/login", loginCustomer);

export default router;
