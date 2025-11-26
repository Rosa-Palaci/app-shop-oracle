import oracledb from "oracledb";
import { oracleConfig } from "../database/oracle";

export async function getProductsService() {
  let connection: any = null;

  try {
    connection = await oracledb.getConnection(oracleConfig);
    const query = `SELECT * FROM ARTICLE_CONTENT_RAG`;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows ?? [];

    const products = rows.map((row: any) => ({
      name:
        row.ARTICLE_NAME ||
        row.NAME ||
        row.TITLE ||
        row.ARTICLE_TITLE ||
        "Producto sin nombre",
      image:
        row.IMG_URL_TEAM3 ||
        row.IMG_URL ||
        row.IMAGE_URL ||
        row.IMAGE ||
        row.URL ||
        row.LINK ||
        null,
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products from Oracle:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing Oracle connection:", closeError);
      }
    }
  }
}
