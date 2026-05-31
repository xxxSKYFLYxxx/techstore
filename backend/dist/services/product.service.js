"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductBySlug = getProductBySlug;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const db_1 = __importDefault(require("../config/db"));
const error_middleware_1 = require("../middlewares/error.middleware");
async function getProducts(filters) {
    const { categorySlug, brandSlug, minPrice, maxPrice, search, page = 1, limit = 12, sortBy = "newest", } = filters;
    const where = {};
    if (categorySlug)
        where.category = { slug: categorySlug };
    if (brandSlug)
        where.brand = { slug: brandSlug };
    if (search)
        where.name = { contains: search, mode: "insensitive" };
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined)
            where.price.gte = minPrice;
        if (maxPrice !== undefined)
            where.price.lte = maxPrice;
    }
    const orderBy = sortBy === "price_asc"
        ? { price: "asc" }
        : sortBy === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" };
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
        db_1.default.product.count({ where }),
        db_1.default.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: { category: true, brand: true },
        }),
    ]);
    return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}
async function getProductBySlug(slug) {
    const product = await db_1.default.product.findUnique({
        where: { slug },
        include: { category: true, brand: true },
    });
    if (!product)
        throw new error_middleware_1.AppError(404, "Product not found");
    return product;
}
async function createProduct(data) {
    const exists = await db_1.default.product.findUnique({ where: { slug: data.slug } });
    if (exists)
        throw new error_middleware_1.AppError(409, "Slug already taken");
    return db_1.default.product.create({
        data: { ...data, specs: data.specs },
        include: { category: true, brand: true },
    });
}
async function updateProduct(id, data) {
    const exists = await db_1.default.product.findUnique({ where: { id } });
    if (!exists)
        throw new error_middleware_1.AppError(404, "Product not found");
    if (data.slug && data.slug !== exists.slug) {
        const slugTaken = await db_1.default.product.findUnique({ where: { slug: data.slug } });
        if (slugTaken)
            throw new error_middleware_1.AppError(409, "Slug already taken");
    }
    const { specs, ...rest } = data;
    return db_1.default.product.update({
        where: { id },
        data: specs !== undefined ? { ...rest, specs: specs } : rest,
        include: { category: true, brand: true },
    });
}
async function deleteProduct(id) {
    const exists = await db_1.default.product.findUnique({ where: { id } });
    if (!exists)
        throw new error_middleware_1.AppError(404, "Product not found");
    await db_1.default.product.delete({ where: { id } });
}
//# sourceMappingURL=product.service.js.map