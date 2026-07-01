import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';
import { deleteImageFromCloudinary } from '../utils/cloudinary.js';

const lookbook = new Hono();

// GET /api/lookbook
lookbook.get('/', async (c) => {
  try {
    const { Lookbook } = c.get('db');
    const items = await Lookbook.find().sort({ order: 1, createdAt: -1 }).lean();
    return c.json({ success: true, data: items });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// POST /api/lookbook
lookbook.post('/', protect, async (c) => {
  try {
    const { Lookbook } = c.get('db');
    const { title, image, imagePublicId, category, order } = await c.req.json();
    const item = await Lookbook.create({
      title, image,
      imagePublicId: imagePublicId || null,
      category: category || '',
      order: order || 0,
    });
    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// PUT /api/lookbook/:id
lookbook.put('/:id', protect, async (c) => {
  try {
    const { Lookbook } = c.get('db');
    const body = await c.req.json();
    const item = await Lookbook.findByIdAndUpdate(c.req.param('id'), body, {
      new: true, runValidators: true,
    });
    if (!item) {
      return c.json({ success: false, message: 'Lookbook item not found.' }, 404);
    }
    return c.json({ success: true, data: item });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// DELETE /api/lookbook/:id
lookbook.delete('/:id', protect, async (c) => {
  try {
    const { Lookbook } = c.get('db');
    const item = await Lookbook.findByIdAndDelete(c.req.param('id'));
    if (!item) {
      return c.json({ success: false, message: 'Lookbook item not found.' }, 404);
    }

    if (item.imagePublicId) {
      try { await deleteImageFromCloudinary(item.imagePublicId, c.env); } catch (e) { /* ignore */ }
    }

    return c.json({ success: true, message: 'Lookbook item deleted.' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default lookbook;
