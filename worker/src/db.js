// Per-request MongoDB connections for Cloudflare Workers.
// CF Workers forbids sharing I/O objects (like DB connections) between requests.
// Each request gets its own connection via createConnection(), closed after use.

let _mongoose = null;
let _schemasRegistered = false;

async function ensureMongoose() {
  if (!_mongoose) {
    const mod = await import('mongoose');
    _mongoose = mod.default;
  }
  return _mongoose;
}

function registerSchemas(conn) {
  const { Schema } = _mongoose;

  if (conn.models.Admin) return; // Already registered on this connection

  conn.model('Admin', new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'admin' },
  }, { timestamps: true }));

  const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    categoryLabel: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: null },
    images: [{ url: String, publicId: String }],
    badge: { type: String, default: '' },
    sizes: [String],
    moq: { type: Number, default: 1 },
    fabricDetails: { type: String, default: '' },
    availableColors: [String],
    bulkPricing: [{ min: Number, max: Number, price: Number }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true });
  conn.model('Product', productSchema);

  const catSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: null },
  }, { timestamps: true });
  catSchema.virtual('productCount', {
    ref: 'Product', localField: '_id', foreignField: 'category', count: true,
  });
  catSchema.set('toJSON', { virtuals: true });
  catSchema.set('toObject', { virtuals: true });
  conn.model('Category', catSchema);

  conn.model('Inquiry', new Schema({
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  }, { timestamps: true }));

  conn.model('Setting', new Schema({
    heroTitle: { type: String, default: 'Redefining\nLadies Denim' },
    heroSubtitle: { type: String, default: "Surat's Premium Wholesaler" },
    heroDescription: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    heroImagePublicId: { type: String, default: null },
  }, { timestamps: true }));

  conn.model('Lookbook', new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: null },
    category: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }, { timestamps: true }));
}

let cachedConn = null;

// Reuses the connection across requests to dramatically improve performance
export async function connectDB(mongoUri) {
  if (cachedConn && cachedConn.readyState === 1) {
    return {
      conn: cachedConn,
      Admin: cachedConn.models.Admin,
      Product: cachedConn.models.Product,
      Category: cachedConn.models.Category,
      Inquiry: cachedConn.models.Inquiry,
      Setting: cachedConn.models.Setting,
      Lookbook: cachedConn.models.Lookbook,
    };
  }

  const mongoose = await ensureMongoose();

  // if a connection is already initializing, we don't want to create multiple
  if (mongoose.connection && mongoose.connection.readyState === 1) {
     cachedConn = mongoose.connection;
  } else {
     const conn = mongoose.createConnection(mongoUri, {
       bufferCommands: false,
       maxPoolSize: 10,
       minPoolSize: 1,
       serverSelectionTimeoutMS: 5000,
       socketTimeoutMS: 45000,
     });
     conn.setMaxListeners(50);
     await conn.asPromise();
     cachedConn = conn;
  }

  registerSchemas(cachedConn);

  return {
    conn: cachedConn,
    Admin: cachedConn.models.Admin,
    Product: cachedConn.models.Product,
    Category: cachedConn.models.Category,
    Inquiry: cachedConn.models.Inquiry,
    Setting: cachedConn.models.Setting,
    Lookbook: cachedConn.models.Lookbook,
  };
}
