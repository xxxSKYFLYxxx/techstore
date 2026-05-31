import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", productController.getProducts);

// Admin only — загрузка изображения (объявляем до "/:slug", иначе перехватит GET)
router.post("/upload", authenticate, requireAdmin, uploadImage.single("image"), productController.uploadProductImage);

router.get("/:slug", productController.getProductBySlug);

router.post("/", authenticate, requireAdmin, productController.createProduct);
router.put("/:id", authenticate, requireAdmin, productController.updateProduct);
router.delete("/:id", authenticate, requireAdmin, productController.deleteProduct);

export default router;
