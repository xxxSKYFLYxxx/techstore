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
export declare function getProducts(filters: ProductFilters): Promise<{
    items: ({
        category: {
            id: number;
            name: string;
            slug: string;
        };
        brand: {
            id: number;
            name: string;
            slug: string;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        slug: string;
        description: string;
        stock: number;
        images: string[];
        specs: import("@prisma/client/runtime/library").JsonValue;
        categoryId: number;
        brandId: number;
    })[];
    total: number;
    page: number;
    totalPages: number;
}>;
export declare function getProductBySlug(slug: string): Promise<{
    category: {
        id: number;
        name: string;
        slug: string;
    };
    brand: {
        id: number;
        name: string;
        slug: string;
    };
} & {
    id: number;
    name: string;
    createdAt: Date;
    price: import("@prisma/client/runtime/library").Decimal;
    slug: string;
    description: string;
    stock: number;
    images: string[];
    specs: import("@prisma/client/runtime/library").JsonValue;
    categoryId: number;
    brandId: number;
}>;
export declare function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    specs: Record<string, unknown>;
    categoryId: number;
    brandId: number;
}): Promise<{
    category: {
        id: number;
        name: string;
        slug: string;
    };
    brand: {
        id: number;
        name: string;
        slug: string;
    };
} & {
    id: number;
    name: string;
    createdAt: Date;
    price: import("@prisma/client/runtime/library").Decimal;
    slug: string;
    description: string;
    stock: number;
    images: string[];
    specs: import("@prisma/client/runtime/library").JsonValue;
    categoryId: number;
    brandId: number;
}>;
export declare function updateProduct(id: number, data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    specs: Record<string, unknown>;
    categoryId: number;
    brandId: number;
}>): Promise<{
    category: {
        id: number;
        name: string;
        slug: string;
    };
    brand: {
        id: number;
        name: string;
        slug: string;
    };
} & {
    id: number;
    name: string;
    createdAt: Date;
    price: import("@prisma/client/runtime/library").Decimal;
    slug: string;
    description: string;
    stock: number;
    images: string[];
    specs: import("@prisma/client/runtime/library").JsonValue;
    categoryId: number;
    brandId: number;
}>;
export declare function deleteProduct(id: number): Promise<void>;
export {};
//# sourceMappingURL=product.service.d.ts.map