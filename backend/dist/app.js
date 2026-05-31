"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const catalog_routes_1 = __importDefault(require("./routes/catalog.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.ENV.CLIENT_URL, credentials: true }));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.get("/", (_req, res) => {
    res.json({ status: "ok", version: "1.0.0", api: "/api" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api", catalog_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.listen(env_1.ENV.PORT, () => {
    console.log(`Server running on http://localhost:${env_1.ENV.PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map