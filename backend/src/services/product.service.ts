import oracledb from "oracledb";
import { getConnection } from "../config/oracle.config";

type OracleProductRow = {
  ARTICLE_ID?: number;
  IMG_URL_TEAM3?: string | null;
  DESCRIPTION_VECTOR_RAG?: string | null;
};

export async function getProductsService() {
  let connection: any = null;

  try {
    connection = await getConnection();

    const query = `
      SELECT 
        "article_id", 
        "img_url_team3", 
        "description_vector_rag"
FROM admin.articles_modified
FETCH FIRST 20 ROWS ONLY;
    `;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows ?? [];

return rows.map((row: any) => ({
  articleId: row.article_id ?? null,
  imageUrl: row.img_url_team3 ?? null,
  descriptionVector: row.description_vector_rag ?? null,
}));

  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    throw { success: false, error: message };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing DB connection", closeErr);
      }
    }
  }
}