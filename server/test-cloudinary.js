import env from './src/config/env.js';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function test() {
  try {
    const result = await cloudinary.v2.api.ping();
    console.log("Ping success:", result);
  } catch (error) {
    console.error("Ping error:", error);
  }
}

test();
