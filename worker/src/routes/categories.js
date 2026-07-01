import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';
import { deleteImageFromCloudinary } from '../utils/cloudinary.js';

const categories = new Hono();

// GET /api/categories
categories.get('/', async (c) => {
  try {
    const { Category } = c.get('db');
    const cats = await Category.find()
      .populate('productCount')
      .sort({ name: 1 })
      .lean({ virtuals: true });

    return c.json({ success: true, data: cats });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// GET /api/categories/:slug
categories.get('/:slug', async (c) => {
  try {
    const { Category } = c.get('db');
    const category = await Category.findOne({ slug: c.req.param('slug') })
      .populate('productCount')
      .lean({ virtuals: true });

    if (!category) {
      return c.json({ success: false, message: 'Category not found.' }, 404);
    }

    return c.json({ success: true, data: category });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// POST /api/categories
categories.post('/', protect, async (c) => {
  try {
    const { Category } = c.get('db');
    const { name, image, imagePublicId } = await c.req.json();

    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: image || '',
      imagePublicId: imagePublicId || null,
    });

    return c.json({ success: true, data: category }, 201);
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// PUT /api/categories/:id
categories.put('/:id', protect, async (c) => {
  try {
    const { Category } = c.get('db');
    const body = await c.req.json();
    const category = await Category.findByIdAndUpdate(
      c.req.param('id'),
      body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return c.json({ success: false, message: 'Category not found.' }, 404);
    }

    return c.json({ success: true, data: category });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// DELETE /api/categories/:id
categories.delete('/:id', protect, async (c) => {
  try {
    const { Category } = c.get('db');
    const category = await Category.findByIdAndDelete(c.req.param('id'));

    if (!category) {
      return c.json({ success: false, message: 'Category not found.' }, 404);
    }

    if (category.imagePublicId) {
      try { await deleteImageFromCloudinary(category.imagePublicId, c.env); } catch (e) { /* ignore */ }
    }

    return c.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default categories;
