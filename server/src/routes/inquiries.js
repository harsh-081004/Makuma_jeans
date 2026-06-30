import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createInquirySchema, updateInquiryStatusSchema } from '../validators/inquiry.js';
import { submitInquiry, listInquiries, updateStatus, deleteInquiry } from '../controllers/inquiryController.js';

const router = Router();

router.post('/', validate(createInquirySchema), submitInquiry);
router.get('/', authenticate, listInquiries);
router.patch('/:id/status', authenticate, validate(updateInquiryStatusSchema), updateStatus);
router.delete('/:id', authenticate, deleteInquiry);

export default router;
