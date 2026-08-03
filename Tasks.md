# Tasks

- [x] Phase 1: Setup database schema & singleton
  - [x] Finalize `schema.prisma` (monetary decimals, indexes, correct generator provider)
  - [x] Generate Prisma Client & export singleton from `@himmel/db` (verified files exist)
  - [x] Create seed script with categories, variants, and admin
  - [ ] Execute seeding to verify database connection (User manual execution required due to CLI runner sandbox restriction)
- [x] Phase 1: Setup `@himmel/types` package
  - [x] Create package.json and tsconfig.json
  - [x] Write Zod schemas for products, variants, and order/checkout validation
- [x] Phase 2: Create `@himmel/api` package for tRPC v11 routers
- [x] Phase 3: Setup Next.js 16 storefront app, routes, and Zustand cart
- [x] Phase 4: Setup NextAuth/Auth.js credentials provider and admin pages
- [x] Phase 5: Recharts visualizer, design polish, and testing

