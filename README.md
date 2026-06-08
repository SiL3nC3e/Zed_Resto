# Zed-Resto

A classy full-stack restaurant web ecosystem built with the **MERN stack** — browse menus, place orders, reserve tables, and manage operations from a powerful admin suite.

![Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Stack](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## Features

### Customer Experience
- Browse & filter menu by category, dietary preference, price, and rating
- Rich dish detail pages with ingredients, allergens, and chef notes
- Online ordering (delivery, pickup, dine-in) with guest checkout
- Table reservations with seating preferences
- Promo codes at checkout (`WELCOME15` for 15% off)
- Order history and loyalty points
- Profile management with dietary preferences

### Staff & Admin
- JWT authentication with role-based access (Super Admin, Manager, Chef, Waiter, Customer)
- Menu management (CRUD with photos)
- Order management with real-time status updates
- Reservation dashboard
- User & role management
- Sales analytics dashboard
- Real-time Kitchen Display System (KDS) via Socket.io

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express.js |
| Frontend | React + Vite + Tailwind CSS |
| State | Zustand |
| Real-time | Socket.io |
| Auth | JWT + bcrypt |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Quick Start

```bash
# 1. Install all dependencies
npm run install:all
npm install

# 2. Configure environment (server/.env is pre-filled for local dev)
# Edit server/.env if using MongoDB Atlas

# 3. Seed the database (first time only)
npm run seed:fresh

# 4. Start both server and client
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api/health

### Menu images

Dish photos live in **`server/data/dishes.js`**. After editing URLs:

```bash
npm run sync-images
```

Or edit images in **Admin → Menu** (updates the database directly).

> `npm run seed` skips if data exists. Use `npm run seed:fresh` only when you want to wipe everything.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@zedresto.com | admin123 |
| Chef | chef@zedresto.com | chef123 |
| Customer | guest@zedresto.com | guest123 |

## Project Structure

```
restaurant/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/customer/ # Public-facing pages
│       ├── pages/admin/    # Admin dashboard
│       ├── pages/kitchen/  # Kitchen Display System
│       ├── store/          # Zustand state (auth, cart)
│       └── components/     # Shared UI components
├── server/                 # Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST API routes
│   ├── middleware/         # Auth, error handling
│   └── socket/             # Socket.io events
└── Zed_Resto_Report.pdf    # Product requirements
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/menu` | Browse menu (with filters) |
| POST | `/api/orders` | Place order |
| POST | `/api/reservations` | Book a table |
| POST | `/api/promotions/validate` | Validate promo code |
| GET | `/api/users/analytics` | Sales dashboard data |

## Deploy Online

You need **three** services:

| Part | Host | Notes |
|------|------|-------|
| Frontend | [Vercel](https://vercel.com) | Root: `client`, build: `npm run build`, output: `dist` |
| API + Socket.io | [Railway](https://railway.app) or [Render](https://render.com) | Root: `server`, start: `npm start` |
| Database | [MongoDB Atlas](https://mongodb.com/atlas) | Free M0 cluster |

### 1. MongoDB Atlas
Create a cluster, add a DB user, allow `0.0.0.0/0` (for demo), copy the connection string.

Seed once from your machine:
```bash
# Set MONGODB_URI in server/.env to Atlas URL, then:
npm run seed:fresh --prefix server
```

### 2. Railway (API)
Environment variables:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
CLIENT_URL=https://your-app.vercel.app
```

### 3. Vercel (frontend)
Environment variable:
```
VITE_API_URL=https://your-api.up.railway.app
```

`vercel.json` is included for React Router. After deploy, set `CLIENT_URL` on Railway to match your exact Vercel URL.

### Pre-deploy checklist
- [ ] `npm run build` passes (client)
- [ ] `npm run seed:fresh` on Atlas + `npm run sync-images`
- [ ] Test order flow locally after adding items to cart
- [ ] Change demo passwords before sharing publicly
- [ ] Never commit `server/.env`

## Design

The UI uses a luxury dining aesthetic:
- **Palette:** Deep charcoal, antique gold, warm cream
- **Typography:** Playfair Display + Cormorant Garamond + Inter
- **Imagery:** High-quality food photography via Unsplash CDN

---

*Crafted for the art of fine dining — Zed-Resto © 2024*
