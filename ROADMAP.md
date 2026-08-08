# AdoptDontShop — Future Implementations & Housekeeping

**Last Updated:** August 7, 2026
**Stack:** Next.js 16 (App Router) · React 19 · Supabase · Tailwind CSS 3 · Cloudflare Pages · Capacitor 8
**Admin:** mouhurtikr@gmail.com

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Bugs & Fixes](#2-bugs--fixes)
3. [SEO & Performance](#3-seo--performance)
4. [Feature Implementations](#4-feature-implementations)
5. [Admin Panel Upgrades](#5-admin-panel-upgrades)
6. [DevOps & Infrastructure](#6-devops--infrastructure)
7. [Code Quality & DX](#7-code-quality--dx)

---

## 1. Project Structure

### Completed ✅ (July 2026 cleanup)

The following dead files/directories from the Vite → Next.js migration have been deleted:

| Deleted | Reason |
|---------|--------|
| `components/Layout.tsx` | Replaced by `app/layout.tsx` + `LayoutShell.tsx` |
| `components/ProtectedRoute.tsx` | Replaced by `AdminGuard.tsx` |
| `components/Navbar.tsx` | Replaced by `TopBar.tsx` + `AppSidebar.tsx` |
| `components/Footer.tsx` | Not used in sidebar-based layout |
| `components/index.ts` | Unused barrel export |
| `hooks/index.ts` | Unused barrel export |
| `constants/` (entire dir) | `config.ts`, `routes.ts`, `index.ts` — all never imported |
| `data/` (entire dir) | `mockData.ts` from Vite era — all data from Supabase |
| `components.json` | Pointed to `src/index.css` (Vite path) |
| `components/ui/use-toast.ts` | Duplicate re-export |
| `lint.json`, `lint.txt` | One-time lint output files |

### Remaining Structural Work

#### Move `views/` Into `app/` (Medium Effort)

Each file in `views/` is a 1:1 mapping to an `app/*/page.tsx` that just renders it. For example:
- `app/about/page.tsx` → renders `<AboutUs />` from `views/AboutUs.tsx`
- `app/browse/page.tsx` → renders `<BrowsePets />` from `views/BrowsePets.tsx`

The Next.js way: move the content directly into or co-locate with the route. The `views/` indirection adds no value.

#### Current Architecture

```
app/                  ← routes + metadata (server components)
  (marketing)/        ← about, terms, privacy, welcome
  (pets)/             ← browse, pet/[slug], list-pet
  admin/              ← 7 admin sub-routes
  community/          ← blog post CRUD + detail
  communities/        ← group listing, detail, create
  messages/           ← DM messaging
  profile/            ← settings, my-listings, saved
  explore/            ← discover page
  adopt-pets-in/      ← city landing pages (SEO)
components/
  ui/                 ← shadcn primitives (button, dialog, tabs, toast, etc.)
  community/          ← PostCard, TagFilter, TiptapEditor, TrendingSidebar
  home/               ← HeroSection, FeaturedPets, SearchSection, HomeRightSidebar
  groups/             ← GroupCard, GroupChat, RoomSidebar
  messaging/          ← ConversationList, MessageThread
  browse/             ← BrowseHero, BrowseFilters
  pet-details/        ← PetDetails, AdoptionModal
  pet-listing/        ← PetListingForm
  NativeProvider.tsx  ← Capacitor native bridge context (haptics, dialogs, push)
  AppSidebar.tsx      ← Desktop left sidebar (persistent, collapsible)
  TopBar.tsx          ← Mobile top bar
  BottomNav.tsx       ← Mobile bottom navigation (5 tabs)
  LayoutShell.tsx     ← Shell wrapper (sidebar + content + deferred modals + NativeProvider)
contexts/             ← AuthContext, AuthModalContext
hooks/                ← usePets, useCommunity, useMessages, useGroups, useGroupChat, useFavorites, useFilters
lib/
  supabase/           ← client.ts (lazy Proxy singleton), server.ts, server-queries.ts, types.ts
  capacitor/          ← native.ts (haptics, StatusBar), push-notifications.ts (FCM)
types/                ← pet.types.ts, auth.types.ts, user.types.ts
views/                ← 19 page-level 'use client' components (server/client boundary — valid pattern)
scripts/              ← build-android.cjs, strip-vercel-og.js
```

---

## 2. Bugs & Fixes

### Fixed ✅ (July 2026)

| Bug | Fix |
|-----|-----|
| Sidebar community links pointed to `/groups/{slug}` (404) | Changed to `/communities/{slug}` in `AppSidebar.tsx` |
| Like count display showed wrong number | Removed broken optimistic math in `PostCard.tsx` — uses server count |
| Sitemap hardcoded `pages.dev` URL | Fixed to use `adoptdontshop.xyz` |
| `pet_listings` RLS policy was `qual: "true"` | Restricted to `available/urgent/own/admin` |
| `messages.conversation_id` was TEXT type | Migrated to UUID with FK constraint |
| Username generation race condition | Retry loop with `.is('username', null)` guard |
| `fetchPetByIdPrefix` did full table scan | Uses `.ilike('id', ...)` with `.limit(1)` |

### Open Bugs

| # | Severity | Issue | Location | Fix |
|---|----------|-------|----------|-----|
| B1 | ✅ Fixed | `useMarkAsRead` N+1 → parallel `Promise.all` | `useMessages.ts` | Done (Aug 2026) |
| B2 | ✅ Fixed | `useSendMessage` re-fetches profile → uses AuthContext | `useMessages.ts` | Done (Aug 2026) |
| B3 | ✅ Fixed | `useStartConversation` 3x profile fetch → single AuthContext | `useMessages.ts` | Done (Aug 2026) |
| B4 | ✅ Fixed | `useFavorites` useState → React Query with optimistic updates | `useFavorites.ts` | Done (Aug 2026) |
| B5 | ✅ Fixed | `messages/page.tsx` `force-static` removed | `messages/page.tsx` | Done (Aug 2026) |
| B6 | 🟢 Low | `AuthModalProvider` not provided in admin routes | `LayoutShell.tsx:49` | Wrap admin layout or guard `useAuthModal()` |

---

## 3. SEO & Performance

### Completed ✅

- [x] JSON-LD structured data: Organization + BlogPosting + WebSite + LocalBusiness schemas
- [x] Dynamic `generateMetadata()` on pet and community post pages
- [x] Sitemap with static pages + pet listings + community posts + city pages
- [x] RSS feed at `/feed.xml` with auto-discovery
- [x] Canonical URLs on all pages
- [x] `robots.ts` disallowing admin/profile/auth routes
- [x] `optimizePackageImports` for 13 heavy libraries
- [x] Custom `imageLoader.ts` for Supabase Storage transforms
- [x] Dynamic imports for TipTap, Sonner, BottomNav, AppSidebar
- [x] `requestIdleCallback` for deferred shell hydration
- [x] Console removal in production
- [x] Aggressive cache headers for static assets

### Remaining

- [ ] **PostCard images use `<img>` not `next/image`** — missing responsive sizes, WebP, lazy loading
- [ ] **`date-fns` removed but still in `optimizePackageImports`** — clean up config
- [ ] **Web Vitals tracking** — add Cloudflare Analytics or lightweight script
- [ ] **TiptapRenderer** could be server-rendered (currently `ssr: false`)
- [ ] **Browse page pet grid** could use Server Components for initial load (SSR + hydrate for filters)
- [ ] **LazyMotion** — use `domAnimation` feature bundle for framer-motion (smaller)

---

## 4. Feature Implementations

### Completed ✅

- [x] Pet listings CRUD (browse, list, detail, adoption applications)
- [x] Community posts (Reddit-style feed with tags, likes, comments, saves, views)
- [x] Rich text editor (TipTap)
- [x] Direct messaging with realtime subscriptions
- [x] Groups/Communities (listing, detail, create, join/leave)
- [x] Group chat (single chat per community)
- [x] User profiles with stats
- [x] Admin dashboard (7 sub-routes)
- [x] Pet favorites/wishlist
- [x] Auth (email + Google OAuth + email verification)
- [x] City landing pages for SEO
- [x] Explore/discover page
- [x] Capacitor mobile shell
- [x] Pet search with URL-synced filters

### From UI Redesign Plan — Phase Status

| Phase | Status | Details |
|-------|--------|---------|
| A: Core Layout Restructure | ✅ **Done** | `AppSidebar` + `TopBar` + `BottomNav` replace old Navbar |
| B: Community Integration | ✅ **Done** | Sidebar shows communities, community pills on feed, links fixed |
| C: Multi-room Chat | ✅ **Done** | `RoomSidebar` + `useGroupRooms` + `useCreateGroupRoom`. Room name column + unique constraint on DB (Aug 2026) |
| D: Feed & Post Redesign | ⚠️ **Partial** | PostCard exists but no upvote/downvote, no infinite scroll |
| E: Mobile Polish | ⚠️ **Partial** | `NativeProvider` with haptics + native dialogs + push notification registration. No PWA service worker yet |
| F: Native App Shell | ✅ **Done** | Capacitor 8 configured, live-URL WebView, `lib/capacitor/` native bridge, `scripts/build-android.cjs` |

### Pending Features

| Feature | Priority | Effort |
|---------|----------|--------|
| ~~Multi-room chat per community (Phase C)~~ | ✅ Done | — |
| Infinite scroll / pagination for feed | 🟠 High | 3 hrs |
| Multi-image upload for pet listings | 🟡 Medium | 4 hrs |
| Adoption application status tracking | 🟡 Medium | 3 hrs |
| Email notifications (Supabase Edge Functions + Resend) | 🟡 Medium | 4 hrs |
| PWA service worker + push notifications | 🟡 Medium | 4 hrs |
| Firebase setup for Android push (google-services.json) | 🟡 Medium | 1 hr |
| Success stories submission (user-submitted) | 🟢 Low | 3 hrs |

---

## 5. Admin Panel Upgrades

### Completed ✅

- [x] Dashboard with stats (total pets, users, posts, applications)
- [x] Listing management (view, edit, delete)
- [x] User management (view, roles)
- [x] Post moderation
- [x] Group management
- [x] Message oversight
- [x] Application review

### Remaining

- [ ] **Charts/graphs** — weekly signups, listings trend (use lightweight chart lib)
- [ ] **Activity log** showing recent admin actions
- [ ] **Export to CSV** for listings, users, applications
- [ ] **Bulk operations** — approve/reject multiple listings at once
- [ ] **Content management** — edit static pages from admin

---

## 6. DevOps & Infrastructure

### Completed ✅

- [x] Cloudflare Pages deployment via `@opennextjs/cloudflare`
- [x] GitHub Actions CI (lint + build)
- [x] Bundle size within 3 MiB limit (see `docs/DEPLOYMENT_FIXES.md`)
- [x] `.npmrc` with `force=true` for cross-platform deps
- [x] `strip-vercel-og.js` backup script for emergency bundle reduction
- [x] Husky + lint-staged pre-commit hooks

### Remaining

- [ ] Add bundle size check to CI (fail if worker exceeds 2.8 MiB)
- [ ] Cache `node_modules` in GitHub Actions
- [ ] Playwright E2E tests for critical flows
- [ ] Cloudflare WAF rate limiting (see `docs/SECURITY_AUDIT.md` S2)
- [ ] Database indexes on `pet_listings.status`, `pet_listings.animal_type`
- [ ] Staging environment (separate Supabase project + branch)
- [ ] Uptime monitoring via Cloudflare Health Checks

---

## 7. Code Quality & DX

### Completed ✅

- [x] `strict: true` in `tsconfig.json`
- [x] ESLint flat config with `eslint .` (not `next lint`)
- [x] Prettier + `.prettierignore`
- [x] Vitest setup with `vitest.config.ts`
- [x] Security audit (8.5/10 — see `docs/SECURITY_AUDIT.md`)

### Remaining

| Task | Priority | Effort |
|------|----------|--------|
| **Regenerate `lib/supabase/types.ts`** from live DB | 🔴 Critical | 5 min |
| ~~**Convert `useFavorites` to React Query**~~ | ✅ Done | — |
| ~~**Fix messaging N+1 and redundant profile fetches** (B1-B3)~~ | ✅ Done | — |
| **`views/` → `components/pages/`** rename (cosmetic, valid pattern) | 🟢 Low | 30 min |
| **Remove `HomeSidebar.tsx`** if replaced by `HomeRightSidebar.tsx` | 🟡 Medium | 10 min |
| **Install `@capacitor/keyboard`** (npm hanging on Windows) | 🟡 Medium | 1 min |
| **Increase test coverage** — auth, admin, forms, E2E | 🟡 Medium | 4 hrs |
| **Accessibility audit** — axe-core, keyboard nav, ARIA labels | 🟢 Low | 3 hrs |
| **Write current architecture doc** | 🟢 Low | 1 hr |

---

## Priority Matrix (August 2026)

| Priority | Task | Effort |
|----------|------|--------|
| 🔴 Critical | Regenerate Supabase types (7) | 5 min |
| 🟠 High | Infinite scroll for feed (4) | 3 hrs |
| 🟡 Medium | Multi-image upload (4) | 4 hrs |
| 🟡 Medium | Admin charts (5) | 3 hrs |
| 🟡 Medium | Email notifications (4) | 4 hrs |
| 🟡 Medium | Firebase setup for Android push | 1 hr |
| 🟡 Medium | Test coverage increase (7) | 4 hrs |
| 🟢 Low | PWA service worker (4) | 4 hrs |
| 🟢 Low | Accessibility audit (7) | 3 hrs |
| 🟢 Low | Playwright E2E (6) | 4 hrs |

---

## Notes for AI Assistants

- **Cloudflare Pages** has a 3 MiB worker bundle limit. Always check bundle size after adding dependencies.
- **No middleware** — all auth is client-side via `AuthContext`. Don't recreate middleware.
- **Server components** can use `lib/supabase/server.ts` for SEO (metadata, sitemap) but avoid `cookies()` for auth — it's flaky on CF Workers.
- **`@opennextjs/cloudflare`** is the adapter. Build with `npx opennextjs-cloudflare build`. Don't use `next export`.
- **Supabase types** are stale — many hooks use `as unknown as` casts. Regenerate with `supabase gen types typescript`.
- **Layout model**: `LayoutShell.tsx` wraps all non-admin routes with `AppSidebar` (desktop) + `TopBar` (mobile) + `BottomNav` (mobile). Admin routes have their own layout.
- Run `npx vitest --run` after changes.
- Run `npx next build` to verify. Check for TypeScript errors.
- Lint: `npm run lint` (eslint with `--max-warnings 0` in pre-commit hook).
