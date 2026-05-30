import { Router } from "express";
import * as catalogController from "../controllers/catalog.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/categories", catalogController.getCategories);
router.get("/brands", catalogController.getBrands);

// Admin
router.get("/admin/users", authenticate, requireAdmin, catalogController.getAdminUsers);

export default router;
