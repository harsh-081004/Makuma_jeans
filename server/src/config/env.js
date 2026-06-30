import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Accept both MONGODB_URI and MONGO_URI for flexibility
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

function validateEnv() {
  // Support MONGO_URI as an alias for MONGODB_URI
  if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
    process.env.MONGODB_URI = process.env.MONGO_URI;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.issues.forEach((issue) => {
      console.error(`   → ${issue.path.join('.')}: ${issue.message}`);
    });
    console.error('\n   Copy .env.example to .env and fill in the values.\n');
    process.exit(1);
  }

  // Warn if FRONTEND_URL is localhost in production
  if (result.data.NODE_ENV === 'production' && result.data.FRONTEND_URL.includes('localhost')) {
    console.warn('⚠️  FRONTEND_URL is set to localhost in production mode.');
    console.warn('   Set it to your deployed frontend URL (e.g., https://makuma.vercel.app)');
  }

  return result.data;
}

const env = validateEnv();

export default env;
