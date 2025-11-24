import oracledb from "oracledb";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const walletPath = path.join(__dirname, "../../wallet");

// macOS ARM usa TNS_ADMIN en lugar de initOracleClient
process.env.TNS_ADMIN = walletPath;

export async function initOracle() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION, // retailmodeldb_high
    });

    console.log("🔗 Oracle DB pool initialized");
  } catch (err) {
    console.error("❌ Error initializing Oracle:", err);
  }
}

export function getConnection() {
  return oracledb.getConnection();
}
