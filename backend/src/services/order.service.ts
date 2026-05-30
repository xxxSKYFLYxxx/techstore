import prisma from "../config/db";
import { AppError } from "../middlewares/error.middleware";
import { clearCart } from "./cart.service";

export async function createOrder(userId: number, address: string, phone: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new AppError(400, `Not enough stock for "${item.product.name}"`);
    }
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
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

  await clearCart(userId);
  return order;
}

export async function getUserOrders(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { include: { brand: true } } } } },
  });
}

export async function getAllOrders(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
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

export async function updateOrderStatus(id: number, status: string) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError(404, "Order not found");
  return prisma.order.update({
    where: { id },
    data: { status: status as never },
    include: { items: { include: { product: true } } },
  });
}
