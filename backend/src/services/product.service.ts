import oracledb, { type Connection, type Result } from "oracledb";
import { getConnection } from "../database/oracle";

const callTimeoutMs = Number(process.env.DB_CALL_TIMEOUT ?? 8000);

type ArticleRow = {
  URL?: string | null;
  DESCRIPTION_VECTOR_RAG?: string | null;
  PRODUCT_TYPE_VECTOR?: string | null;
};

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Database request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function getProductsService() {
  let connection: Connection | null = null;

  const extractField = (description: string | null, label: string) => {
    if (!description) return null;

    const regex = new RegExp(`${label}:\\s*([^;]+)`, "i");
    const match = description.match(regex);

    return match ? match[1].trim() : null;
  };

  try {
    connection = await withTimeout(getConnection(), callTimeoutMs);
    const query = `
      SELECT url, description_vector_rag, product_type_vector
      FROM admin.articles_modified
    `;

    const result = await withTimeout<Result<ArticleRow>>(
      connection.execute<ArticleRow>(query, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        callTimeout: callTimeoutMs,
      }),
      callTimeoutMs
    );

    const rows = result.rows ?? [];

    const products = rows.map((row) => {
      const description = row.DESCRIPTION_VECTOR_RAG ?? null;

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
    const message =
      error instanceof Error
        ? `Unable to fetch products: ${error.message}`
        : "Unable to fetch products due to an unknown database error";
    throw new Error(message);
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
