// backend/src/routes/category.routes.ts
import { Router } from "express";
import oracledb from "oracledb";
import { getConnection } from "../database/oracle";

const router = Router();

/**
 * GET /api/category-products
 */
router.get("/category-products", async (_req, res) => {
  let connection: any;

  try {
    connection = await getConnection();

const sql = `
  SELECT
    a."article_id"             AS "articleId",
    a."img_url_team3"          AS "imageUrl",
    a."description_vector_rag" AS "descriptionVector"
  FROM ADMIN.ARTICLES_MODIFIED a
  WHERE REGEXP_LIKE(
    a."description_vector_rag",
    'TIPO:\\s*(Shoe|Sock|Pyjama|Sweater|short|Legging|Jump)',
    'i'
  )
  FETCH FIRST 100 ROWS ONLY
`;


    const result = await connection.execute(
      sql,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = (result.rows || []) as any[];

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error en /api/category-products:", error);
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
