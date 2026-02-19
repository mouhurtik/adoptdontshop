# AdoptDontShop — Architecture Overview

**Last Updated:** February 16, 2026

---

## Rendering Strategy

**Current:** SPA (Single Page Application) — Client-side rendered React

```
Browser → Cloudflare CDN → index.html + JS bundle
                           → React renders in browser
                           → Supabase API calls for data
```

**Future path:** If SEO becomes critical, migrate to Next.js with mixed rendering (SSG for static pages, SSR for search, ISR for pet details, CSR for admin/messaging).

See the [implementation plan](../../.gemini/antigravity/brain/98b2cb4c-9393-4eca-a54c-23352b9b9b5a/implementation_plan.md) for detailed SSR vs SPA analysis.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + Vite 5 | UI rendering + build tooling |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS 3 + shadcn/ui | Design system + accessible components |
| State | React Query (TanStack) | Server state caching + deduplication |
| Auth & DB | Supabase | Auth, Postgres, Realtime, Storage |
| Routing | React Router v6 | Client-side navigation |
| Forms | React Hook Form + Zod | Form state + validation |
| Animations | Framer Motion | Page transitions + interactions |
| Hosting | Cloudflare Pages | Global CDN + edge serving |
| CI/CD | GitHub Actions | Lint, test, build on push |

---

## Project Structure

```
adoptdontshop-website/
├── docs/                    # 📚 Project documentation
│   ├── architecture/        # Architecture decisions & diagrams
│   └── features/            # Feature specs & roadmaps
├── public/                  # Static assets (favicon, OG images)
├── src/
│   ├── App.tsx              # Root — routes, providers, layout
│   ├── main.tsx             # Entry point
│   ├── pages/               # Route-level components (lazy-loaded)
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (don't edit)
│   │   ├── home/            # Home page sections
│   │   ├── browse/          # Browse/search components
│   │   ├── pet-details/     # Pet detail page components
│   │   ├── pet-listing/     # Pet listing form
│   │   └── __tests__/       # Component tests
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React context providers (Auth)
│   ├── types/               # TypeScript type definitions
│   ├── integrations/        # Third-party integrations (Supabase)
│   ├── utils/               # Pure utility functions
│   ├── constants/           # App constants & config
│   └── data/                # Static data files
├── supabase/                # Supabase project config
├── .github/workflows/       # CI/CD pipelines
└── wrangler.jsonc           # Cloudflare deployment config
```

---

## Database Schema (Current)

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
│ caregiver_name      │     │ agreed_terms             │
│ mobile              │     │ agreed_responsibility    │
│ created_at          │     │ status                   │
│ updated_at          │     │ created_at, updated_at   │
└─────────────────────┘     └──────────────────────────┘
```

> ⚠️ **No RLS enabled. No user linkage.** Both tables are publicly readable/writable. This is the #1 security priority to fix.

---

## Data Flow

```
User Action → React Component → Custom Hook → Supabase Client → Postgres
                                    ↑
                               React Query
                            (cache + dedup)
```

**Key flows:**
1. **Browse pets:** `BrowsePets.tsx` → `usePets()` → `supabase.from('pet_listings').select('*')`
2. **List a pet:** `PetListingForm.tsx` → `supabase.from('pet_listings').insert()`
3. **Apply to adopt:** `AdoptionModal.tsx` → `supabase.from('adoption_applications').insert()`
4. **Auth:** `AuthContext.tsx` → `supabase.auth.signInWithPassword()` / `.signUp()`

---

## Provider Hierarchy

```tsx
<ErrorBoundary>
  <QueryClientProvider>     // React Query cache
    <AuthProvider>           // Auth state + methods
      <TooltipProvider>      // shadcn tooltips
        <BrowserRouter>      // React Router
          <Layout>           // Navbar + Footer
            <Suspense>       // Lazy loading fallback
              <Routes />     // Page routing
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
</ErrorBoundary>
```
