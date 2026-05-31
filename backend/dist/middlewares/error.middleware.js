"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
const multer_1 = require("multer");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    if (err instanceof multer_1.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE" ? "Файл слишком большой (макс. 5 МБ)" : err.message;
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
//# sourceMappingURL=error.middleware.js.map