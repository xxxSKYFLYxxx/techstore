export declare function getCart(userId: number): Promise<{
    items: ({
        product: {
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
        };
    } & {
        id: number;
        cartId: number;
        productId: number;
        quantity: number;
    })[];
} & {
    userId: number;
    id: number;
    createdAt: Date;
}>;
export declare function addItem(userId: number, productId: number, quantity: number): Promise<{
    product: {
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
    };
} & {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
}>;
export declare function updateItem(userId: number, itemId: number, quantity: number): Promise<({
    product: {
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
    };
} & {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
}) | null>;
export declare function removeItem(userId: number, itemId: number): Promise<void>;
export declare function clearCart(userId: number): Promise<void>;
//# sourceMappingURL=cart.service.d.ts.map