#DRIVE PROJECT LINK
https://drive.google.com/drive/folders/1lsoqkI3ZT3yD0knGDZmxD1JPfB5J2ll0?usp=drive_link



# ShopEZ - Production-Ready Full-Stack MERN E-Commerce Application

ShopEZ is a feature-complete, modern full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application. Built with clean architecture, JWT role-based authentication, interactive Chart.js admin analytics, wishlist, cart drawer, quick view modal, multi-step checkout, order tracking, and product reviews.

---

## 🌟 Key Features

### User Features
- **Authentication**: User Registration, Login, Logout, Profile Management, and Password Updates.
- **Product Discovery**: Dynamic product search, category filtering, brand filtering, price sliders, star rating filtering, and sorting (price low-high, high-low, newest, top rated).
- **Product Details & Quick View**: High-resolution image preview, discount badges, stock indicators, customer reviews list, review submission, and quick view modal preview.
- **Shopping Cart & Cart Drawer**: Real-time quantity controls, subtotal calculation, free shipping progress bar, promo code applicator (`SHOPEZ20`), and database synchronization.
- **Wishlist**: Save favorite items, remove items, and move items directly into cart.
- **Checkout & Orders**: Multi-step checkout with address validation, choice of Cash on Delivery / Demo Online Payment, order invoice generation, and order history tracking.

### Admin Features
- **Admin Analytics Dashboard**: Metric cards for Total Revenue, Total Orders, Total Products, Total Users, and visual Chart.js graphs for Monthly Revenue Trends, Category Distribution, and Order Status breakdown.
- **Product CRUD**: Add new products, update existing product attributes, adjust stock, or delete products.
- **Order Management**: View all customer orders and update status (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled).
- **User Role Administration**: View registered user accounts, toggle user roles (USER ↔ ADMIN), or delete user accounts.
- **Review Moderation**: Inspect all customer reviews across products and delete inappropriate content.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router DOM v6, Axios, Bootstrap 5, Bootstrap Icons, Chart.js, react-chartjs-2, Vite.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), bcryptjs, CORS, dotenv.

---

## 📁 Project Structure

```
shopez/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── wishlistRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── package.json
│   ├── seeder.js
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AdminRoute.jsx
    │   │   ├── AlertMessage.jsx
    │   │   ├── CartDrawer.jsx
    │   │   ├── DealsTicker.jsx
    │   │   ├── Footer.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── QuickViewModal.jsx
    │   │   └── Rating.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── WishlistContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── AdminOrdersPage.jsx
    │   │   ├── AdminProductFormPage.jsx
    │   │   ├── AdminProductsPage.jsx
    │   │   ├── AdminReviewsPage.jsx
    │   │   ├── AdminUsersPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── MyOrdersPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── OrderConfirmationPage.jsx
    │   │   ├── OrderDetailsPage.jsx
    │   │   ├── ProductDetailsPage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── WishlistPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@shopez.com` | `admin123` |
| **Regular User** | `user@shopez.com` | `user123` |

---

## 💻 Local Development Instructions

### 1. Backend Setup
```bash
cd backend
npm install
node seeder.js   # Populates MongoDB Atlas/Local DB with 128 products, users, & sample orders
npm start        # Starts Express server at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Launches Vite React client at http://localhost:3000
```

---

## ☁️ Permanent Production Cloud Deployment Instructions

### 1. Backend Deployment (Render)
- **Repository**: `https://github.com/muzammil-2005/shopEZ_project.git`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`
- **Environment Variables**:
  - `MONGODB_URI`: `mongodb+srv://nmuzammil2005_db_user:muzammil123@cluster0.trjuqqz.mongodb.net/shopez_db?retryWrites=true&w=majority`
  - `JWT_SECRET`: `shopez_super_secret_jwt_key_2026_production_ready`
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: `https://shopez-storefront.vercel.app`

### 2. Frontend Deployment (Vercel)
- **Repository**: `https://github.com/muzammil-2005/shopEZ_project.git`
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://shopez-project-t6iy.onrender.com`

---

## 🌐 API Overview

- `GET /api/health` - Backend health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Fetch products with query filters (search, category, brand, price, rating, sort, pagination)
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Edit product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId` - Shopping Cart operations
- `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:productId` - Wishlist operations
- `POST /api/orders` - Place order & reduce stock
- `GET /api/orders/myorders` - User order history
- `GET /api/admin/stats` - Admin Analytics Dashboard summary & Chart.js data
- `GET /api/admin/orders`, `PUT /api/admin/orders/:id` - Order status updates (Admin)
- `GET /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id` - User administration (Admin)
- `DELETE /api/reviews/:id` - Review moderation (Admin)
