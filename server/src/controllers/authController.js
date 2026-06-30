import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

/**
 * POST /api/auth/login
 * Admin login. Returns JWT token.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateToken(admin);

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Create a new admin. [Auth Required — superadmin only]
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const admin = await Admin.create({ username, email, password, role });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current admin profile. [Auth Required]
 */
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId).lean();

    if (!admin) {
      throw new AppError('Admin not found.', 404);
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/setup
 * One-time initial superadmin creation.
 * Only works if no admins exist in the database.
 */
export const setup = async (req, res, next) => {
  try {
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Setup already completed. Use /login instead.',
      });
    }

    const { username, email, password } = req.body;

    const admin = await Admin.create({
      username,
      email,
      password,
      role: 'superadmin',
    });

    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      message: 'Superadmin created successfully.',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
