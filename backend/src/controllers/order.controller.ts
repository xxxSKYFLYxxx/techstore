import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as orderService from "../services/order.service";

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { address, phone } = req.body;
    const order = await orderService.createOrder(req.userId!, address, phone);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = await orderService.getUserOrders(req.userId!);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    const result = await orderService.getAllOrders(Number(page) || 1, Number(limit) || 20);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
    res.json(order);
  } catch (err) {
    next(err);
  }
}
