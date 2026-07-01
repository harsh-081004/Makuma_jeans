import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';

const inquiries = new Hono();

// POST /api/inquiries (Public)
inquiries.post('/', async (c) => {
  try {
    const { Inquiry } = c.get('db');
    const body = await c.req.json();
    const inquiry = await Inquiry.create(body);

    return c.json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you shortly.',
      data: { id: inquiry._id },
    }, 201);
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// GET /api/inquiries (Auth)
inquiries.get('/', protect, async (c) => {
  try {
    const { Inquiry } = c.get('db');
    const { status, page = '1', limit = '20' } = c.req.query();

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Inquiry.countDocuments(filter),
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

// PATCH /api/inquiries/:id/status (Auth)
inquiries.patch('/:id/status', protect, async (c) => {
  try {
    const { Inquiry } = c.get('db');
    const { status: newStatus } = await c.req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(
      c.req.param('id'),
      { status: newStatus },
      { new: true }
    );

    if (!inquiry) {
      return c.json({ success: false, message: 'Inquiry not found.' }, 404);
    }

    return c.json({ success: true, data: inquiry });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// DELETE /api/inquiries/:id (Auth)
inquiries.delete('/:id', protect, async (c) => {
  try {
    const { Inquiry } = c.get('db');
    const inquiry = await Inquiry.findByIdAndDelete(c.req.param('id'));

    if (!inquiry) {
      return c.json({ success: false, message: 'Inquiry not found.' }, 404);
    }

    return c.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default inquiries;
