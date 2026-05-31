export declare function getCategories(): Promise<{
    id: number;
    name: string;
    slug: string;
}[]>;
export declare function getBrands(): Promise<{
    id: number;
    name: string;
    slug: string;
}[]>;
export declare function getAdminUsers(page?: number, limit?: number): Promise<{
    items: {
        role: import(".prisma/client").$Enums.Role;
        id: number;
        email: string;
        name: string;
        createdAt: Date;
    }[];
    total: number;
    page: number;
    totalPages: number;
}>;
//# sourceMappingURL=catalog.service.d.ts.map