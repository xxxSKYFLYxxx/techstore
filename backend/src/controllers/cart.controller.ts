import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as cartService from "../services/cart.service";

export async function getCart(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cart = await cartService.getCart(req.userId!);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { productId, quantity = 1 } = req.body;
    const item = await cartService.addItem(req.userId!, productId, quantity);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await cartService.updateItem(
      req.userId!,
      Number(req.params.id),
      req.body.quantity
    );
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await cartService.removeItem(req.userId!, Number(req.params.id));
    res.json({ message: "Item removed" });
  } catch (err) {
    next(err);
  }
}
