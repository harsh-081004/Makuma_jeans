import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { randomUUID } from 'crypto';
import env from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { sanitize } from './middleware/sanitize.js';
import { setupLogger } from './utils/logger.js';

// Route imports
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import inquiryRoutes from './routes/inquiries.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import lookbookRoutes from './routes/lookbook.js';

const app = express();

// ─── Trust Proxy (required for Render / reverse proxies) ───
app.set('trust proxy', 1);

// ─── Request ID Middleware ───
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// ─── HTTP Request Logger (Morgan) ───
setupLogger(app);

// ─── Security Middleware ───
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(apiLimiter);

// ─── Body Parsing ───
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── NoSQL Injection Sanitization ───
app.use(sanitize);

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MAKUMA API is running.',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ───
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/lookbook', lookbookRoutes);

// ─── 404 Handler ───
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler (must be last) ───
app.use(errorHandler);

export default app;
