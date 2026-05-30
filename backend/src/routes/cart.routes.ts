import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:id", cartController.updateItem);
router.delete("/items/:id", cartController.removeItem);

export default router;
