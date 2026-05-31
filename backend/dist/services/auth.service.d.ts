interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare function register(email: string, password: string, name: string): Promise<{
    tokens: TokenPair;
    user: {
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    };
}>;
export declare function login(email: string, password: string): Promise<{
    tokens: TokenPair;
    user: {
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    };
}>;
export declare function refresh(token: string): Promise<TokenPair>;
export declare function logout(token: string): Promise<void>;
export {};
//# sourceMappingURL=auth.service.d.ts.map