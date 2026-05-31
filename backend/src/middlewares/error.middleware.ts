import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Файл слишком большой (макс. 5 МБ)" : err.message;
    res.status(400).json({ message });
    return;
  }
  // Ошибка из fileFilter (формат файла) приходит как обычный Error
  if (err.message?.startsWith("Недопустимый формат")) {
    res.status(400).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
