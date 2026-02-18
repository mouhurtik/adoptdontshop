# AdoptDontShop — Future Implementations & Housekeeping

**Last Updated:** February 18, 2026
**Stack:** Next.js 16 (App Router) · Supabase · Tailwind CSS · Cloudflare Pages
**Admin:** mouhurtikr@gmail.com

---

## Table of Contents

1. [Project Structure Audit & Cleanup](#1-project-structure-audit--cleanup)
2. [Critical Bugs & Fixes](#2-critical-bugs--fixes)
3. [SEO & Performance](#3-seo--performance)
4. [Feature Implementations](#4-feature-implementations)
5. [Admin Panel Upgrades](#5-admin-panel-upgrades)
6. [DevOps & Infrastructure](#6-devops--infrastructure)
7. [Code Quality & DX](#7-code-quality--dx)

---

## 1. Project Structure Audit & Cleanup

### Current Issues

The project has leftover artifacts from the React/Vite → Next.js migration. Here's what needs fixing:

#### Dead Files to Delete

| File/Dir | Reason |
|----------|--------|
| `components/Layout.tsx` | Dead — replaced by `app/layout.tsx`. Not imported anywhere. |
| `components/ProtectedRoute.tsx` | Dead — replaced by `AdminGuard.tsx`. Not imported anywhere. |
| `components/index.ts` | Barrel export, but nobody imports from `@/components`. Delete. |
| `hooks/index.ts` | Same — nobody imports from `@/hooks`. Direct imports are used. |
| `constants/index.ts` | Same — nobody imports from `@/constants`. Barrel unused. |
| `constants/routes.ts` | `ROUTES` object never imported anywhere. Dead code. |
| `constants/config.ts` | `APP_CONFIG`, `QUERY_CONFIG`, `ANIMAL_TYPES` — never imported. Dead code. |
| `data/mockData.ts` | Mock pets from Vite era. All data comes from Supabase now. |
| `components/ui/use-toast.ts` | Duplicate — just re-exports from `hooks/use-toast.ts`. |
| `components.json` | Points to `src/index.css` (old Vite structure). Broken shadcn config. |
| `NEXT_TODO.md` | Already in `.gitignore`. If it's committed, remove from tracking. |
| `CHANGELOG.md` | Empty or stale from migration. Replace with auto-generated or remove. |
| `docs/CODE_QUALITY_REVIEW.md` | Stale review from old codebase. Outdated. |
| `docs/architecture/ARCHITECTURE_OVERVIEW.md` | Outdated (references old patterns). |
| `docs/features/FEATURE_ROADMAP.md` | Superseded by this file. |
| `github-ruleset-*.json` | Utility files — move to `.github/rulesets/` (see below). |
| `assets/paw-icon.svg` | Should be in `public/` for static serving, not `assets/`. |

#### Folder Reorganization

**Current (messy hybrid of React + Next.js patterns):**
```
components/          ← 14 files + 5 subdirs, mixed concerns
  Layout.tsx         ← dead
  ProtectedRoute.tsx ← dead
  index.ts           ← dead barrel
  __tests__/         ← tests far from source
  ui/                ← shadcn primitives + custom widgets mixed
  home/              ← feature components
  browse/            ← feature components
  pet-details/       ← feature components
  pet-listing/       ← feature components
views/               ← page-level view components (React pattern)
constants/           ← entirely unused
data/                ← entirely mock data (unused)
```

**Proposed (idiomatic Next.js App Router):**
```
app/                 ← routes + route-specific components
  (marketing)/       ← group: about, sponsors, terms, etc.
  (pets)/            ← group: browse, pet/[slug]
  admin/             ← already exists
  profile/           ← already exists
components/
  ui/                ← shadcn primitives only (button, dialog, input, etc.)
  shared/            ← cross-page: Navbar, Footer, PetCard, ErrorBoundary, LoadingSpinner
  forms/             ← PetListingForm + sections, AdoptionModal
config/              ← rename constants/ — only keep what's actually used
lib/                 ← keep (supabase, utils, imageLoader)
hooks/               ← keep (remove barrel index.ts)
types/               ← keep
utils/               ← keep
```

**Key principle:** In Next.js App Router, page-level layouts and views belong in `app/`. The `views/` folder is a React SPA pattern — each view should be inlined into its `app/*/page.tsx` or co-located.

#### Move `views/` Into `app/` (Medium Effort)

Each file in `views/` is a 1:1 mapping to an `app/*/page.tsx` that just renders it. For example:
- `app/about/page.tsx` → renders `<AboutUs />` from `views/AboutUs.tsx`
- `app/browse/page.tsx` → renders `<BrowsePets />` from `views/BrowsePets.tsx`

The Next.js way: move the content directly into or co-locate with the route. The `views/` indirection adds no value. This is a refactor, not urgent, but makes the project more standard.

#### GitHub Config Files

Move ruleset JSONs and organize:
```
.github/
  workflows/ci.yml     ← already exists
  rulesets/             ← NEW
    main.json
    react-backup.json
  ISSUE_TEMPLATE/       ← future: bug report, feature request templates
  PULL_REQUEST_TEMPLATE.md ← future
```

---

## 2. Critical Bugs & Fixes

### 2.1 Sitemap Hardcodes `pages.dev` URL
**File:** `app/sitemap.ts`
**Issue:** `baseUrl` is hardcoded to `https://adoptdontshop.pages.dev` instead of `https://adoptdontshop.website`.
**Fix:** Use an env variable `NEXT_PUBLIC_SITE_URL` or hardcode the custom domain.

### 2.2 `components.json` Points to Wrong CSS Path
**File:** `components.json`
**Issue:** `tailwind.css` is set to `src/index.css` (Vite structure). Should be `app/globals.css`.
**Fix:** Update or delete if shadcn CLI isn't being used.

### 2.3 `lib/supabase/server.ts` Still Exists
**File:** `lib/supabase/server.ts`
**Issue:** Uses `cookies()` from `next/headers`. Only used by `pet/[slug]/page.tsx` (for SEO metadata) and `sitemap.ts`. These work because they're true server components, but if Cloudflare Workers ever choke on `cookies()`, replace with direct Supabase client (anon key is public anyway for read-only SELECT).
**Priority:** Monitor — fix if errors appear.

### 2.4 Login/Signup Redirect After Auth
**Issue:** After signing in at `/login?redirect=/admin`, verify the redirect actually works. The auth flow sets state via `onAuthStateChange` but the redirect logic must be in the login page component.
**Fix:** Ensure `app/login/page.tsx` reads `searchParams.redirect` and navigates after successful sign-in.

### 2.5 Image Optimization
**Issue:** `next/image` requires a loader for Cloudflare Pages (no default image optimization). `lib/imageLoader.ts` exists but verify it's configured in `next.config.mjs`.

---

## 3. SEO & Performance

### 3.1 Structured Data (JSON-LD)
Add schema.org markup for pet listings:
```tsx
// In app/pet/[slug]/page.tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Adopt Buddy",
  "description": "...",
  "image": "...",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
</script>
```

### 3.2 Open Graph Images
Generate dynamic OG images for pet pages using `@vercel/og` or a static fallback image per animal type.

### 3.3 `robots.ts` Audit
Verify `app/robots.ts` disallows `/admin`, `/profile`, `/login`, `/signup` from crawlers.

### 3.4 Canonical URLs
Add canonical URLs to all pages to avoid duplicate content issues (especially `pages.dev` vs custom domain).

### 3.5 Performance Metrics
- Add Web Vitals tracking (Cloudflare Analytics or a lightweight script)
- Audit Lighthouse score on key pages
- Lazy-load below-fold images with `loading="lazy"`

---

## 4. Feature Implementations

### 4.1 Pet Search (High Priority)
- Full-text search on pet name, breed, description
- Supabase `textSearch` or `ilike` patterns
- URL-synced search params (`/browse?q=golden&type=dog`)

### 4.2 Favorites / Wishlist
- Save favorite pets (requires auth)
- `favorites` table in Supabase: `user_id`, `pet_id`, `created_at`
- Heart icon toggle on PetCard

### 4.3 Adoption Applications Dashboard
- Users can view their submitted applications at `/profile/applications`
- Status tracking: Pending → Under Review → Approved/Rejected
- Email notifications via Supabase Edge Functions

### 4.4 Pet Status Workflow
- Listing workflow: Draft → Pending Review → Available → Adopted
- Admin approval before listings go live
- Auto-expire listings after 90 days

### 4.5 Multi-Image Upload
- Currently single image per listing
- Support 3-5 images with a gallery carousel
- Supabase Storage bucket with signed URLs

### 4.6 Contact Form / Inquiry System
- Allow potential adopters to message caregivers directly
- `inquiries` table: `from_user_id`, `pet_id`, `message`, `created_at`
- Notification to caregiver

### 4.7 Location-Based Search
- Filter pets by city/state
- Supabase PostGIS extension for distance-based queries (future)
- Basic dropdown filter for now

### 4.8 Success Stories Submission
- User-submitted adoption success stories
- Photo upload + text
- Admin moderation before publishing

### 4.9 Email Notifications
- Welcome email on signup
- Application status change notifications
- New pet matching saved search criteria
- Implement via Supabase Edge Functions + Resend/SendGrid

### 4.10 PWA Enhancements
- `site.webmanifest` exists but needs:
  - Offline fallback page
  - Push notification support (future)
  - Install prompt handling

---

## 5. Admin Panel Upgrades

### 5.1 Dashboard Enhancements
- Charts (weekly signups, listings trend) — use lightweight chart library (e.g., `recharts` or `chart.js`)
- Activity log showing recent actions
- Export data to CSV

### 5.2 Listing Moderation Queue
- Dedicated pending review page with approve/reject/request-changes actions
- Inline image preview
- Bulk operations (approve all, reject selected)

### 5.3 User Management
- View user profiles and their listings
- Ban/suspend users
- Assign listings to users (for the `user_id = null` listings)
- Role management (admin, moderator, shelter)

### 5.4 Content Management
- Edit static page content (About, Terms, Privacy) from admin
- Manage sponsors list
- Manage success stories

### 5.5 Analytics Dashboard
- Page views, unique visitors (from Cloudflare Analytics API)
- Most viewed pets
- Application conversion rates

---

## 6. DevOps & Infrastructure

### 6.1 Environment Configuration
- [ ] Move `NEXT_PUBLIC_SITE_URL` to Cloudflare env vars
- [ ] Ensure `.env.example` is up-to-date
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` as secret for Edge Functions (never in client)

### 6.2 CI/CD Improvements
- [ ] Add `npm run build` check to CI (currently only `next build`, not `cf:build`)
- [ ] Add bundle size check (fail if worker exceeds 2.8 MiB — buffer below 3 MiB limit)
- [ ] Cache `node_modules` in GitHub Actions for faster builds
- [ ] Add Playwright E2E tests for critical flows (login, browse, adopt)

### 6.3 Monitoring
- [ ] Cloudflare Workers analytics for error rates
- [ ] Supabase dashboard monitoring for RLS violations
- [ ] Uptime monitoring (e.g., Cloudflare Health Checks on custom domain)

### 6.4 Database
- [ ] Supabase database backups (auto-enabled on Pro, manual on Free)
- [ ] Add database indexes on `pet_listings.status`, `pet_listings.animal_type`
- [ ] Run `supabase db diff` to keep migration files in sync

### 6.5 Staging Environment
- [ ] Create `develop` branch for staging
- [ ] Cloudflare preview deployments for PRs (already supported via branch builds)
- [ ] Separate Supabase project for staging (optional)

---

## 7. Code Quality & DX

### 7.1 Test Coverage
Current: 8 test files, 55 tests. Missing coverage for:
- [ ] Auth flows (login, signup, logout)
- [ ] Admin pages (dashboard, listings, users)
- [ ] Pet details page rendering
- [ ] Form validation (PetListingForm)
- [ ] API/Supabase query mocking
- [ ] E2E tests with Playwright

### 7.2 TypeScript Strictness
- [ ] Enable `strict: true` in tsconfig.json (currently partial)
- [ ] Fix any `any` types in codebase
- [ ] Ensure all Supabase queries use generated types from `lib/supabase/types.ts`

### 7.3 Code Formatting
- [ ] `.prettierrc` and `.prettierignore` exist but verify all files are formatted
- [ ] Add `prettier --check` to CI pipeline
- [ ] Consider `lint-staged` running prettier too (currently only eslint)

### 7.4 Documentation
- [ ] Update `README.md` with current architecture (remove Vite references)
- [ ] Add `CONTRIBUTING.md` setup instructions for Next.js + Supabase
- [ ] API documentation for Supabase tables and RLS policies
- [ ] Component storybook or documentation page (future)

### 7.5 Accessibility
- [ ] Audit with axe-core or Lighthouse accessibility
- [ ] Ensure all images have alt text
- [ ] Keyboard navigation for modals, dropdowns, sidebar
- [ ] ARIA labels on interactive elements
- [ ] Color contrast check on the playful theme

---

## Priority Matrix

| Priority | Task | Effort |
|----------|------|--------|
| 🔴 Critical | Fix sitemap URL (2.1) | 5 min |
| 🔴 Critical | Delete dead files (1) | 15 min |
| 🟠 High | Structured data / JSON-LD (3.1) | 1 hr |
| 🟠 High | Pet search (4.1) | 3 hrs |
| 🟠 High | Favorites system (4.2) | 3 hrs |
| 🟡 Medium | Move views/ into app/ (1) | 2 hrs |
| 🟡 Medium | Admin charts (5.1) | 3 hrs |
| 🟡 Medium | Multi-image upload (4.5) | 4 hrs |
| 🟡 Medium | Test coverage increase (7.1) | 4 hrs |
| 🟢 Low | Success stories submission (4.8) | 3 hrs |
| 🟢 Low | PWA enhancements (4.10) | 2 hrs |
| 🟢 Low | Playwright E2E (6.2) | 4 hrs |
| 🟢 Low | Storybook (7.4) | 6 hrs |

---

## Notes for AI Assistants

- **Cloudflare Pages** has a 3 MiB worker bundle limit. Always check bundle size after adding dependencies.
- **No middleware** — all auth is client-side via `AuthContext`. Don't recreate middleware.
- **Server components** can use `lib/supabase/server.ts` for SEO (metadata, sitemap) but avoid `cookies()` for auth — it's flaky on CF Workers.
- **`@opennextjs/cloudflare`** is the adapter. Build with `npx opennextjs-cloudflare build`. Don't use `next export`.
- Run `npx vitest --run` after changes. All 55 tests must pass.
- Run `npx next build` to verify. Check for TypeScript errors.
- Lint: `npm run lint` (eslint with `--max-warnings 0` in pre-commit hook).
