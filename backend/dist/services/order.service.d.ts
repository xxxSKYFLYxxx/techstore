export declare function createOrder(userId: number, address: string, phone: string): Promise<{
    items: ({
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
        price: import("@prisma/client/runtime/library").Decimal;
        productId: number;
        quantity: number;
        orderId: number;
    })[];
} & {
    userId: number;
    id: number;
    createdAt: Date;
    status: import(".prisma/client").$Enums.OrderStatus;
    total: import("@prisma/client/runtime/library").Decimal;
    address: string;
    phone: string;
}>;
export declare function getUserOrders(userId: number): Promise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        productId: number;
        quantity: number;
        orderId: number;
    })[];
} & {
    userId: number;
    id: number;
    createdAt: Date;
    status: import(".prisma/client").$Enums.OrderStatus;
    total: import("@prisma/client/runtime/library").Decimal;
    address: string;
    phone: string;
})[]>;
export declare function getAllOrders(page?: number, limit?: number): Promise<{
    items: ({
        user: {
            id: number;
            email: string;
            name: string;
        };
        items: ({
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
            price: import("@prisma/client/runtime/library").Decimal;
            productId: number;
            quantity: number;
            orderId: number;
        })[];
    } & {
        userId: number;
        id: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        address: string;
        phone: string;
    })[];
    total: number;
    page: number;
    totalPages: number;
}>;
export declare function updateOrderStatus(id: number, status: string): Promise<{
    items: ({
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
        price: import("@prisma/client/runtime/library").Decimal;
        productId: number;
        quantity: number;
        orderId: number;
    })[];
} & {
    userId: number;
    id: number;
    createdAt: Date;
    status: import(".prisma/client").$Enums.OrderStatus;
    total: import("@prisma/client/runtime/library").Decimal;
    address: string;
    phone: string;
}>;
//# sourceMappingURL=order.service.d.ts.map