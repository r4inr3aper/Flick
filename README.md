# 🍔 Flick — Food Delivery App

![Website Preview](./ui.png)

A full-stack food delivery platform built with the MERN stack. Features a responsive customer interface, admin panel, and secure backend API.

## 🚀 Tech Stack

**Frontend:** React.js, SCSS, React Router, Axios, Vite
**Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt
**Security:** Rate limiting, CORS, input sanitization

## 🛠 Quick Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation

1. **Clone & Install**
```bash
git clone https://github.com/r4inr3aper/Flick.git
cd Flick
```

2. **Backend**
```bash
cd backend
pnpm install
cp .env.example .env  # Add your MongoDB URI and JWT secret
pnpm run dev
```

3. **Frontend**
```bash
cd ../frontend
pnpm install
pnpm run dev
```

4. **Admin Panel**
```bash
cd ../admin
pnpm install
pnpm run dev
```

### Environment Variables
```env
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flick
NODE_ENV=development
PORT=3000
```

## 🌐 Live Demo
- **Frontend**: https://flick-puce.vercel.app
- **Admin Panel**: https://flick-admin.vercel.app/add
- **API**: https://flick-be.onrender.com

## ✨ Features

### Customer
- Browse food by categories
- Search & filter items
- Shopping cart with promo codes
- User authentication & guest access
- Order tracking
- Responsive design

### Admin
- Food item management
- Order status updates
- Promo code creation
- Image uploads
- Real-time notifications

### Security
- JWT authentication
- Password hashing
- Rate limiting
- XSS protection
- CORS security

## 📱 Routes

**Customer:** `/` (home), `/search`, `/Cart`, `/Order`, `/MyOrders`, `/contact`
**Admin:** `/add`, `/list`, `/order`, `/promo`

## 🗄️ API Endpoints

### Authentication
- `POST /api/user/register` - Register user
- `POST /api/user/login` - Login user

### Food Management
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add food item (Admin)
- `POST /api/food/remove` - Remove food item (Admin)

### Cart & Orders
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `POST /api/order/place` - Place order
- `GET /api/order/list` - Get all orders (Admin)

### Promo Codes
- `GET /api/promo/list` - Get promo codes
- `POST /api/promo/validate` - Validate promo code
- `POST /api/promo/add` - Add promo code (Admin)

## 📝 License

MIT License
