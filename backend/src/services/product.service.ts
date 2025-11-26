import oracledb from "oracledb";
import { getConnection } from "../config/oracle.config";

type OracleProductRow = {
  ARTICLE_ID?: number;
  IMG_URL_TEAM3?: string | null;
  DESCRIPTION_VECTOR_RAG?: string | null;
};

export async function getProductsService() {
  let connection: oracledb.Connection | null = null;

  try {
    connection = await getConnection();

    const query = `
      SELECT article_id, img_url_Team3, description_vector_rag
      FROM admin.articles_modified
      FETCH FIRST 20 ROWS ONLY
    `;

    const result = await connection.execute<OracleProductRow>(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows ?? [];

    return rows.map((row) => ({
      articleId: row.ARTICLE_ID ?? null,
      imageUrl: row.IMG_URL_TEAM3 ?? null,
      descriptionVector: row.DESCRIPTION_VECTOR_RAG ?? null,
    }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    throw { success: false, error: message };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
