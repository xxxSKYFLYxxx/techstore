import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
export declare function getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function addItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function removeItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=cart.controller.d.ts.map