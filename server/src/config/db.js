import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connect to MongoDB Atlas with auto-reconnect and connection pooling.
 * Includes graceful shutdown handling.
 */
export default async function connectDB() {
  const options = {
    maxPoolSize: 10,         // Maximum number of connections in the pool
    minPoolSize: 2,          // Minimum number of connections
    serverSelectionTimeoutMS: 5000, // Timeout for initial connection
    socketTimeoutMS: 45000,  // Socket timeout
    family: 4,               // Use IPv4
  };

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, options);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  // ─── Connection Event Listeners ───
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected successfully.');
  });

  // ─── Graceful Shutdown ───
  const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 ${signal} received. Closing MongoDB connection...`);
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
