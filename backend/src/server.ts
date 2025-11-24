import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { initOracle } from "./database/oracle";

config();

const app = express();
app.use(cors());
app.use(express.json());

import customerRoutes from "./routes/customer.routes";
app.use("/api/customer", customerRoutes);

initOracle();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
