# MAKUMA — Premium Ladies Bottoms | Wholesale B2B Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for wholesale B2B denim and ladies bottom wear. Built with production-level security, Cloudinary image management, and deployment-ready configurations for **Vercel** (frontend) and **Render** (backend).

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 8 | Build Tool & Dev Server |
| React Router DOM 7 | Client-side Routing |
| Axios | HTTP Client |
| Framer Motion | Animations |
| Lucide React | Icon Library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web Framework |
| Mongoose 8 | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password Hashing |
| Helmet | Security Headers |
| CORS | Cross-Origin Resource Sharing |
| Morgan | HTTP Request Logging |
| Zod | Request Validation |
| express-mongo-sanitize | NoSQL Injection Prevention |
| express-rate-limit | Rate Limiting |
| Cloudinary + Multer | Image Upload & Storage |

### Database & Hosting
| Service | Tier |
|---------|------|
| MongoDB Atlas | Free M0 Cluster |
| Vercel | Free (Frontend) |
| Render | Free (Backend) |
| Cloudinary | Free (Image CDN) |

---

## 📁 Project Structure

```
MAKUMA/
├── public/                  # Static assets (images, logo)
├── src/                     # React frontend
│   ├── components/          # Reusable UI components
│   │   ├── Categories.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Sections.jsx
│   ├── pages/               # Page components
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── About.jsx
│   │   ├── Collections.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Lookbook.jsx
│   │   ├── NotFound.jsx
│   │   └── ProductDetail.jsx
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── data/                # Static data (brand info)
│   │   └── products.js
│   ├── hooks.js             # Custom React hooks
│   ├── index.css            # Global styles
│   ├── App.jsx              # Root component with routing
│   └── main.jsx             # Entry point
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── inquiryController.js
│   │   │   ├── lookbookController.js
│   │   │   ├── productController.js
│   │   │   ├── settingsController.js
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── sanitize.js
│   │   │   ├── upload.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── Category.js
│   │   │   ├── Inquiry.js
│   │   │   ├── Lookbook.js
│   │   │   ├── Product.js
│   │   │   └── Setting.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── categories.js
│   │   │   ├── inquiries.js
│   │   │   ├── lookbook.js
│   │   │   ├── products.js
│   │   │   ├── settings.js
│   │   │   └── upload.js
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   └── logger.js
│   │   ├── validators/
│   │   │   ├── auth.js
│   │   │   ├── inquiry.js
│   │   │   └── product.js
│   │   └── app.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── render.yaml
```

---

## 🔧 Local Development Setup

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB Atlas** free cluster (or local MongoDB)
- **Cloudinary** free account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/makuma.git
cd makuma
```

### 2. Setup Backend

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual values (MongoDB URI, JWT Secret, Cloudinary keys)

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

The backend runs at `http://localhost:5001`.

### 3. Setup Frontend

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create environment file (optional for local dev)
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 4. First-Time Admin Setup

Navigate to `http://localhost:5173/admin/login?setup=true` to create your first superadmin account.

---

## 🔐 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens (min 16 chars) | ✅ |
| `JWT_EXPIRES_IN` | Token expiration (e.g., `7d`) | ❌ (default: `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `PORT` | Server port | ❌ (default: `5000`) |
| `NODE_ENV` | Environment (`development` / `production`) | ❌ (default: `development`) |
| `FRONTEND_URL` | Allowed CORS origin | ❌ (default: `http://localhost:5173`) |

### Frontend (`.env` or Vercel Dashboard)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | ✅ |

---

## 🚀 Deployment Guide

### Step 1: MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free **M0 cluster**
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs — required for Render)
5. Get your **connection string** from **Connect → Drivers**
6. Replace `<password>` in the URI with your database user's password

### Step 2: Render (Backend)

1. Push your code to **GitHub**
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `makuma-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Add **Environment Variables** (from the table above):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a strong random string
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
   - `FRONTEND_URL` = `https://your-app.vercel.app`
7. Deploy! Your API will be at `https://makuma-api.onrender.com`

### Step 3: Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variable**:
   - `VITE_API_URL` = `https://makuma-api.onrender.com/api`
6. Deploy! Your site will be at `https://your-app.vercel.app`

### Step 4: Update CORS

After both are deployed, go back to Render and update:
- `FRONTEND_URL` = `https://your-app.vercel.app`

---

## 🔑 API Reference

All endpoints return consistent JSON:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login |
| POST | `/api/auth/register` | 🔐 superadmin | Create new admin |
| GET | `/api/auth/me` | 🔐 | Get current profile |
| POST | `/api/auth/setup` | ❌ | One-time superadmin setup |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List products (supports `?category=&search=&page=&limit=`) |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | 🔐 | Create product |
| PUT | `/api/products/:id` | 🔐 | Update product |
| DELETE | `/api/products/:id` | 🔐 | Delete product + Cloudinary image |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | ❌ | List all categories |
| GET | `/api/categories/:slug` | ❌ | Get category by slug |
| POST | `/api/categories` | 🔐 | Create category |
| PUT | `/api/categories/:id` | 🔐 | Update category |
| DELETE | `/api/categories/:id` | 🔐 | Delete category |

### Inquiries
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/inquiries` | ❌ | Submit wholesale inquiry |
| GET | `/api/inquiries` | 🔐 | List all inquiries |
| PATCH | `/api/inquiries/:id/status` | 🔐 | Update inquiry status |
| DELETE | `/api/inquiries/:id` | 🔐 | Delete inquiry |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | 🔐 | Upload single image |
| POST | `/api/upload/multiple` | 🔐 | Upload up to 5 images |
| DELETE | `/api/upload/:publicId` | 🔐 | Delete image from Cloudinary |

### Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/settings` | ❌ | Get site settings |
| PUT | `/api/settings` | 🔐 | Update site settings |

### Lookbook
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/lookbook` | ❌ | List lookbook items |
| POST | `/api/lookbook` | 🔐 | Create lookbook item |
| PUT | `/api/lookbook/:id` | 🔐 | Update lookbook item |
| DELETE | `/api/lookbook/:id` | 🔐 | Delete lookbook item |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Health check |

---

## 🛡️ Security Features

- **JWT Authentication** — Token-based auth with configurable expiration
- **bcrypt Password Hashing** — 12 salt rounds
- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricted to frontend domain only
- **Rate Limiting** — API: 100/15min, Auth: 5/15min, Upload: 20/15min
- **Zod Validation** — Schema-based request validation
- **NoSQL Injection Prevention** — `express-mongo-sanitize` strips `$` operators
- **Input Sanitization** — All user inputs sanitized before processing
- **Body Size Limits** — 10KB JSON body limit
- **File Type Validation** — Only JPEG, PNG, WebP images allowed (max 5MB)
- **Error Hiding** — Stack traces never exposed in production
- **Environment Validation** — Server won't start with missing/invalid env vars
- **Request Tracing** — Unique `X-Request-Id` header on every response
- **Morgan Logging** — HTTP request logs (console in dev, file in production)
- **Protected Routes** — Admin routes require valid JWT
- **Role-Based Access** — Admin vs Superadmin permissions
- **Graceful Shutdown** — MongoDB connections closed properly on SIGINT/SIGTERM

---

## 📄 License

This project is proprietary. All rights reserved.

---

**Made with ❤️ in Surat, Gujarat, India**
