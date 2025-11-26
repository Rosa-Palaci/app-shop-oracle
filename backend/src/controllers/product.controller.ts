import { Request, Response } from "express";
import { getProductsService } from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getProductsService();

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    const message = error instanceof Error ? error.message : "Error fetching products";
    return res.status(503).json({
      success: false,
      error: message,
    });
  }
}
