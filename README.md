# VELOCE Enterprise E-commerce

## Stack
- **Frontend**: Vue 3 + Vite + Pinia + Vue Router
- **Backend**: Node.js + Express + Mongoose
- **DB**: MongoDB Atlas
- **Auth**: JWT + Refresh Tokens + Google OAuth
- **Payments**: Stripe
- **DevOps**: Docker + GitHub Actions

## Quick Start

### 1. Configure env
```bash
cp back/.env.example back/.env
# Fill in MONGODB_URI, JWT_SECRET, STRIPE_SECRET_KEY, etc.
```

### 2. Install & Seed
```bash
cd back && npm install
npm run seed          # Seeds: categories, products, coupons, admin

cd ../front && npm install
```

### 3. Run development
```bash
# Terminal 1
cd back && npm run dev

# Terminal 2
cd front && npm run dev
```

### 4. Docker
```bash
docker-compose up --build
```

## Default Credentials
- **Admin**: admin@admin.com / Password123*
- **Coupon**: JAVIER15 (15% off)

## API Base URL
`http://localhost:3000/api`

### Key Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /auth/register | — | Register user |
| POST | /auth/login | — | Login |
| POST | /auth/refresh | — | Refresh token |
| GET | /products | — | List products |
| GET | /products/:id | — | Product detail |
| POST | /cart/items | USER | Add to cart |
| POST | /checkout/session | USER | Stripe checkout |
| GET | /orders/my | USER | My orders |
| POST | /coupons/validate | USER | Validate coupon |
| GET | /analytics/dashboard | ADMIN | Dashboard stats |
| GET | /orders | ADMIN | All orders |
| PATCH | /orders/:id/status | ADMIN | Update status |
| PATCH | /refunds/:id/approve | ADMIN | Approve refund |

## Environment Variables
See `back/.env.example` for all required variables.
