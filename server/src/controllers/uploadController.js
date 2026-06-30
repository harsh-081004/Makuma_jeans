import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

/**
 * POST /api/upload
 * Upload a single image to Cloudinary. [Auth Required]
 */
export const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided.',
    });
  }

  res.status(201).json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
};

/**
 * POST /api/upload/multiple
 * Upload up to 5 images. [Auth Required]
 */
export const uploadMultiple = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No image files provided.',
    });
  }

  const uploaded = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
    size: file.size,
  }));

  res.status(201).json({ success: true, data: uploaded });
};

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary. [Auth Required]
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      throw new AppError('No publicId provided.', 400);
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted from Cloudinary.' });
  } catch (error) {
    next(error);
  }
};
