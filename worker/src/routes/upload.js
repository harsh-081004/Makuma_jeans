import { Hono } from 'hono';
import { protect } from '../middleware/auth.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinary.js';

const upload = new Hono();

// POST /api/upload
upload.post('/', protect, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['image'];

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, message: 'Please upload an image' }, 400);
    }

    const result = await uploadImageToCloudinary(file, c.env);

    return c.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// DELETE /api/upload
upload.delete('/', protect, async (c) => {
  try {
    const { publicId } = await c.req.json();
    if (!publicId) {
      return c.json({ success: false, message: 'publicId is required' }, 400);
    }
    
    await deleteImageFromCloudinary(publicId, c.env);
    
    return c.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default upload;
