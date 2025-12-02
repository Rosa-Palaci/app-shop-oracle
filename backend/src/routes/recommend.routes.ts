// backend/src/routes/recommend.routes.ts
import { Router } from "express";

const router = Router();

router.post("/recommend-related", async (req, res) => {
  const { customerId, articleId } = req.body || {};

  if (!customerId || !articleId) {
    return res.status(400).json({
      success: false,
      message: "customerId y articleId son requeridos",
    });
  }

  try {
    const externalRes = await fetch(
      "http://163.192.209.80:8080/recommend_related",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          article_id: Number(articleId),
        }),
      }
    );

    const text = await externalRes.text();

    if (!externalRes.ok) {
      console.error("Error del servicio externo:", externalRes.status, text);
      return res.status(502).json({
        success: false,
        message: `Error en servicio de recomendaciones (${externalRes.status})`,
        raw: text,
      });
    }

    const data = JSON.parse(text);

    const related = Array.isArray(data.related_items)
      ? data.related_items
      : [];

    // Adaptamos al formato que tu pantalla ya entiende
    const mapped = related.map((item: any) => ({
      articleId: item.article_id,
      imageUrl: item.image_url || null,
      descriptionVector: `NOMBRE: ${
        item.name || "Producto"
      }; GRUPO: ${item.group || ""}; COLOR: ${item.color || ""};`,
    }));

    return res.json({
      success: true,
      data: mapped,
    });
  } catch (err: any) {
    console.error("Error en /api/recommend-related:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Error interno del servidor",
    });
  }
});

export default router;
