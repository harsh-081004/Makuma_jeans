import env from '../config/env.js';
import AppError from '../utils/AppError.js';

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns clean JSON responses.
 * Never exposes stack traces in production.
 */
export default function errorHandler(err, req, res, next) {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log full error in development
  if (env.NODE_ENV === 'development') {
    console.error('─── Error ───');
    console.error(err.stack || err);
  }

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Mongoose duplicate key error → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // Mongoose bad ObjectId → 400
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
    });
  }

  // Multer file size error → 400
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.',
    });
  }

  // Multer unexpected field → 400
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.',
    });
  }

  // JWT errors → 401
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired.',
    });
  }

  // Cloudinary API / Auth Error → 500
  if (err.name === 'UnexpectedResponse' || (err.message && err.message.includes('Invalid cloud_name'))) {
    let cloudMsg = 'Cloudinary service error.';
    if (err.http_code === 401 || err.http_code === 403) {
      cloudMsg = 'Cloudinary authentication failed. Please check your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the .env file.';
    }
    return res.status(500).json({
      success: false,
      message: cloudMsg,
      ...(env.NODE_ENV === 'development' && { errorDetails: err.message }),
    });
  }

  // Operational errors (thrown via AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / programming errors — never expose details in production
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
