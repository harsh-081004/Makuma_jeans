import mongoose from 'mongoose';
import env from './src/config/env.js';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

// Raw data from the frontend
const CATEGORIES = [
  { id: 'jeans', name: 'Wide Leg Jeans', count: 8, image: '/images/product-02.jpeg' },
  { id: 'embellished', name: 'Embellished Jeans', count: 5, image: '/images/product-06.jpeg' },
  { id: 'trousers', name: 'Trousers & Pants', count: 4, image: '/images/product-15.jpeg' },
  { id: 'palazzo', name: 'Linen Palazzo', count: 3, image: '/images/product-12.jpeg' },
];

const PRODUCTS = [
  {
    name: 'Sparkle Distressed Wide Leg',
    category: 'jeans',
    categoryLabel: 'Wide Leg Jeans',
    image: '/images/product-01.jpeg',
    badge: 'trending',
    sizes: ['26', '28', '30', '32', '34'],
    moq: 50,
    fabricDetails: '100% Premium Cotton Denim, Non-stretch',
    availableColors: ['Light Wash', 'Medium Wash'],
    bulkPricing: [
      { min: 50, max: 99, price: 650 },
      { min: 100, max: 249, price: 600 },
      { min: 250, max: null, price: 550 }
    ],
    description: 'Wholesale sparkle-distressed wide leg jeans. Featuring scattered rhinestone detailing and artful distressing. High-margin product for premium retail boutiques.',
  },
  {
    name: 'Classic Wide Leg Dark Denim',
    category: 'jeans',
    categoryLabel: 'Wide Leg Jeans',
    image: '/images/product-02.jpeg',
    badge: 'new',
    sizes: ['26', '28', '30', '32'],
    moq: 100,
    fabricDetails: '98% Cotton, 2% Elastane',
    availableColors: ['Dark Wash'],
    bulkPricing: [
      { min: 100, max: 299, price: 500 },
      { min: 300, max: null, price: 450 }
    ],
    description: 'A timeless staple. This dark wash wide-leg jean offers a perfect fit with slight stretch. Ideal for daily office wear or casual outings.',
  },
  {
    name: 'Pearl Embroidered Denim',
    category: 'embellished',
    categoryLabel: 'Embellished Jeans',
    image: '/images/product-04.jpeg',
    badge: null,
    sizes: ['28', '30', '32', '34', '36'],
    moq: 100,
    fabricDetails: 'Rigid Denim, Hand-stitched Pearls',
    availableColors: ['Dark Blue'],
    bulkPricing: [
      { min: 100, max: 249, price: 680 },
      { min: 250, max: null, price: 600 }
    ],
    description: 'Elegant leaf-pattern pearl embroidery on dark wash denim. Bulk supply with strict quality control. Unique offering for boutique stores.',
  },
  {
    name: 'Vintage Vine Embroidered',
    category: 'embellished',
    categoryLabel: 'Embellished Jeans',
    image: '/images/product-06.jpeg',
    badge: 'bestseller',
    sizes: ['26', '28', '30', '32', '34'],
    moq: 50,
    fabricDetails: '100% Cotton, Vintage Wash',
    availableColors: ['Vintage Blue'],
    bulkPricing: [
      { min: 50, max: 149, price: 700 },
      { min: 150, max: null, price: 650 }
    ],
    description: 'Cascading vine embroidery on a vintage wash base. Wholesale available with fast turnaround time directly from our Surat supply hub.',
  },
  {
    name: 'Linen Wide Palazzo',
    category: 'palazzo',
    categoryLabel: 'Linen Palazzo',
    image: '/images/product-12.jpeg',
    badge: 'trending',
    sizes: ['M', 'L', 'XL', 'XXL'],
    moq: 150,
    fabricDetails: 'Premium Linen Blend',
    availableColors: ['Beige', 'White', 'Olive'],
    bulkPricing: [
      { min: 150, max: 499, price: 450 },
      { min: 500, max: null, price: 390 }
    ],
    description: 'Breathable summer essential. High-waist linen palazzo pants featuring a comfortable elastic back and front pleats.',
  },
  {
    name: 'Studded Palazzo Denim',
    category: 'embellished',
    categoryLabel: 'Embellished Jeans',
    image: '/images/product-11.jpeg',
    badge: null,
    sizes: ['28', '30', '32', '34'],
    moq: 60,
    fabricDetails: 'Stretch Denim, Metal Studs',
    availableColors: ['Medium Blue'],
    bulkPricing: [
      { min: 60, max: 199, price: 720 },
      { min: 200, max: null, price: 660 }
    ],
    description: 'All-over scattered stud detailing on medium blue palazzo jeans. Wholesale direct pricing with volume discounts.',
  },
  {
    name: 'Formal Office Trousers',
    category: 'trousers',
    categoryLabel: 'Trousers & Pants',
    image: '/images/product-15.jpeg',
    badge: 'new',
    sizes: ['28', '30', '32', '34', '36', '38'],
    moq: 100,
    fabricDetails: 'Poly-Viscose Blend, Wrinkle-Free',
    availableColors: ['Black', 'Navy', 'Grey'],
    bulkPricing: [
      { min: 100, max: 299, price: 420 },
      { min: 300, max: null, price: 380 }
    ],
    description: 'Premium tailored formal trousers for women. Featuring a crisp front crease, side pockets, and a comfortable mid-rise fit.',
  },
  {
    name: 'Ice Blue Baggy Fit',
    category: 'jeans',
    categoryLabel: 'Wide Leg Jeans',
    image: '/images/product-13.jpeg',
    badge: 'trending',
    sizes: ['26', '28', '30', '32', '34'],
    moq: 100,
    fabricDetails: '100% Cotton Denim',
    availableColors: ['Ice Blue'],
    bulkPricing: [
      { min: 100, max: 299, price: 580 },
      { min: 300, max: null, price: 520 }
    ],
    description: 'The quintessential flare jean in a beautiful light wash. Consistent high-volume seller. Direct wholesale supplies available.',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 Cleared existing products and categories');

    // Insert categories
    const categoryDocs = [];
    for (const cat of CATEGORIES) {
      const doc = await Category.create({
        name: cat.name,
        slug: cat.id,
        image: cat.image,
      });
      categoryDocs.push(doc);
    }
    console.log(`📦 Seeded ${categoryDocs.length} categories`);

    // Insert products
    let productCount = 0;
    for (const prod of PRODUCTS) {
      // Find matching category ID
      const matchingCategory = categoryDocs.find(c => c.slug === prod.category);
      if (matchingCategory) {
        prod.category = matchingCategory._id;
        await Product.create(prod);
        productCount++;
      }
    }
    console.log(`👗 Seeded ${productCount} products`);

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDB();
