import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/auth.js';

const auth = new Hono();

const generateToken = async (id, secret) => {
  return await sign(
    { id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
    secret
  );
};

// POST /api/auth/login
auth.post('/login', async (c) => {
  try {
    const { Admin } = c.get('db');
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ success: false, message: 'Please provide username and password' }, 400);
    }

    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401);
    }

    const token = await generateToken(admin._id.toString(), c.env.JWT_SECRET);

    return c.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, username: admin.username, role: admin.role },
      },
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// GET /api/auth/me
auth.get('/me', protect, async (c) => {
  try {
    const { Admin } = c.get('db');
    const user = c.get('user');
    const admin = await Admin.findById(user.id);

    if (!admin) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      data: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default auth;
