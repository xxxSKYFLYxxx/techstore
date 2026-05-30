import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
