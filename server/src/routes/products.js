import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/product.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, validate(createProductSchema), createProduct);
router.put('/:id', authenticate, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
