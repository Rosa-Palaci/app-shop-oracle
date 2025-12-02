import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { initOracle } from "./database/oracle";

config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas 
import customerRoutes from "./routes/customer.routes";
import productRoutes from "./routes/product.routes";
import chatbotRoutes from "./routes/chatbot.routes";
import purchasesRoutes from "./routes/purchases.routes";
import categoryRoutes from "./routes/category.routes";



app.use("/api/customer", customerRoutes);
app.use("/api", productRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", purchasesRoutes);
app.use("/api", categoryRoutes);

async function startServer() {
  try {
    await initOracle();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
