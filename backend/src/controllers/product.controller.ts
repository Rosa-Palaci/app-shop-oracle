import { Request, Response } from "express";
import { getProductsService } from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const data = await getProductsService();
    return res.json({ success: true, data });
  } catch (e) {
    const error = e as { success?: boolean; error?: string };
    return res.status(500).json({ success: false, error: error.error || "Error fetching products" });
  }
}
