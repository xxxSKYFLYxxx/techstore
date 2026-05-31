import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
export declare function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getMyOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map