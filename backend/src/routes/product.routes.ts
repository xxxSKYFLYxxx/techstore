import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);

// Admin only
router.post("/", authenticate, requireAdmin, productController.createProduct);
router.put("/:id", authenticate, requireAdmin, productController.updateProduct);
router.delete("/:id", authenticate, requireAdmin, productController.deleteProduct);

export default router;
