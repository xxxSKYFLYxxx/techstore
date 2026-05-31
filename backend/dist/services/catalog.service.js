"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.getBrands = getBrands;
exports.getAdminUsers = getAdminUsers;
const db_1 = __importDefault(require("../config/db"));
async function getCategories() {
    return db_1.default.category.findMany({ orderBy: { name: "asc" } });
}
async function getBrands() {
    return db_1.default.brand.findMany({ orderBy: { name: "asc" } });
}
async function getAdminUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
        db_1.default.user.count(),
        db_1.default.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        }),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
}
//# sourceMappingURL=catalog.service.js.map