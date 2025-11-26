import oracledb from "oracledb";
import { oracleConfig } from "../database/oracle";

export async function getProductsService() {
  let connection: any = null;

  const extractField = (description: string | null, label: string) => {
    if (!description) return null;

    const regex = new RegExp(`${label}:\\s*([^;]+)`, "i");
    const match = description.match(regex);

    return match ? match[1].trim() : null;
  };

  try {
    connection = await oracledb.getConnection(oracleConfig);
    const query = `
      SELECT url, description_vector_rag, product_type_vector
      FROM admin.articles_modified
    `;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows ?? [];

    const products = rows.map((row: any) => {
      const description = row.DESCRIPTION_VECTOR_RAG as string | null;

      return {
        name: extractField(description, "NOMBRE") || "Producto sin nombre",
        type: extractField(description, "TIPO"),
        image: row.URL || null,
        rawCategory: row.PRODUCT_TYPE_VECTOR || null,
      };
    });

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
