import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listLookbook, createLookbook, updateLookbook, deleteLookbook } from '../controllers/lookbookController.js';

const router = Router();

router.get('/', listLookbook);
router.post('/', authenticate, createLookbook);
router.put('/:id', authenticate, updateLookbook);
router.delete('/:id', authenticate, deleteLookbook);

export default router;
