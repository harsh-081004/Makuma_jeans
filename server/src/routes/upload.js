import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadSingle, uploadMultiple, deleteImage } from '../controllers/uploadController.js';

const router = Router();

router.post('/', authenticate, uploadLimiter, upload.single('image'), uploadSingle);
router.post('/multiple', authenticate, uploadLimiter, upload.array('images', 5), uploadMultiple);
router.delete('/:publicId', authenticate, deleteImage);

export default router;
