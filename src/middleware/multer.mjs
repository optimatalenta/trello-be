import fs from "fs";
import multer from "multer";
import path from "path";
import { CustomError } from "../errors/index.mjs";

const uploadDir = path.join(process.cwd(), "uploadedFile");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  throw new CustomError(
    500,
    "Failed to create a directory to store files",
    error
  );
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
