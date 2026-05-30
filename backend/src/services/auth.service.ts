import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { ENV } from "../config/env";
import { AppError } from "../middlewares/error.middleware";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(userId: number, role: string): TokenPair {
  const accessToken = jwt.sign({ userId, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export async function register(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  await prisma.cart.create({ data: { userId: user.id } });

  const tokens = generateTokens(user.id, user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: tokens.refreshToken, userId: user.id, expiresAt },
  });

  return { tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const tokens = generateTokens(user.id, user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: tokens.refreshToken, userId: user.id, expiresAt },
  });

  return { tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function refresh(token: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, "Invalid refresh token");
  }

  const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { userId: number };
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new AppError(401, "User not found");

  await prisma.refreshToken.delete({ where: { token } });

  const tokens = generateTokens(user.id, user.role);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: tokens.refreshToken, userId: user.id, expiresAt },
  });

  return tokens;
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}
