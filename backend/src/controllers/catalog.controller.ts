import { Request, Response, NextFunction } from "express";
import * as catalogService from "../services/catalog.service";

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await catalogService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getBrands(_req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await catalogService.getBrands();
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

export async function getAdminUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    const result = await catalogService.getAdminUsers(Number(page) || 1, Number(limit) || 20);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
