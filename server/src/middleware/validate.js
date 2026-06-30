/**
 * Zod validation middleware factory.
 * Validates req.body against a Zod schema.
 *
 * Usage: router.post('/products', validate(createProductSchema), handler)
 */
export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    // Replace req.body with parsed (and transformed) data
    req.body = result.data;
    next();
  };
}
