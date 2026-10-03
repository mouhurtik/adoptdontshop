# Growth Roadmap — AdoptDontShop (Aug 2026 → Q1 2027)

**Goal:** 1000+ DAU, safe enough for shelters, lean enough for an NGO, without a rewrite.
**Stack:** Next.js (web) + Capacitor (mobile shell) — no RN fork until Phase 3 proves it needed.
**Source of truth:** `docs/AUDIT_Aug2026.md` (60+ findings) + Supabase advisors. This doc is the *order* to do them.

---

## Phase 1: Trust (2–3 weeks) — unlocks shelters

*Without this, no shelter will list and no donor will trust the NGO.*

| # | Task | Files / DB | Why now |
|---|------|------------|---------|
| 1.1 | **Moderation queue — close the bypass** | `pet_listings` RLS `WITH CHECK (status='pending')`, admin approve/reject, `fetchPetBySlugServer` already fixed | Any client can publish `available` today (SEC-7). Shelters need a review gate. |
| 1.2 | **Reports + blocks** | new `post_reports` + `user_blocks`, `app/admin` queue, `useCommunity` report mutation | Community seeding without a report path is risky at scale. |
| 1.3 | **Verification badge flow** | `profiles.badge`, admin toggle, `UserBadge` | org accounts must be visibly distinct. |
| 1.4 | **Privacy RLS hardening** | `profiles` + `pet_favorites` SELECT policies mirror app/user privacy (already fixed client-side) | GDPR-ish; NGO credibility. |
| 1.5 | **Rate limiting** | Cloudflare WAF (dashboard, free) | Prevent spam before it needs human review. |

Exit criteria: a non-admin cannot publish a public pet or post that survives review; admin dashboard handles the full lifecycle.

---

## Phase 2: Growth (4–6 weeks) — unlocks 1000 DAU

*Acquisition via SEO, retention via push. No new backend scale yet — capped queries are fine for <500 pets.*

| # | Task | Files | Why |
|---|------|-------|-----|
| 2.1 | **Programmatic SEO — Indie-first (not breed-first)** | `app/adopt/[type]/[city]/page.tsx` where `type` = `indie-dogs`, `stray-cats`, `puppies`, `senior-dogs`, plus 4–5 education-first breed pages (e.g., `labrador`) that explain abandonment and funnel to Indies | Your data *is* Indies/strays; breed pages for Fancy breeds would be thin/empty and feed the buying cycle. Indie × city + age × city = ~20 strong pages with real pets; breed pages become mission pages ("Labs here are abandoned adults — here's why an Indie fits better"). |
| 2.2 | **Capacitor beta — push + deep links** | `lib/capacitor/push-notifications.ts`, `capacitor.config.ts`, `app/auth/callback` deep link | Retention. Without push, community posts are fire-and-forget. TestFlight/Play Internal with 10 shelter testers. |
| 2.3 | **Feed polish — Phase D minimal** | `PostCard` upvote/downvote + `useCommunity` infinite scroll (cursor pagination) | More engagement per session; unblocks infinite scroll needed later for scale. |
| 2.4 | **Seed as Team** | add `badge='team'` to seed accounts, disclose in bio | Authenticity > fake users for NGO donations. |
| 2.5 | **Affiliate, not ads** | `views/essentials/*`, `pet-essentials` slots | Monetizes at low traffic without hurting CWV/trust. |

Exit criteria: ~20 new Indie/age × city pages + 4–5 breed-education pages indexed in GSC; beta app installed by testers; push delivers a new-pet-in-your-city notification.

---

## Phase 3: Scale & Monetize (ongoing) — unlocks thousands

*Do this when `pet_listings` >500 or p95 query >400ms — not before.*

| # | Task | Files | Why deferred |
|---|------|-------|--------------|
| 3.1 | **Server-side filtering + pagination** | `hooks/usePets.ts` → `range()`+`ilike`/`eq` server-side, `views/BrowsePets.tsx` removes client filter | PERF-1's `limit(100)` is a stopgap; client filtering lies at scale (AUDIT §9). |
| 3.2 | **Chat pagination (cursor)** | `useMessages` `created_at lt` cursor + "Load older" | `limit(100)` truncates history today. |
| 3.3 | **Indexes** | `pet_listings(status, animal_type, breed, created_at)`, `messages(conversation_id, created_at)` | Advisors show 25 unused; these will be used after 3.1/3.2. |
| 3.4 | **RN decision** | Measure Capacitor beta's offline/cold-start pain | Only fork if beta proves insufficient. |
| 3.5 | **Ads (if traffic >50k/mo)** | `app/layout.tsx` ad slots, `next.config.mjs` CSP tweak | Too early now — hurts trust and CWV for little revenue. |

---

## What not to do

- No global `canonical:'/'` ever again (fixed in P0).
- No `next export`, no middleware auth, no `npm install`.
- No direct `@/lib/supabase/client` imports outside `lib/` + `contexts/AuthContext` — go through hooks.

## How to track

- SEO: GSC indexed count + impressions for `/pet/*` and new breed×city pages.
- Trust: median time-to-moderate + report resolution rate.
- Retention: DAU + push open rate (Capacitor) + 7-day return.
- Scale: p95 Supabase query duration + egress (dashboard).

## Next action

Pick **1.1** — I can ship the `WITH CHECK` migration + admin approve/reject UI next session. Say `go` and I'll start.
