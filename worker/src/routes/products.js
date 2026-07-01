import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';
import { deleteImageFromCloudinary } from '../utils/cloudinary.js';

const products = new Hono();

// GET /api/products
products.get('/', async (c) => {
  try {
    const { Product } = c.get('db');
    const { category, search, page = '1', limit = '20' } = c.req.query();

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    return c.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// GET /api/products/:id
products.get('/:id', async (c) => {
  try {
    const { Product } = c.get('db');
    const product = await Product.findById(c.req.param('id'))
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return c.json({ success: false, message: 'Product not found.' }, 404);
    }

    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// POST /api/products
products.post('/', protect, async (c) => {
  try {
    const { Product } = c.get('db');
    const body = await c.req.json();
    const product = await Product.create(body);
    const populated = await product.populate('category', 'name slug');

    return c.json({ success: true, data: populated }, 201);
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// PUT /api/products/:id
products.put('/:id', protect, async (c) => {
  try {
    const { Product } = c.get('db');
    const body = await c.req.json();
    const product = await Product.findByIdAndUpdate(c.req.param('id'), body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return c.json({ success: false, message: 'Product not found.' }, 404);
    }

    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// DELETE /api/products/:id
products.delete('/:id', protect, async (c) => {
  try {
    const { Product } = c.get('db');
    const product = await Product.findById(c.req.param('id'));

    if (!product) {
      return c.json({ success: false, message: 'Product not found.' }, 404);
    }

    if (product.imagePublicId) {
      await deleteImageFromCloudinary(product.imagePublicId, c.env);
    }

    await Product.findByIdAndDelete(c.req.param('id'));
    return c.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default products;
