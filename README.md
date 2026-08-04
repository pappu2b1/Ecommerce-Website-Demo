# LUMA — Full-Stack Ecommerce Platform

LUMA is a portfolio ecommerce application with a React/Vite storefront and an Express/MongoDB API. MongoDB is the authoritative catalog source: storefront URLs use product slugs and all cart, checkout, order, review, and admin operations retain the database `_id`.

## Verified locally

- MongoDB 8.0 connection and idempotent seed of 16 products, six categories, two coupons, an admin, and a customer
- Registration, duplicate rejection, login, invalid login, JWT refresh validation, profile update, and address creation
- API-driven product listing/details, search, filters, cart, local guest wishlist, coupon validation, COD checkout, server totals, persisted orders, and ownership protection
- Admin access controls, overview, product CRUD, orders/status updates, customers, categories, coupons, and review moderation APIs
- Frontend lint/build, backend syntax/startup, health/version, 404s, and responsive overflow checks at 320–1440px

## Stack

React 18, Vite, React Router, custom responsive CSS, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Helmet, CORS, rate limiting, and request sanitization.

## Local Development

```powershell
cd F:\Ecommerce-Website-Demo\backend
npm install
Copy-Item .env.example .env
# Set a private JWT_SECRET and confirm MONGODB_URI
npm run seed
npm start

cd F:\Ecommerce-Website-Demo\frontend
npm install
Copy-Item .env.example .env
npm run dev -- --port 5173
```

Local URLs: frontend `http://localhost:5173`, backend `http://localhost:5000`, health `http://localhost:5000/api/health`, database health `http://localhost:5000/api/health/database`, version `http://localhost:5000/api/version`.

## Environment variables

Frontend: `VITE_API_BASE_URL`, `VITE_WHATSAPP_NUMBER`.

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`, `DEMO_PAYMENT_MODE`.

`.env` is ignored. Commit only `.env.example`.

## MongoDB

Local development can use MongoDB at `mongodb://127.0.0.1:27017/luma_ecommerce`, as shown in the backend example environment file. For production, create a MongoDB Atlas database and set Render's `MONGODB_URI` to its private connection string. Never commit that connection string.

## Seed

From `backend`, run `npm run seed`. The seed is idempotent for the catalog and creates 16 products, six categories, two coupons, and the two synthetic demo accounts.

## Demo Accounts

- Customer: `customer@luma.demo` / `CustomerDemo123!`
- Admin: `admin@luma.demo` / `AdminDemo123!`
- Coupons: `WELCOME10` (10% above $50), `LUMA20` ($20 above $150)

These credentials are synthetic and development-only.

## Vercel

Configure the frontend project with:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production environment variable: `VITE_API_BASE_URL=https://ecommerce-website-demo.onrender.com`

Set `VITE_WHATSAPP_NUMBER` if the production contact number differs from the demo value. `frontend/vercel.json` provides the SPA fallback required when refreshing nested routes.

## Render

Configure the backend web service with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Required environment variables: `MONGODB_URI`, `JWT_SECRET`
- Optional environment variables: `JWT_EXPIRES_IN`, `DEMO_PAYMENT_MODE`, `NODE_ENV`, `PORT`

Production CORS is restricted to `https://luma.papputhakur.com` and `https://ecommerce-website-demo-zeta.vercel.app`; local development also allows `http://localhost:5173`. Render supplies `PORT`; the server reads it automatically and falls back to `5000` locally.

## Routes

Customer routes include `/`, `/shop`, `/shop/:slug`, `/cart`, `/wishlist`, `/checkout`, `/account`, `/account/profile`, `/account/addresses`, `/account/orders`, and `/account/orders/:id`.

Admin routes include `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/:id`, `/admin/orders`, `/admin/customers`, `/admin/categories`, `/admin/coupons`, and `/admin/reviews`.

API groups include `/api/auth`, `/api/products`, `/api/categories`, `/api/orders`, `/api/users`, `/api/wishlist`, `/api/coupons`, `/api/reviews`, and `/api/admin`.

## Payment and contact behavior

COD is the verified demo payment flow. No Razorpay/Stripe success is faked. The contact endpoint stores validated messages in MongoDB and explicitly reports that no email was sent.

## Dependency status

Backend audit: zero vulnerabilities. Frontend: two moderate React Router advisories remain. npm currently offers only a breaking React Router 7 migration; the application remains on compatible v6. The SSR hydration advisory is not applicable because this is a client-rendered Vite application, and navigation targets are application-controlled.

## Known Limitations

- Guest wishlists persist locally. Authenticated wishlists use MongoDB and safely merge guest selections during login.
- Admin order, category, coupon and review controls are implemented; destructive category deletion is blocked while products reference that category.
- Inventory decrements use guarded atomic updates with compensation, not a multi-document MongoDB transaction. A replica-set transaction is recommended for production.
- COD is the only verified payment method. Transactional email, uploads, and carrier integrations require external credentials.
