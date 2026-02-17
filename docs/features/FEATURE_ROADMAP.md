# AdoptDontShop — Feature Roadmap

**Last Updated:** February 17, 2026

---

## Current Features (v2.0 — Post Next.js Migration)

| Feature | Status | Notes |
|---------|--------|-------|
| Browse pets with filters | ✅ Live | Type, age, urgent, sort |
| Pet detail page with gallery | ✅ Live | SEO slug URLs + SSR `generateMetadata` |
| List a pet for adoption | ✅ Live | Form with validation |
| Adoption application | ✅ Live | In-modal form |
| Shareable pet cards | ✅ Live | Image generation |
| Pet essentials guide | ✅ Live | Educational content |
| Success stories | ✅ Live | Static content |
| Sponsor showcase | ✅ Live | Static content |
| Dark mode | ✅ Live | System + manual toggle |
| Responsive design | ✅ Live | Mobile-first |
| Basic auth context | ✅ Built | Not fully integrated |
| **Next.js App Router** | ✅ **Live** | **SSR, SEO, Cloudflare Pages** |
| **Dynamic OG meta tags** | ✅ **Live** | **Per-pet SEO via `generateMetadata`** |

---

## Planned Features

### Phase 1 — Security Foundation 🔴
- [ ] `profiles` table with auto-creation trigger on signup
- [ ] `user_roles` table (admin, user, shelter_owner, moderator)
- [ ] RLS policies on all tables (`pet_listings`, `adoption_applications`, etc.)
- [ ] Link `pet_listings` to `user_id`

### Phase 2 — Authentication + User Profiles 🟡
- [ ] Login / Signup pages
- [ ] Account type selection (Individual / Organization)
- [ ] Next.js auth middleware for protected routes
- [ ] Profile settings page
- [ ] "My Listings" page
- [ ] Navbar login/profile state

### Phase 3 — SEO & Performance 🟢
- [ ] Per-page metadata on all static pages
- [ ] `sitemap.xml` generation (dynamic from Supabase)
- [ ] `robots.txt`
- [ ] `next/image` optimization (PetCard, Gallery, FeaturedPets)
- [ ] ISR (Incremental Static Regeneration) on pet pages

### Phase 4 — Admin Portal & Messaging 🔵
- [ ] Admin dashboard with analytics
- [ ] User management (view, disable, role assignment)
- [ ] Listing moderation (approve / reject)
- [ ] Adoption application review
- [ ] Privacy-focused messaging via Supabase Realtime
- [ ] Conversation list with unread counts

---

## Future Considerations (v3.0+)

| Feature | Priority | Notes |
|---------|----------|-------|
| Organization accounts | Medium | Bulk listing, team management, verified badge |
| Email notifications | Medium | New messages, application updates |
| Pet favorites / wishlist | Low | Requires auth (Phase 2) |
| Advanced search (location) | Low | Geolocation filtering |
| Blog / content section | Low | SEO value, educational content |
| Native mobile app | Low | Capacitor or React Native |
| Multi-language support | Low | i18n for regional expansion |

---

## Completed Phases

### ~~Phase 0 — Next.js Migration~~ ✅
- [x] Migrate React + Vite → Next.js 16 App Router
- [x] Deploy to Cloudflare Pages via @opennextjs/cloudflare
- [x] Migrate `usePets.ts` to React Query
- [x] Clean up deprecated Vite files (`src/`, `vite.config.ts`, etc.)
- [x] Rename `pages_old/` → `views/`
- [x] Update all documentation (README, .env.example)
- [x] TypeScript strict mode: 0 errors
