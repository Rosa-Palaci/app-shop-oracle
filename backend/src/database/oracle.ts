import oracledb from "oracledb";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const walletPath = path.join(__dirname, "../../wallet");
const poolAlias = "default";

process.env.TNS_ADMIN = walletPath;

export const oracleConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION, // team3vectordatabase_high
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT ?? 10000),
  poolAlias,
};

export async function initOracle() {
  try {
    if (!oracleConfig.user || !oracleConfig.password || !oracleConfig.connectString) {
      throw new Error("Oracle configuration is incomplete. Please check DB_USER, DB_PASSWORD and DB_CONNECTION environment variables.");
    }

    try {
      const existingPool = oracledb.getPool(poolAlias);
      await existingPool.close(0);
    } catch {
      // No pool exists yet, safe to create a new one.
    }

    await oracledb.createPool(oracleConfig);

    console.log("🔗 Oracle DB pool initialized");
  } catch (err) {
    console.error("❌ Error initializing Oracle:", err);
    throw err;
  }
}

export async function getConnection() {
  const pool = oracledb.getPool(poolAlias);
  return pool.getConnection();
}
