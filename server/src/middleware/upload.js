import multer from 'multer';
import { storage } from '../config/cloudinary.js';

/**
 * Multer upload middleware configured with Cloudinary storage.
 * - Max file size: 5MB
 * - Only image files allowed
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  },
});

export default upload;
