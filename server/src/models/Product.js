import mongoose from 'mongoose';

const bulkPricingSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, default: null },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    categoryLabel: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    badge: {
      type: String,
      enum: ['new', 'trending', 'bestseller', null],
      default: null,
    },
    sizes: {
      type: [String],
      default: [],
    },
    availableColors: {
      type: [String],
      default: [],
    },
    bulkPricing: {
      type: [bulkPricingSchema],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for fast queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
