# Backend for Pastry Home by Layo

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pastryhomebylayo
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
FRONTEND_URL=http://localhost:5500
NODE_ENV=development
```

### 3. Install and Start MongoDB
- Download MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

### 4. Seed Database (Optional)
```bash
node server/seed.js
```

### 5. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment
- `POST /api/payments/verify` - Verify Paystack payment

### Health Check
- `GET /api/health` - Check if API is running

## Testing with Postman/Thunder Client

1. Health check: `GET http://localhost:5000/api/health`
2. Get products: `GET http://localhost:5000/api/products`
3. Create order: `POST http://localhost:5000/api/orders`

## Deployment

Can be deployed to:
- Railway: https://railway.app
- Render: https://render.com
- Heroku: https://heroku.com
