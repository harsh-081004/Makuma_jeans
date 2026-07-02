import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import inquiryRoutes from './routes/inquiries.js';
import uploadRoutes from './routes/upload.js';
import settingsRoutes from './routes/settings.js';
import lookbookRoutes from './routes/lookbook.js';

const app = new Hono();

// ─── CORS ───
app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_URL || '*';
  const middleware = cors({
    origin,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  });
  return middleware(c, next);
});

// ─── Auto-Connect & Disconnect DB Middleware ───
// CF Workers requires isolated I/O objects per request.
// We connect, attach to context, and reliably close after each request.
app.use('/api/*', async (c, next) => {
  // Don't connect to DB on CORS preflight requests
  if (c.req.method === 'OPTIONS') {
    return next();
  }

  // Skip DB for health check and upload routes (they don't need it, or handle it differently)
  if (c.req.path.startsWith('/api/health') || c.req.path.startsWith('/api/upload')) {
    return next();
  }

  const db = await connectDB(c.env.MONGODB_URI);
  c.set('db', db);

  try {
    await next();
  } finally {
    if (db && db.conn && db.conn.readyState !== 0) {
      try { await db.conn.close(); } catch(e) { /* ignore */ }
    }
  }
});

// ─── Health Check ───
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'MAKUMA CF Worker API is running.',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.route('/api/auth', authRoutes);
app.route('/api/products', productRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/inquiries', inquiryRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/settings', settingsRoutes);
app.route('/api/lookbook', lookbookRoutes);

// ─── 404 Handler ───
app.all('/api/*', (c) => {
  return c.json({ success: false, message: `Route ${c.req.path} not found.` }, 404);
});
// ─── Global Error Handler ───
app.onError((err, c) => {
  console.error(`[Global Error]`, err);
  
  // Safely fallback to a generic message to prevent exposing secrets
  // Cloudflare Workers will sometimes expose the entire env object or connection strings
  // if you directly return the error to the client.
  return c.json({
    success: false,
    message: 'An unexpected internal server error occurred.'
  }, 500);
});

export default app;
