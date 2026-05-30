import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { ENV } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import catalogRoutes from "./routes/catalog.routes";

const app = express();

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0", api: "/api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", catalogRoutes);

app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});

export default app;
