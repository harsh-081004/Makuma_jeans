import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';

const settings = new Hono();

// GET /api/settings
settings.get('/', async (c) => {
  try {
    const { Setting } = c.get('db');

    const data = await Setting.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      { upsert: true, new: true, lean: true }
    );

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// PUT /api/settings
settings.put('/', protect, async (c) => {
  try {
    const { Setting } = c.get('db');
    const body = await c.req.json();

    const updateFields = {};
    const allowedFields = ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroImage', 'heroImagePublicId'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields[field] = body[field];
      }
    }

    const data = await Setting.findOneAndUpdate(
      {},
      { $set: updateFields },
      { upsert: true, new: true, lean: true }
    );

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default settings;
