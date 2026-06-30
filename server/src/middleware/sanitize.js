import mongoSanitize from 'express-mongo-sanitize';

/**
 * NoSQL injection sanitization middleware.
 * Strips out `$` and `.` characters from req.body, req.query, and req.params
 * to prevent MongoDB operator injection attacks.
 *
 * Example attack this prevents:
 *   POST /api/auth/login { username: { "$gt": "" }, password: { "$gt": "" } }
 */
export const sanitize = (req, res, next) => {
  ['body', 'params', 'query'].forEach((key) => {
    if (req[key]) {
      const sanitized = mongoSanitize.sanitize(req[key], { replaceWith: '_' });
      try {
        req[key] = sanitized;
      } catch (e) {
        // Express 5 makes req.query a getter, so reassignment throws.
        // We can override it with Object.defineProperty
        Object.defineProperty(req, key, {
          value: sanitized,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }
  });
  next();
};
