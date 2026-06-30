import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/products
 * List all active products. Supports ?category=id&search=term&page=1&limit=20
 */
export const listProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Get a single product by ID.
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create a new product. [Auth Required]
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    const populated = await product.populate('category', 'name slug');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update a product. [Auth Required]
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product and its Cloudinary image. [Auth Required]
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    // Delete image from Cloudinary if we have a public ID
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};
