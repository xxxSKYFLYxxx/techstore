import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, orderController.createOrder);
router.get("/my", authenticate, orderController.getMyOrders);

// Admin
router.get("/", authenticate, requireAdmin, orderController.getAllOrders);
router.patch("/:id/status", authenticate, requireAdmin, orderController.updateOrderStatus);

export default router;
