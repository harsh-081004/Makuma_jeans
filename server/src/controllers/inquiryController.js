import Inquiry from '../models/Inquiry.js';
import AppError from '../utils/AppError.js';

/**
 * POST /api/inquiries
 * Submit a wholesale inquiry. [Public]
 */
export const submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you shortly.',
      data: { id: inquiry._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/inquiries
 * List all inquiries. [Auth Required]
 * Supports ?status=new&page=1&limit=20
 */
export const listInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: inquiries,
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
 * PATCH /api/inquiries/:id/status
 * Update inquiry status. [Auth Required]
 */
export const updateStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!inquiry) {
      throw new AppError('Inquiry not found.', 404);
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/inquiries/:id
 * Delete an inquiry. [Auth Required]
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      throw new AppError('Inquiry not found.', 404);
    }

    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    next(error);
  }
};
