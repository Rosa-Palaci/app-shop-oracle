import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../database/oracle";

const router = Router();

/**
 * GET /api/purchases?customerId=123
 */
router.get("/purchases", async (req, res) => {
  const customerId = req.query.customerId as string | undefined;

  if (!customerId) {
    return res
      .status(400)
      .json({ success: false, message: "customerId es requerido" });
  }

  let connection: any;

  try {
    connection = await getConnection();

    const sql = `
      SELECT
        t."customer_id"           AS "customerId",
        t."article_id"            AS "articleId",
        t."price"                 AS "price",
        t."t_year"                AS "year",
        t."t_month"               AS "month",
        t."t_day"                 AS "day",
        t."price_scaled"          AS "priceScaled",
        t."channel_2"             AS "channel",
        a."img_url_team3"         AS "imgUrl",
        a."description_vector_rag" AS "descriptionVector"
      FROM ADMIN.TRANSACTIONS_MODIFIED t
      LEFT JOIN ADMIN.ARTICLES_MODIFIED a
        ON t."article_id" = a."article_id"
      WHERE t."customer_id" = :customerId
      ORDER BY
        t."t_year"  DESC,
        t."t_month" DESC,
        t."t_day"   DESC,
        t."article_id"
    `;

    const result = await connection.execute(
      sql,
      { customerId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const rows = (result.rows || []) as any[];

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error en /api/purchases:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Error interno del servidor",
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error cerrando conexión Oracle:", closeError);
      }
    }
  }
});

export default router;
