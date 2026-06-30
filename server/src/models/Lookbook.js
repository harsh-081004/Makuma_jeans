import mongoose from 'mongoose';

const lookbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Lookbook', lookbookSchema);
