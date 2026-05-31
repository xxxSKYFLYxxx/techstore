"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const env_1 = require("../config/env");
const error_middleware_1 = require("../middlewares/error.middleware");
function generateTokens(userId, role) {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, env_1.ENV.JWT_SECRET, {
        expiresIn: env_1.ENV.JWT_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, env_1.ENV.JWT_REFRESH_SECRET, {
        expiresIn: env_1.ENV.JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
}
async function register(email, password, name) {
    const existing = await db_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw new error_middleware_1.AppError(409, "Email already in use");
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await db_1.default.user.create({
        data: { email, passwordHash, name },
    });
    await db_1.default.cart.create({ data: { userId: user.id } });
    const tokens = generateTokens(user.id, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db_1.default.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id, expiresAt },
    });
    return { tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}
async function login(email, password) {
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new error_middleware_1.AppError(401, "Invalid credentials");
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid)
        throw new error_middleware_1.AppError(401, "Invalid credentials");
    const tokens = generateTokens(user.id, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db_1.default.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id, expiresAt },
    });
    return { tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}
async function refresh(token) {
    const stored = await db_1.default.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
        throw new error_middleware_1.AppError(401, "Invalid refresh token");
    }
    const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_REFRESH_SECRET);
    const user = await db_1.default.user.findUnique({ where: { id: payload.userId } });
    if (!user)
        throw new error_middleware_1.AppError(401, "User not found");
    await db_1.default.refreshToken.delete({ where: { token } });
    const tokens = generateTokens(user.id, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db_1.default.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id, expiresAt },
    });
    return tokens;
}
async function logout(token) {
    await db_1.default.refreshToken.deleteMany({ where: { token } });
}
//# sourceMappingURL=auth.service.js.map