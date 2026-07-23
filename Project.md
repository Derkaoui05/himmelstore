# Perfume Store — Web E-commerce Build

## Context
Freelance project for a real client: an online perfume store. Launch scope is
web-only, but architecture must allow a future React Native/Expo mobile app
to reuse the backend without rework.

## Tech Stack
- Turborepo (monorepo, even though only `apps/web` is built for now)
- Next.js 16 (App Router) + TypeScript
- tRPC (type-safe API layer — chosen specifically so a future Expo app can
  import the same routers later; do not build plain REST routes)
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui
- Zustand (cart state)
- NextAuth.js (admin auth only — customers checkout as guests)
- Cloudinary (product images)
- Recharts (admin dashboard stats)
- Zod (input validation, paired with tRPC)

## Monorepo Structure

/apps
/web
/app
/(storefront)
/page.tsx → homepage
/produits/page.tsx → catalog (filters: gender, brand, price)
/produits/[slug]/page.tsx → product detail (variants: 30/50/100ml)
/panier/page.tsx → cart
/commande/page.tsx → checkout (COD form)
/admin
/dashboard/page.tsx → stats (revenue, orders/day, top products)
/produits/page.tsx → product CRUD
/commandes/page.tsx → order management + status updates
/api/trpc/[trpc]/route.ts → tRPC handler
/components
/storefront
/admin
/lib
/store.ts → Zustand cart
/packages
/api → tRPC routers (product, order, admin)
/db → Prisma schema + client singleton
/types → shared TS types


## Prisma Schema (`packages/db/prisma/schema.prisma`)
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  brand         String
  gender        Gender
  concentration String?
  images        String[]
  featured      Boolean  @default(false)
  active        Boolean  @default(true)
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  variants      Variant[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Variant {
  id         String      @id @default(cuid())
  productId  String
  product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  size       String
  price      Decimal
  stock      Int         @default(0)
  sku        String      @unique
  orderItems OrderItem[]
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  products Product[]
}

model Order {
  id           String      @id @default(cuid())
  orderNumber  String      @unique
  customerName String
  phone        String
  city         String
  address      String
  status       OrderStatus @default(PENDING)
  items        OrderItem[]
  total        Decimal
  notes        String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId String
  variant   Variant @relation(fields: [variantId], references: [id])
  quantity  Int
  price     Decimal
}

model Admin {
  id       String @id @default(cuid())
  email    String @unique
  password String
  name     String
}

enum Gender {
  HOMME
  FEMME
  UNISEXE
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## Payment
Cash on delivery (COD) only at launch. No payment gateway integration needed
yet. Checkout form collects: customerName, phone, city, address, notes.
Design the Order flow so a payment step (CMI) could be inserted later without
restructuring the schema.

## Admin
Full dashboard scope:
- Product CRUD (with variant management per product)
- Order list with status updates (PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED)
- Stats: revenue over time, orders per day, top-selling products (Recharts)
- Auth-gated via NextAuth.js, Admin model for credentials

## Build Order
1. Turborepo scaffold + `packages/db` with Prisma schema + migration + seed data
2. `packages/api` tRPC routers: product (list/getBySlug), order (create/list/updateStatus), admin (dashboard stats)
3. `apps/web` storefront: catalog, product detail, cart (Zustand), checkout (COD)
4. `apps/web` admin: NextAuth login, product CRUD, order management
5. Admin dashboard charts (Recharts)

## Notes
- Keep `packages/api` and `packages/db` decoupled from `apps/web` so a future
  `apps/mobile` (Expo) can import the same tRPC routers directly.
- Use Zod schemas for all tRPC inputs — these will be reused as-is by mobile
  later.
- French UI copy (client is Moroccan, French-speaking market) — e.g.
  "Ajouter au panier", "Passer la commande", "Livraison à domicile".