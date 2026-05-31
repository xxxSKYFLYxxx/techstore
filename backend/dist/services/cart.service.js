"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.clearCart = clearCart;
const db_1 = __importDefault(require("../config/db"));
const error_middleware_1 = require("../middlewares/error.middleware");
async function getCart(userId) {
    const cart = await db_1.default.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: { include: { brand: true } },
                },
            },
        },
    });
    if (!cart)
        throw new error_middleware_1.AppError(404, "Cart not found");
    return cart;
}
async function addItem(userId, productId, quantity) {
    const cart = await db_1.default.cart.findUnique({ where: { userId } });
    if (!cart)
        throw new error_middleware_1.AppError(404, "Cart not found");
    const product = await db_1.default.product.findUnique({ where: { id: productId } });
    if (!product)
        throw new error_middleware_1.AppError(404, "Product not found");
    if (product.stock < quantity)
        throw new error_middleware_1.AppError(400, "Not enough stock");
    const existing = await db_1.default.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (existing) {
        return db_1.default.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + quantity },
            include: { product: true },
        });
    }
    return db_1.default.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
        include: { product: true },
    });
}
async function updateItem(userId, itemId, quantity) {
    const cart = await db_1.default.cart.findUnique({ where: { userId } });
    if (!cart)
        throw new error_middleware_1.AppError(404, "Cart not found");
    const item = await db_1.default.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id)
        throw new error_middleware_1.AppError(404, "Item not found");
    if (quantity <= 0) {
        await db_1.default.cartItem.delete({ where: { id: itemId } });
        return null;
    }
    return db_1.default.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: { product: true },
    });
}
async function removeItem(userId, itemId) {
    const cart = await db_1.default.cart.findUnique({ where: { userId } });
    if (!cart)
        throw new error_middleware_1.AppError(404, "Cart not found");
    const item = await db_1.default.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id)
        throw new error_middleware_1.AppError(404, "Item not found");
    await db_1.default.cartItem.delete({ where: { id: itemId } });
}
async function clearCart(userId) {
    const cart = await db_1.default.cart.findUnique({ where: { userId } });
    if (!cart)
        return;
    await db_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
}
//# sourceMappingURL=cart.service.js.map