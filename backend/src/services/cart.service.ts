import prisma from "../config/db";
import { AppError } from "../middlewares/error.middleware";

export async function getCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { brand: true } },
        },
      },
    },
  });
  if (!cart) throw new AppError(404, "Cart not found");
  return cart;
}

export async function addItem(userId: number, productId: number, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError(404, "Cart not found");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError(404, "Product not found");
  if (product.stock < quantity) throw new AppError(400, "Not enough stock");

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
}

export async function updateItem(userId: number, itemId: number, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError(404, "Cart not found");

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.cartId !== cart.id) throw new AppError(404, "Item not found");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return null;
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
}

export async function removeItem(userId: number, itemId: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError(404, "Cart not found");

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.cartId !== cart.id) throw new AppError(404, "Item not found");

  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(userId: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
