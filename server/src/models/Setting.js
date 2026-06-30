import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Redefining\\nLadies Denim" },
    heroSubtitle: { type: String, default: "Surat's Premium Wholesaler" },
    heroDescription: { type: String, default: "Supply your boutique with our premium collection of wide-leg jeans, trousers, and palazzos. Exceptional quality at unbeatable wholesale pricing." },
    heroImage: { type: String, default: '' },
    heroImagePublicId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
