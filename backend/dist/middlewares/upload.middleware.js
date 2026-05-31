"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// dist/middlewares -> ../../uploads = backend/uploads (совпадает с express.static в app.ts)
const uploadsDir = path_1.default.join(__dirname, "..", "..", "uploads");
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const base = path_1.default
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "image";
        cb(null, `${base}-${Date.now()}${ext}`);
    },
});
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
exports.uploadImage = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (ALLOWED.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("Недопустимый формат. Разрешены JPG, PNG, WEBP, GIF."));
    },
});
//# sourceMappingURL=upload.middleware.js.map