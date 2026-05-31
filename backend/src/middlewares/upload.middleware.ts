import multer from "multer";
import path from "path";
import fs from "fs";

// dist/middlewares -> ../../uploads = backend/uploads (совпадает с express.static в app.ts)
const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base =
      path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "image";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Недопустимый формат. Разрешены JPG, PNG, WEBP, GIF."));
  },
});
