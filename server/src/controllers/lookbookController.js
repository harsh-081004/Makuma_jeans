import Lookbook from '../models/Lookbook.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/lookbook
 * List all lookbook items (public).
 */
export const listLookbook = async (req, res, next) => {
  try {
    const items = await Lookbook.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/lookbook
 * Create a new lookbook item. [Auth Required]
 */
export const createLookbook = async (req, res, next) => {
  try {
    const { title, image, imagePublicId, category, order } = req.body;
    const item = await Lookbook.create({
      title,
      image,
      imagePublicId: imagePublicId || null,
      category: category || '',
      order: order || 0,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/lookbook/:id
 * Update a lookbook item. [Auth Required]
 */
export const updateLookbook = async (req, res, next) => {
  try {
    const item = await Lookbook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      throw new AppError('Lookbook item not found.', 404);
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/lookbook/:id
 * Delete a lookbook item. [Auth Required]
 */
export const deleteLookbook = async (req, res, next) => {
  try {
    const item = await Lookbook.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new AppError('Lookbook item not found.', 404);
    }

    // Delete image from Cloudinary if it exists
    if (item.imagePublicId) {
      try { await cloudinary.uploader.destroy(item.imagePublicId); } catch (e) { /* ignore */ }
    }

    res.json({ success: true, message: 'Lookbook item deleted.' });
  } catch (error) {
    next(error);
  }
};
