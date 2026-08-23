# Implementation Plan - Admin User Management & Custom Theme Picker

Build complete Admin User Management (Create, Edit, Reset Password, Delete Admins) and an interactive Dashboard Color Theme Picker with multiple luxury themes.

## User Review Required

> [!IMPORTANT]
> **Admin Account Security**: Creating and resetting admin passwords uses salt + scrypt hashing matching NextAuth `authOptions`. Deleting the last remaining admin will be prevented to protect system access.

> [!TIP]
> **Dashboard Themes**: 4 curated themes will be available:
> 1. **Crème & Or (Default)**: Warm cream background, white cards, gold accents.
> 2. **Nuit Royale (Midnight Gold)**: Dark slate navy with gold borders.
> 3. **Émeraude Élégante (Emerald Dark)**: Deep luxury emerald green tones.
> 4. **Obsidienne Moderne (Dark Charcoal)**: Sleek obsidian black with gold ambient lighting.

## Proposed Changes

---

### Backend API (`packages/api`)

#### [NEW] [`packages/api/src/routers/admin.ts`](file:///c:/Users/derkaoui05/Desktop/himmel-store/packages/api/src/routers/admin.ts)
- `list`: Fetch all registered admins (id, name, email, createdAt).
- `create`: Create a new admin account with hashed password.
- `update`: Update name, email, or password for any admin.
- `delete`: Delete an admin account (with check ensuring >1 admin exists).

#### [MODIFY] [`packages/api/src/routers/index.ts`](file:///c:/Users/derkaoui05/Desktop/himmel-store/packages/api/src/routers/index.ts)
- Export `adminRouter` as `admin` on `appRouter`.

---

### Admin Store & Theme (`apps/web`)

#### [NEW] [`apps/web/lib/adminThemeStore.ts`](file:///c:/Users/derkaoui05/Desktop/himmel-store/apps/web/lib/adminThemeStore.ts)
- Zustand store with local storage persistence to toggle dashboard color themes (`cream`, `midnight`, `emerald`, `obsidian`).

#### [MODIFY] [`apps/web/app/admin/layout.tsx`](file:///c:/Users/derkaoui05/Desktop/himmel-store/apps/web/app/admin/layout.tsx)
- Connect layout classes to active theme from `adminThemeStore`.
- Update navigation menu to include **Admins** and **Paramètres**.

---

### Admin Pages & Interfaces

#### [NEW] [`apps/web/app/admin/utilisateurs/page.tsx`](file:///c:/Users/derkaoui05/Desktop/himmel-store/apps/web/app/admin/utilisateurs/page.tsx)
- Table listing admins, button to open "Nouvel Admin" modal, edit name/password modal, and delete confirmation.

#### [NEW] [`apps/web/app/admin/parametres/page.tsx`](file:///c:/Users/derkaoui05/Desktop/himmel-store/apps/web/app/admin/parametres/page.tsx)
- **Theme Picker**: Interactive visual cards for selecting themes.
- **Mon Profil**: Form for current admin to quickly update their name, email, or password.

## Verification Plan

### Automated Tests
- Type checking: `npx tsc --noEmit` across `packages/api` and `apps/web`.

### Manual Verification
- Test creating a new admin from `/admin/utilisateurs`.
- Test logging in with the newly created admin account.
- Test changing passwords and updating names.
- Test switching themes (Midnight, Emerald, Obsidian, Cream) and verifying layout updates instantly across pages.
