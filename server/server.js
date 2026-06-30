import app from './src/app.js';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';

const PORT = env.PORT || 5000;

async function start() {
  // Connect to MongoDB
  await connectDB();

  // Start server
  app.listen(PORT, () => {
    console.log(`\n🚀 MAKUMA API Server`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   Port:        ${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health`);
    console.log(`   Frontend:    ${env.FRONTEND_URL}\n`);
  });
}

start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! 💥 Shutting down...');
  
  if (err.name === 'UnexpectedResponse' || (err.message && err.message.includes('Invalid cloud_name'))) {
    console.error('\n☁️ CLOUDINARY CONFIGURATION ERROR');
    console.error('Your Cloudinary API credentials in the .env file are incorrect or mismatched.');
    console.error('Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET all belong to the same account and have no extra spaces.');
    console.error(`Status code: ${err.http_code}\n`);
  } else {
    console.error(err.name, err.message);
  }
  
  // Give the server time to finish pending requests before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
