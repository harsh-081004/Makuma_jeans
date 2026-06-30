import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/categories
 * List all categories with product counts.
 */
export const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('productCount')
      .sort({ name: 1 })
      .lean({ virtuals: true });

    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:slug
 * Get a single category by slug.
 */
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('productCount')
      .lean({ virtuals: true });

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 * Create a new category. [Auth Required]
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, image, imagePublicId } = req.body;

    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: image || '',
      imagePublicId: imagePublicId || null,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/categories/:id
 * Update a category. [Auth Required]
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/categories/:id
 * Delete a category. [Auth Required]
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    // Delete image from Cloudinary if it exists
    if (category.imagePublicId) {
      try { await cloudinary.uploader.destroy(category.imagePublicId); } catch (e) { /* ignore */ }
    }

    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};
