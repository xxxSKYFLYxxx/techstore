"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const db_1 = __importDefault(require("../config/db"));
const error_middleware_1 = require("../middlewares/error.middleware");
const cart_service_1 = require("./cart.service");
async function createOrder(userId, address, phone) {
    const cart = await db_1.default.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
        throw new error_middleware_1.AppError(400, "Cart is empty");
    }
    for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
            throw new error_middleware_1.AppError(400, `Not enough stock for "${item.product.name}"`);
        }
    }
    const total = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const order = await db_1.default.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                address,
                phone,
                total,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        return newOrder;
    });
    await (0, cart_service_1.clearCart)(userId);
    return order;
}
async function getUserOrders(userId) {
    return db_1.default.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: { include: { brand: true } } } } },
    });
}
async function getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
        db_1.default.order.count(),
        db_1.default.order.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: { include: { product: true } },
            },
        }),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
}
const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
async function updateOrderStatus(id, status) {
    if (!ORDER_STATUSES.includes(status)) {
        throw new error_middleware_1.AppError(400, "Invalid order status");
    }
    const order = await db_1.default.order.findUnique({ where: { id } });
    if (!order)
        throw new error_middleware_1.AppError(404, "Order not found");
    return db_1.default.order.update({
        where: { id },
        data: { status: status },
        include: { items: { include: { product: true } } },
    });
}
//# sourceMappingURL=order.service.js.map