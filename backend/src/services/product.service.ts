import prisma from "../config/db";
import { AppError } from "../middlewares/error.middleware";

interface ProductFilters {
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "price_asc" | "price_desc" | "newest";
}

export async function getProducts(filters: ProductFilters) {
  const {
    categorySlug,
    brandSlug,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    sortBy = "newest",
  } = filters;

  const where: Record<string, unknown> = {};

  if (categorySlug) where.category = { slug: categorySlug };
  if (brandSlug) where.brand = { slug: brandSlug };
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as Record<string, unknown>).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Record<string, unknown>).lte = maxPrice;
  }

  const orderBy =
    sortBy === "price_asc"
      ? { price: "asc" as const }
      : sortBy === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
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

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });
  if (!product) throw new AppError(404, "Product not found");
  return product;
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  categoryId: number;
  brandId: number;
}) {
  const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (exists) throw new AppError(409, "Slug already taken");
  return prisma.product.create({
    data: { ...data, specs: data.specs as never },
    include: { category: true, brand: true },
  });
}

export async function updateProduct(id: number, data: Partial<{
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  categoryId: number;
  brandId: number;
}>) {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw new AppError(404, "Product not found");
  if (data.slug && data.slug !== exists.slug) {
    const slugTaken = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (slugTaken) throw new AppError(409, "Slug already taken");
  }
  const { specs, ...rest } = data;
  return prisma.product.update({
    where: { id },
    data: specs !== undefined ? { ...rest, specs: specs as never } : rest,
    include: { category: true, brand: true },
  });
}

export async function deleteProduct(id: number) {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw new AppError(404, "Product not found");
  await prisma.product.delete({ where: { id } });
}
