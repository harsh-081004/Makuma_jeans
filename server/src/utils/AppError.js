/**
 * Custom application error class.
 * Provides structured error responses with status codes.
 *
 * Usage:
 *   throw new AppError('Resource not found', 404);
 *   throw new AppError('Validation failed', 422);
 */
export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
