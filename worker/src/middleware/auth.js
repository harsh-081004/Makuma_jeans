import { verify } from 'hono/jwt';

export const protect = async (c, next) => {
  let token;

  if (c.req.header('Authorization') && c.req.header('Authorization').startsWith('Bearer')) {
    token = c.req.header('Authorization').split(' ')[1];
  }

  if (!token) {
    return c.json({ success: false, message: 'Not authorized to access this route' }, 401);
  }

  try {
    const decoded = await verify(token, c.env.JWT_SECRET, 'HS256');
    c.set('user', decoded); // Set user info in context
    await next();
  } catch (error) {
    return c.json({ success: false, message: 'Not authorized to access this route' }, 401);
  }
};
