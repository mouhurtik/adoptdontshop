# AdoptDontShop — Architecture Overview

**Last Updated:** February 19, 2026

---

## Rendering Strategy

**Current:** Next.js 16 — Hybrid SSR/CSR

```
Browser → Cloudflare Workers (via OpenNext) → Next.js SSR shell
                                             → React hydrates in browser
                                             → Client components fetch Supabase data
```

Most pages export `'use client'` and render entirely on the client within a server-rendered layout shell. The `not-found.tsx` page is a pure Server Component.

| Strategy | Used For |
|----------|----------|
| SSR Shell + CSR Content | Home, Browse, Profile, List Pet, Admin |
| Server Component | 404 page, Layouts with metadata |
| Static (SSG) | Not yet enabled |
| ISR | Not yet enabled (no R2/KV cache configured) |

> **Future path:** Enable ISR for pet detail pages and SSG for landing pages once R2/KV caching is configured in `open-next.config.ts`.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (Turbopack) | SSR/SSG/CSR rendering + routing |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS 3 + shadcn/ui | Design system + accessible components |
| State | React Query (TanStack) | Server state caching + deduplication |
| Auth & DB | Supabase (`@supabase/ssr`) | Auth, Postgres, Storage |
| Forms | Client-side form handling | Form state + validation |
| Animations | Framer Motion | Page transitions + interactions |
| Hosting | Cloudflare Workers (OpenNext) | Edge SSR + CDN |
| CI/CD | GitHub Actions | Lint, test, build on push |

---

## Project Structure

```
adoptdontshop/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout (Navbar, Footer, Providers)
│   ├── providers.tsx        # Client-side providers (QueryClient, Auth, Toast)
│   ├── page.tsx             # Home page (delegates to views/Home)
│   ├── not-found.tsx        # 404 page (Server Component)
│   ├── globals.css          # Global styles
│   ├── robots.ts            # SEO robots config
│   ├── sitemap.ts           # Dynamic sitemap generation
│   ├── browse/              # Browse pets page
│   ├── pet/                 # Individual pet details
│   ├── profile/             # User profile + my-listings
│   ├── admin/               # Admin dashboard
│   ├── login/               # Authentication pages
│   ├── signup/              # Sign up page
│   └── ...                  # Other route directories
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui primitives
│   ├── home/                # Home page sections (Hero, Search, etc.)
│   ├── browse/              # Browse/search components
│   └── ...                  # Other component groups
├── views/                   # Page-level view components
├── hooks/                   # Custom React hooks
├── contexts/                # React Context providers (AuthContext)
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client (lazy singleton)
│   │   ├── server.ts        # Server Supabase client (per-request)
│   │   └── types.ts         # Auto-generated database types
│   └── imageLoader.ts       # Custom image loader for Cloudflare
├── types/                   # Shared TypeScript types
├── utils/                   # Pure utility functions
├── constants/               # App constants & config
├── data/                    # Static data files
├── docs/                    # Project documentation
│   ├── architecture/        # This file
│   ├── features/            # Feature specs
│   └── archive/             # Archived docs
├── .github/workflows/       # CI/CD pipeline (ci.yml)
├── open-next.config.ts      # OpenNext Cloudflare adapter config
├── wrangler.toml            # Cloudflare Workers deployment config
└── next.config.mjs          # Next.js configuration
```

---

## Database Schema

```
┌─────────────────────┐     ┌──────────────────────────┐
│   pet_listings      │     │  adoption_applications   │
├─────────────────────┤     ├──────────────────────────┤
│ id (PK)             │◄────│ pet_listing_id (FK)      │
│ pet_name            │     │ id (PK)                  │
│ animal_type         │     │ full_name                │
│ breed               │     │ mobile_number            │
│ age                 │     │ age, gender              │
│ location            │     │ occupation               │
│ description         │     │ pet_experience           │
│ medical_info        │     │ adoption_reason          │
│ image_url           │     │ financial_status         │
│ status              │     │ family_approval          │
│ user_id             │     │ agreed_terms             │
│ caregiver_name      │     │ agreed_responsibility    │
│ mobile              │     │ status                   │
│ created_at          │     │ created_at, updated_at   │
│ updated_at          │     └──────────────────────────┘
└─────────────────────┘
         │
         │     ┌─────────────────────┐
         │     │   profiles          │
         │     ├─────────────────────┤
         └────►│ id (PK, FK→auth)    │
               │ display_name        │
               │ avatar_url          │
               │ phone, location     │
               │ bio                 │
               │ account_type        │
               │ organization_name   │
               └─────────────────────┘

┌─────────────────────┐
│   user_roles        │
├─────────────────────┤
│ user_id (FK→auth)   │
│ role                │
└─────────────────────┘
```

---

## Data Flow

```
User Action → React Component → Custom Hook → Supabase Client → Postgres
                                    ↑
                               React Query
                            (cache + dedup)
```

**Key flows:**
1. **Browse pets:** `BrowsePets` → `usePets()` → `supabase.from('pet_listings').select('*')`
2. **List a pet:** `PetListingForm` → `supabase.from('pet_listings').insert()`
3. **Apply to adopt:** `AdoptionModal` → `supabase.from('adoption_applications').insert()`
4. **Auth:** `AuthContext` → `supabase.auth.signInWithPassword()` / `.signUp()`

---

## Provider Hierarchy

```tsx
<html>
  <body>
    <Providers>                    {/* 'use client' boundary */}
      <QueryClientProvider>        {/* React Query cache */}
        <AuthProvider>             {/* Auth state + Supabase session */}
          <TooltipProvider>        {/* shadcn tooltips */}
            <Toaster />            {/* Toast notifications */}
            <Sonner />             {/* Sonner notifications */}
            {children}             {/* Page content */}
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Providers>
  </body>
</html>
```

---

## Deployment

**Platform:** Cloudflare Workers via [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)

```
npm run cf:build    → opennextjs-cloudflare build → .open-next/
npm run cf:deploy   → build + wrangler deploy
```

**Environment variables** must be set in the Cloudflare Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**CI/CD:** GitHub Actions (`ci.yml`) runs lint, test, build on push to `main`/`develop`.
