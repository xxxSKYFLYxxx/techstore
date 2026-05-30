import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, brand, minPrice, maxPrice, search, page, limit, sortBy } = req.query;
    const result = await productService.getProducts({
      categorySlug: category as string,
      brandSlug: brand as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as "price_asc" | "price_desc" | "newest",
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
