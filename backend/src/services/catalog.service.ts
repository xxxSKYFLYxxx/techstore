import prisma from "../config/db";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export async function getAdminUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
}
