# 🌸 Himmel Store

> A premium luxury fragrance e-commerce platform built with a modern full-stack monorepo architecture.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-11-398ccb?style=flat-square)](https://trpc.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.10-EF4444?style=flat-square)](https://turbo.build/)

---

## ✨ Features

### 🛍️ Storefront
- **Product Catalog** — Browse & filter fragrances by gender, brand, category, and price range
- **Product Detail Pages** — Rich product pages with image galleries and variant selection (size/price)
- **Shopping Cart** — Persistent client-side cart with Zustand state management
- **Checkout** — Simple cash-on-delivery checkout with order creation
- **Responsive Design** — Mobile-first premium dark UI with gold accents

### ⚙️ Admin Dashboard
- **Product Management** — Create, edit, and delete products with multi-image support and variant configuration
- **Order Management** — View and update order statuses
- **Category Management** — Manage product categories
- **Protected Routes** — NextAuth.js session-based admin authentication

---

## 🏗️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Styling** | Tailwind CSS v4 with custom design tokens |
| **API** | [tRPC v11](https://trpc.io/) with React Query |
| **Database** | PostgreSQL via [Supabase](https://supabase.com/) |
| **ORM** | [Prisma v7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org/) with Credentials provider |
| **State** | [Zustand](https://github.com/pmndrs/zustand) (cart persistence) |
| **Monorepo** | [Turborepo](https://turbo.build/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
himmel-store/
├── apps/
│   └── web/                    # Next.js frontend app
│       ├── app/
│       │   ├── (storefront)/   # Public storefront pages
│       │   │   ├── produits/   # Product catalog
│       │   │   ├── panier/     # Cart
│       │   │   └── commande/   # Checkout
│       │   ├── admin/          # Admin dashboard (protected)
│       │   └── api/trpc/       # tRPC API route handler
│       ├── components/
│       │   ├── storefront/     # Storefront UI components
│       │   └── admin/          # Admin UI components
│       └── lib/                # tRPC client, store, utilities
│
├── packages/
│   ├── api/                    # @himmel/api — tRPC routers & procedures
│   │   └── src/routers/        # product, order, category, admin routers
│   ├── db/                     # @himmel/db — Prisma client & schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database models
│   │   │   └── seed.ts         # Seed data script
│   │   └── prisma.config.ts    # Prisma v7 configuration
│   └── types/                  # @himmel/types — Shared Zod schemas & types
│
├── turbo.json                  # Turborepo pipeline config
└── package.json                # Root workspace config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 10
- PostgreSQL database (Supabase recommended)

### 1. Clone the repository
```bash
git clone https://github.com/Derkaoui05/himmelstore.git
cd himmelstore
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:
```env
DATABASE_URL="postgres://<user>:<password>@<host>:5432/<db>?sslmode=require"
NEXTAUTH_SECRET="your-secret-here"
```

Create `apps/web/.env.local`:
```env
DATABASE_URL="postgres://<user>:<password>@<host>:5432/<db>?sslmode=require"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Create `packages/db/.env`:
```env
DATABASE_URL="postgres://<user>:<password>@<host>:5432/<db>?sslmode=require"
```

### 4. Generate Prisma Client
```bash
npm run db:generate -w @himmel/db
```

### 5. Push database schema
```bash
npm run db:push -w @himmel/db
```

### 6. Seed the database
```bash
npm run db:seed -w @himmel/db
```

### 7. Start development server
```bash
npm run dev
```

The app runs at **http://localhost:3000**.

---

## 🌐 Deployment (Vercel)

### Environment Variables on Vercel

Add these in **Project Settings → Environment Variables**:

| Variable | Description |
|:---------|:------------|
| `DATABASE_URL` | Supabase pooler URL (port 6543) with `pgbouncer=true` |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXTAUTH_URL` | Your production Vercel URL |

### Supabase URL Reference

| Usage | URL Type |
|:------|:---------|
| **Vercel Production** (`DATABASE_URL`) | `POSTGRES_PRISMA_URL` — port 6543 with pgbouncer |
| **Schema migrations** (`db:push`) | `POSTGRES_URL_NON_POOLING` — port 5432 direct |

---

## 🔐 Admin Credentials (Default Seed)

| Field | Value |
|:------|:------|
| Email | `admin@himmel.ma` |
| Password | `admin123` |

> ⚠️ Change the admin password after first login in production.

---

## 📦 Package Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Run ESLint across the monorepo |
| `npm run check-types` | TypeScript type checking |
| `npm run db:generate -w @himmel/db` | Generate Prisma Client |
| `npm run db:push -w @himmel/db` | Push schema to database |
| `npm run db:seed -w @himmel/db` | Seed the database with sample data |

---

## 📄 License

MIT — Built with ❤️ by [Derkaoui05](https://github.com/Derkaoui05)
