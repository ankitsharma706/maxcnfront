import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Multer disk storage configuration.
 * Files are stored in uploads/ with unique filenames.
 */
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

/**
 * File filter: only allow specified MIME types.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: PNG, JPG, JPEG, WEBP, CSV, XLSX`
      )
    );
  }
};

/**
 * Multer upload middleware configured for single file upload.
 */
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

/**
 * Middleware for chart image upload (single file, field name: 'chart')
 */
export const uploadChart = uploadMiddleware.single('chart');

/**
 * Middleware for option chain screenshot upload (single file, field name: 'optionChain')
 */
export const uploadOptionChain = uploadMiddleware.single('optionChain');

/**
 * Middleware for CSV/XLSX upload (single file, field name: 'file')
 */
export const uploadCsv = uploadMiddleware.single('file');
