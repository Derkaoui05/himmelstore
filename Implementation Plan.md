# Perfume Store — Project Spec Review & Implementation Plan

Review of [Project.md](file:///c:/Users/derkaoui05/Desktop/himmel/Project.md) with findings, issues, recommendations, and a phased build plan.

---

## Spec Validation Summary

| Area | Verdict | Notes |
|:--|:--|:--|
| **Tech Stack** | ✅ Compatible | All libraries are current and work together on Next.js 16 (July 2026) |
| **Monorepo Structure** | ✅ Sound | Clean separation of `apps/web`, `packages/api`, `packages/db`, `packages/types` |
| **Prisma Schema** | ⚠️ Has Issues | Several schema gaps and precision concerns (see below) |
| **tRPC Architecture** | ✅ Solid | v11 + `fetchRequestHandler` + server-side caller pattern is well-supported |
| **Auth Strategy** | ✅ Appropriate | Auth.js v5 Credentials provider with JWT strategy fits admin-only auth |
| **Build Order** | ✅ Logical | Bottom-up (DB → API → Storefront → Admin → Charts) is correct |
| **Mobile-Readiness** | ✅ Good | Decoupled `packages/api` and Zod schemas are reusable by Expo |

---

## User Review Required

> [!IMPORTANT]
> ### 1. Prisma `Decimal` Serialization Strategy
> The schema uses `Decimal` for `price` and `total`. Prisma returns these as `Decimal.js` objects, which **cannot be directly JSON-serialized** to Client Components in Next.js.
>
> **Two options:**
> - **A) Keep `Decimal`** — add a serialization helper (e.g., `superjson` transformer on tRPC, or a `toClient()` mapper). Best for future multi-currency / tax math.
> - **B) Switch to integer cents** — store `1999` instead of `19.99`, convert for display only. Simpler but requires discipline.
>
> **Recommendation:** Option A (keep `Decimal` + use `superjson` as the tRPC transformer). This is the standard approach for tRPC stacks and handles `Decimal`, `Date`, and `BigInt` out of the box.

> [!IMPORTANT]
> ### 2. Prisma Schema — Missing `@db.Decimal` Precision
> The schema declares `price Decimal` and `total Decimal` without PostgreSQL precision, which defaults to arbitrary precision. For an e-commerce store, this should be explicit:
> ```prisma
> price Decimal @db.Decimal(10, 2)
> total Decimal @db.Decimal(10, 2)
> ```

> [!WARNING]
> ### 3. Stock Tracking Scope
> The schema has `stock Int @default(0)` on `Variant`, but the spec doesn't mention:
> - Should stock be **decremented** when an order is placed?
> - Should out-of-stock variants be **hidden** or shown with a "Rupture de stock" badge?
> - Is there a low-stock notification for the admin?
>
> **Recommendation:** Implement basic stock decrement on order creation (inside a Prisma transaction) and hide variants with `stock <= 0` from the storefront. Low-stock alerts can be a future enhancement.

> [!WARNING]
> ### 4. Order Number Generation
> `orderNumber String @unique` is declared but the spec doesn't specify the format. For a Moroccan e-commerce store, a readable format is recommended:
> - e.g., `HIM-20260723-0042` (prefix + date + daily sequence)
>
> This needs a generation strategy (counter in DB, or CUID-based).

---

## Open Questions

> [!IMPORTANT]
> ### Q1. Package Manager
> The spec doesn't specify a package manager. **pnpm** is the strongly recommended choice for Turborepo monorepos (strict dependency hoisting, faster installs). Should I use **pnpm**?

> [!IMPORTANT]
> ### Q2. Deployment Target
> The spec doesn't mention deployment. This affects configuration choices:
> - **Vercel** — zero-config for Next.js, but needs a managed PostgreSQL (e.g., Neon, Supabase, Railway)
> - **VPS (e.g., Hetzner/DigitalOcean)** — Docker Compose with PostgreSQL, more control
>
> Which environment should I target?

> [!IMPORTANT]
> ### Q3. Image Upload Workflow
> The spec mentions Cloudinary for product images, but not the upload mechanism:
> - **A) Direct browser upload** — client-side upload widget, returns URL to store in DB
> - **B) Server-side upload** — admin uploads through tRPC, server proxies to Cloudinary
>
> **Recommendation:** Option A (Cloudinary Upload Widget) for simplicity and better UX.

> [!NOTE]
> ### Q4. Seed Data Scope
> The spec mentions "seed data" in Build Order step 1. Should I create:
> - A minimal seed (3–5 products, 1 admin) for development?
> - A realistic seed (20+ products across categories, sample orders) for demo purposes?

---

## Proposed Changes

### Phase 1 — Monorepo Scaffold + Database (`packages/db`)

#### [NEW] Root Turborepo config
- `package.json` (workspace root, pnpm workspaces)
- `turbo.json` (pipeline: `db:generate` → `build`, `dev`, `lint`)
- `pnpm-workspace.yaml`
- `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, CLOUDINARY_*)

#### [NEW] `packages/db/`
- `package.json` (`@himmel/db`)
- `prisma/schema.prisma` — the schema from the spec with these fixes:
  - Add `@db.Decimal(10, 2)` to all monetary fields
  - Add `@@index([gender])`, `@@index([brand])`, `@@index([categoryId])` to `Product` for catalog filter performance
  - Add `@@index([productId])` to `Variant`
  - Add `@@index([status])`, `@@index([createdAt])` to `Order` for admin queries
- `prisma/seed.ts` — seed script with sample products, categories, variants, and an admin user
- `src/index.ts` — PrismaClient singleton export

#### [NEW] `packages/types/`
- `package.json` (`@himmel/types`)
- `src/index.ts` — shared TypeScript types and Zod schemas (Gender, OrderStatus, product inputs, order inputs)

---

### Phase 2 — tRPC API Layer (`packages/api`)

#### [NEW] `packages/api/`
- `package.json` (`@himmel/api`)
- `src/trpc.ts` — tRPC init with `superjson` transformer, context factory (db + session)
- `src/root.ts` — merged `appRouter` export
- `src/routers/product.ts`:
  - `list` — paginated, filterable by gender/brand/category/price range
  - `getBySlug` — single product with variants
  - `getFeatured` — homepage featured products
  - `create` / `update` / `delete` — admin-only (protected procedures)
- `src/routers/order.ts`:
  - `create` — guest checkout (validates Zod input, decrements stock in transaction, generates orderNumber)
  - `list` — admin-only, paginated, filterable by status
  - `updateStatus` — admin-only, status transition validation
- `src/routers/admin.ts`:
  - `dashboardStats` — revenue over time, orders/day, top-selling products (aggregation queries)
- `src/routers/category.ts`:
  - `list` — all categories for filter sidebar

---

### Phase 3 — Storefront (`apps/web/(storefront)`)

#### [NEW] `apps/web/`
- `package.json` (depends on `@himmel/api`, `@himmel/db`, `@himmel/types`)
- Next.js 16 App Router setup with Tailwind CSS v4 + shadcn/ui
- `app/api/trpc/[trpc]/route.ts` — tRPC handler via `fetchRequestHandler`
- `lib/trpc/` — server-side caller + client-side React Query provider

#### [NEW] Storefront pages
- `app/(storefront)/page.tsx` — Hero, featured products grid, brand carousel
- `app/(storefront)/produits/page.tsx` — Catalog with sidebar filters (gender, brand, price range), sort, pagination
- `app/(storefront)/produits/[slug]/page.tsx` — Product detail: image gallery, variant selector (30/50/100ml), add to cart
- `app/(storefront)/panier/page.tsx` — Cart page (Zustand store), quantity controls, subtotal
- `app/(storefront)/commande/page.tsx` — COD checkout form (customerName, phone, city, address, notes), order confirmation

#### [NEW] Storefront components
- `components/storefront/Navbar.tsx` — logo, nav links, cart icon with badge
- `components/storefront/Footer.tsx` — links, contact info
- `components/storefront/ProductCard.tsx` — image, name, brand, price (from lowest variant)
- `components/storefront/ProductFilters.tsx` — gender, brand, price range filters
- `components/storefront/VariantSelector.tsx` — size/price toggle buttons
- `components/storefront/CartItem.tsx` — product row in cart with quantity ±
- `components/storefront/CheckoutForm.tsx` — Zod-validated COD form

#### [NEW] State management
- `lib/store.ts` — Zustand cart store with `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotal`, localStorage persistence

---

### Phase 4 — Admin Panel (`apps/web/admin`)

#### [NEW] Auth setup
- `auth.ts` — Auth.js v5 config with Credentials provider, JWT strategy, Admin model lookup
- `app/api/auth/[...nextauth]/route.ts` — Auth.js route handler
- `middleware.ts` — protect all `/admin/*` routes

#### [NEW] Admin pages
- `app/admin/login/page.tsx` — admin login form
- `app/admin/dashboard/page.tsx` — stats overview with Recharts (revenue line chart, orders/day bar chart, top products table)
- `app/admin/produits/page.tsx` — product list with CRUD actions
- `app/admin/produits/new/page.tsx` — create product form (with variant management)
- `app/admin/produits/[id]/edit/page.tsx` — edit product form
- `app/admin/commandes/page.tsx` — order list with status badges and status update dropdown

#### [NEW] Admin components
- `components/admin/AdminSidebar.tsx` — navigation sidebar
- `components/admin/ProductForm.tsx` — product create/edit form with dynamic variant rows
- `components/admin/OrderStatusBadge.tsx` — colored status badges
- `components/admin/StatsCard.tsx` — metric card (revenue, total orders, etc.)
- `components/admin/RevenueChart.tsx` — Recharts line chart
- `components/admin/OrdersPerDayChart.tsx` — Recharts bar chart
- `components/admin/TopProductsTable.tsx` — top-selling products table

---

### Phase 5 — Polish & Verification

- French UI copy throughout (all buttons, labels, toasts, placeholders)
- Responsive design testing (mobile, tablet, desktop)
- Loading states & error boundaries
- SEO meta tags on storefront pages
- Seed data for demo

---

## Verification Plan

### Automated Tests
```bash
# Type checking across the entire monorepo
pnpm turbo typecheck

# Prisma schema validation
pnpm --filter @himmel/db prisma validate

# Prisma migration dry-run
pnpm --filter @himmel/db prisma migrate dev --create-only

# Build the entire monorepo (catches import/export issues)
pnpm turbo build

# Dev server smoke test
pnpm turbo dev --filter web
```

### Manual Verification
- **Storefront flow:** Browse catalog → filter → view product → add to cart → checkout → confirm order
- **Admin flow:** Login → view dashboard charts → create product with variants → view orders → update order status
- **Mobile responsiveness:** Test all pages at 375px, 768px, 1024px, 1440px widths
- **Edge cases:** Empty cart checkout (should block), out-of-stock variant, invalid form submissions
