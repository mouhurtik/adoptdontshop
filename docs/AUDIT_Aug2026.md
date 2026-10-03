# AdoptDontShop — Full Codebase Audit & Improvement Plan

**Date:** August 23, 2026
**Audited at commit:** `1390541` (main)
**Method:** Deep audit — 5 parallel category sweeps (correctness, security, performance, testing, debt/DX) + live-site SEO checks (curl against adoptdontshop.xyz) + Supabase advisors (MCP) + design review. Every finding carries `file:line` evidence and a confidence rating.
**Baseline verification (all passing at audit time):** `tsc --noEmit` ✅ · `eslint . --max-warnings 0` ✅ · `vitest --run` 55/55 ✅

---

## 0. Fixes Applied (Aug 23, 2026 session) — awaiting your deploy + test

| Status | Finding | What was done |
|--------|---------|---------------|
| ✅ FIXED | SEO-1 pet pages canonical→homepage | New cookie-free `createPublicSupabaseClient()` (`lib/supabase/server.ts`) used by pet metadata/sitemap/feed/city pages — sidesteps the flaky `cookies()` path on Cloudflare; silent catches removed with error logging; unresolved slugs now get `noindex,follow` instead of inheriting homepage canonical |
| ✅ FIXED | Static pages all canonicalized to `/` (discovered during fixing — worse than SEO-1: /about, /browse, /explore, /terms, /welcome etc. ALL pointed at homepage) | Removed global `alternates.canonical:'/'`; explicit self-canonical added to home + 10 static routes |
| ✅ FIXED | SEO-2 double-brand city titles | Brand suffix removed from page title (layout template supplies it) |
| ✅ FIXED | §8.1 font-black never rendering | Nunito now loads 800/900 weights (`app/layout.tsx`) |
| ✅ FIXED | §8.2 hidden H1 on feed | Visible compact H1 replaces sr-only (`views/CommunityFeed.tsx`) |
| ✅ FIXED | PERF-9 stale preconnect | Now derived from env var; dead project ref removed |
| ✅ FIXED | BUG-2 pending pets publicly renderable | `.in('status', ['available','urgent'])` on slug lookups |
| ✅ FIXED | SEO-3 (partial) | All URL generation now flows through `generatePetSlug()` (server-queries, sitemap, city JSON-LD); raw-UUID link cleanup still open |
| ✅ FIXED | SEC-4 JSON-LD injection | `serializeJsonLd()` helper escapes `<`/`>`/U+2028/9; wired into post detail + city pages |
| ✅ FIXED | SEC-5 RSS injection | XML escaping + CDATA guard + storage-host allowlist for enclosures |
| ✅ FIXED | BUG-10 imageLoader crash path | try/catch fallback matching sibling helper |
| ✅ FIXED | BUG-6 `?type=blank grid | Whitelist validation in `useFilters.ts` |
| ✅ FIXED | BUG-7 filter/pagination desync | Page resets on any filter change + clamp effect + memoized filter/sort |
| ✅ FIXED | BUG-5 object URL leak | Revoke on replace/remove/reset |
| ✅ FIXED | BUG-3 view-count inflation | RPC moved out of queryFn into once-per-mount effect with catch |
| ✅ FIXED | BUG-4 sign-out race | `isCancelled` guard threaded through `loadProfileAndRoles` |
| ✅ FIXED | BUG-1 unread badge always 0 | Unread counts computed from real `messages.read_by` data |
| ✅ FIXED | SEC-2 (8 of 10 advisors cleared) | Migration applied via MCP + committed as first repo migration: trigger helpers no longer RPC-callable; search_path pinned on both unhardened functions. `is_admin` intentionally kept callable (RLS depends on it); `increment_view_count` kept for anon views |
| 🔜 NEXT | Everything else | See Phases 1–3 below |

**Verification after fixes:** `tsc --noEmit` ✅ · `eslint . --max-warnings 0` ✅ · vitest 55/55 ✅ · `next build` 46 pages ✅

---


## 1. Executive Summary

The codebase is in good structural health after the Vite → Next.js migration: clean layering (`app/ → views/ → components/ → hooks/ → lib/`), strict TypeScript, working CI, RLS on all tables, and a genuinely playful design system. The Feb 2026 score of 7.2 has held.

**But the audit found that your #1 complaint — bad SEO — has a specific, provable root cause that no amount of meta-tag work will fix until it's patched:**

> **Pet detail pages are telling Google they are the homepage.** Live check of `https://adoptdontshop.xyz/pet/santra-c866752a`: `<title>Pet Details | AdoptDontShop</title>` (generic fallback) + `<link rel="canonical" href="https://adoptdontshop.xyz">`. The page body correctly renders "Santra" server-side, but `generateMetadata()`'s identical DB query silently fails (its error is swallowed by an empty `catch`), so every pet page inherits the root layout's default canonical `/` (app/layout.tsx:43). With ~25 pet URLs in the sitemap each claiming "I am the homepage," Google gets contradictory signals on your most valuable pages. **This is very likely why rankings are poor despite the good metadata work.**

### Scorecard (vs. Feb 2026 review)

| Category | Score | Trend | Headline |
|----------|-------|-------|----------|
| SEO correctness | **4.5/10** | 🔴 new | Pet pages canonical to homepage; city titles double-brand |
| Correctness | 6.5/10 | 🟡 | Unread badges always zero; pending pets publicly renderable; slug chaos |
| Security | 8.0/10 | 🟢 | June fixes held; new gaps: public RPC exposure, profiles columns, no CSP |
| Performance | 7.5/10 | 🟢 | Big wins landed; unbounded queries + full-size images remain |
| Testing | 4.5/10 | 🔴 | Suite green for wrong reasons (dead component anchored by its test); auth untested |
| Architecture | 8.0/10 | 🟢 | Sound; data-access bypassed in ~29 places |
| DX & Docs | 6.5/10 | 🟡 | pnpm/npm identity crisis; README describes deleted folders |
| Design | 7.5/10 | 🟡 | Strong identity; one systemic typography defect |

---

## 2. 🔴 P0 — Fix This Week (production-verified)

### SEO-1 · Pet pages emit fallback title + homepage canonical
- **Evidence (live):** `curl /pet/santra-c866752a` → title `Pet Details | AdoptDontShop`, canonical `https://adoptdontshop.xyz`, og:title = homepage default. Body HTML *does* contain the pet name (SSR body query works).
- **Root cause:** `app/pet/[slug]/page.tsx:16-63` — `generateMetadata` wraps its Supabase query in `try { } catch { }` with empty catch. The page component's query succeeds while the metadata query fails per-request (no-store headers confirm it's live, not ISR cache). Suspect: `cookies()`-based client (`createServerSupabaseClient`) misbehaving inside metadata resolution on OpenNext/Cloudflare — matches ROADMAP warning "avoid cookies() … flaky on CF Workers."
- **Fix sketch:** Metadata only needs *public* data → use a plain anon-key Supabase client (no cookie/session handling) for `generateMetadata`, sitemap, feed.xml. Remove the silent catch; log failures. Also stop setting global `alternates.canonical: '/'` in app/layout.tsx:42-44 so failed routes can't claim to be the homepage.
- **Effort:** S–M · **Risk:** LOW · **Confidence:** HIGH (production-proven)

### SEO-2 · City landing pages have doubled brand in title
- **Evidence (live):** `/adopt-pets-in/mumbai` → `<title>… | AdoptDontShop | AdoptDontShop</title>`
- **Root cause:** Page hardcodes brand into its title (`app/adopt-pets-in/[city]/page.tsx:34`) while root layout template appends it again (`app/layout.tsx:27`).
- **Fix:** Strip `| AdoptDontShop` from the page-level title string.
- **Effort:** S · **Risk:** LOW · **Confidence:** HIGH

### SEO-3 · Three competing pet URL formats create duplicate content
- **Evidence:** Stored/generated slug via `slugify` (`utils/slugUtils.ts:15-49`) vs. inline regeneration without special-char handling (`lib/supabase/server-queries.ts:119,150` — "Bella & Max" → `bella-&-max-{id}` vs stored `bella-max-{id}`) vs. raw UUID links (`app/user/[id]/page.tsx:348`, `components/home/HomeSidebar.tsx:67`). Naive `slug.split('-').pop()` parsing (`server-queries.ts:133`) lacks the hex validation `parseSlugId` has.
- **Impact:** Same pet reachable under 2–3 URL shapes; raw-UUID links get generic metadata. Splits link equity, confuses crawling.
- **Fix:** One source of truth — always use stored `slug` column + `generatePetSlug`; redirect legacy/raw-UUID paths to canonical slug with 301s.
- **Effort:** M · **Risk:** MED (need redirect plan for indexed URLs) · **Confidence:** HIGH

### BUG-1 · Conversation unread badge is permanently zero
- **Evidence:** `hooks/useMessages.ts:59` casts rows through `as unknown as { read_by?: string[] }` — but `conversations` has **no `read_by` column** (`lib/supabase/types.ts:136+`; `read_by` exists only on `messages`, line 282). Badge sums always-0 counts (`components/FloatingMessages.tsx:71`). The cast silenced exactly the compiler error that would have caught this.
- **Fix:** Derive unread from `messages` (same predicate as `useUnreadCount`) or add a real last-read column. Delete the cast.
- **Effort:** M · **Risk:** LOW · **Confidence:** HIGH

---

## 3. Correctness Bugs (beyond P0)

| ID | Finding | Evidence | Effort | Conf |
|----|---------|----------|--------|------|
| BUG-2 | Pending/rejected listings fully renderable via direct URL — SSR lookup omits status filter (sitemap excludes them; mismatch leaks pre-moderation content) | `lib/supabase/server-queries.ts:138-143`, contrast `app/sitemap.ts:38` | S | HIGH |
| BUG-3 | View counter increments on every React Query refocus/refetch (RPC fired inside `queryFn`, fire-and-forget, no catch) | `hooks/useCommunity.ts:121-122` | S | HIGH |
| BUG-4 | Sign-out race can write stale profile + `isAdmin:true` into cleared auth state (cancellation flag not checked inside profile loader) | `contexts/AuthContext.tsx:101-106,134-165` | S | MED |
| BUG-5 | Photo preview object URLs never revoked → memory leak across form session | `components/pet-listing/PetListingForm.tsx:49-57,176-180` (zero `revokeObjectURL` repo-wide) | S | HIGH |
| BUG-6 | `?type=` param unvalidated → stale/shared link like `/browse?type=banana` silently blanks grid | `hooks/useFilters.ts:13,67-69` | S | HIGH |
| BUG-7 | Filter changes don't reset pagination → page 3 + narrower filter = empty-looking grid | `views/BrowsePets.tsx:56-58,159` | S | HIGH |
| BUG-8 | `markAsRead` read-modify-write clobbers concurrent updates to `messages.read_by` (needs atomic RPC) | `hooks/useMessages.ts:267-283` | M | MED |
| BUG-9 | `startConversation` select-then-insert race creates duplicate conversation threads between same pair | `hooks/useMessages.ts:179-207` | M | MED |
| BUG-10 | Default image loader throws on malformed src while its sibling helper has try/catch — wired globally via `loaderFile`, so one bad DB row can crash any page render | `lib/imageLoader.ts:14` vs `:29-36` | S | MED |
| BUG-11 | Privacy settings collected but never enforced — `_privacy` dead variable; favorites + like-history rendered publicly regardless | `app/user/[id]/page.tsx:64,131-150,298-325` | S/M | HIGH |

---

## 4. Security (new findings beyond June audit — which held up well)

| ID | Finding | Evidence | Effort | Conf |
|----|---------|----------|--------|------|
| SEC-1 | **DB schema/RLS not in version control** — `supabase/` has zero SQL files; the authorization model exists only in the hosted dashboard. Blocks auditing, drift detection, incident recovery | `supabase/` contents | M | HIGH |
| SEC-2 | **9 Supabase functions callable via public RPC**, incl. `is_admin(user_id)` (lets anyone probe admin status of arbitrary IDs), `handle_new_user`, `increment_view_count` (unlimited view inflation), count-update triggers. Most are trigger helpers that should never be RPC-exposed | Supabase security advisors (live) | S | HIGH |
| SEC-3 | **`profiles` SELECT is world-readable including `fcm_token` + `phone`** — RLS restricts rows, not columns; push tokens enumerable by anyone with anon key | `lib/supabase/types.ts:514-519` + advisor policy docs | S | MED |
| SEC-4 | User-authored fields interpolated into JSON-LD without `<` escaping (`JSON.stringify` doesn't escape angle brackets) — contradicts SECURITY_AUDIT.md claim of "hardcoded data only" | `views/CommunityPostDetail.tsx:121-161`, `app/adopt-pets-in/[city]/page.tsx:88-106` | S | HIGH |
| SEC-5 | RSS feed interpolates post title/image URL into hand-built XML unescaped; cached 1h publicly | `app/feed.xml/route.ts:20,25,45` | S | HIGH |
| SEC-6 | Post-auth `redirect` param used raw from query string in login; OAuth callback glues request-derived origin without same-origin check | `app/login/LoginForm.tsx:14,64,84`, `app/auth/callback/route.ts:9,32` | S | HIGH |
| SEC-7 | Listing `status` set client-side on INSERT with no `WITH CHECK` constraint → direct API calls skip moderation queue | `components/pet-listing/PetListingForm.tsx:152` + advisor policy docs | S | MED |
| SEC-8 | No CSP / X-Frame-Options / Referrer-Policy / Permissions-Policy headers anywhere in next.config.mjs | `next.config.mjs:16-71` | M | HIGH |
| SEC-9 | Turnstile token never verified by app code (no siteverify call); adoption/listing/post forms send none — widget decorative outside GoTrue config | repo-wide search | M | HIGH |
| SEC-10 | Photo upload has no size/MIME cap before canvas pipeline; bucket rules unverifiable (see SEC-1) | `PhotoUploadSection.tsx:37`, `PetListingForm.tsx:45-52` | S | MED |
| SEC-11 | Supabase platform items: leaked-password protection OFF, OTP expiry >1h, Postgres 15.8.1.054 needs security patches, mutable search_path on 2 functions | Advisors (live) | S | HIGH |

**Also confirmed fine:** Capacitor `allowNavigation` scoped correctly; Tiptap v3 Link blocks dangerous schemes; no service-role keys client-side; sitemap exposes slugs/timestamps only.

---

## 5. Performance

Recent wins verified real (LCP preload, deferred shell, dynamic imports, SSR-first feed). Remaining, ordered:

| ID | Finding | Evidence | Impact | Effort |
|----|---------|----------|--------|--------|
| PERF-1 | **Unbounded queries everywhere**: whole `pet_listings` table on browse refetch, entire chat histories, all groups/members/posts; conversations query fires on every page via FloatingMessages | `usePets.ts:25-29`, `useMessages.ts:28-31,72-77`, `useGroups.ts:57-70,99-103,289-294`, `FloatingMessages.tsx:18` | Egress + memory grow linearly with data; free-tier constraint | S–M |
| PERF-2 | **Full-size originals ship as LCP image**: transform revert left imageLoader a passthrough; PostCard renders raw `featured_image_url`; PetCard/PetGallery pass `unoptimized`; homepage preloads that same original at high priority | `imageLoader.ts:11-22`, `PostCard.tsx:81-90`, `PetCard.tsx:62,116`, `page.tsx:27-34` | Dominant mobile payload; caps LCP. Fix = resize at upload (sharp already installed), avoid runtime transforms that 400'd on free tier | M |
| PERF-3 | Dual framer-motion bundles: ScrollReveal uses `m`+LazyMotion, other 15 files import full `motion` (incl. PetCard on home) | `ScrollReveal.tsx:3` vs `PetCard.tsx:5` et al. | ~15–25KB gz per route | M |
| PERF-4 | Six pure-text legal/marketing views hydrate full React tree solely for scroll-to-top + reveal animation | `PrivacyPolicy.tsx:1-12`, `TermsAndConditions.tsx:1`, `AboutUs.tsx:1` (+3) | Wasted JS on low-end mobile SEO landings | M |
| PERF-5 | Browse re-filters + re-sorts whole list unmemoized per keystroke; double-fetch after staleness | `BrowsePets.tsx:53`, `useFilters.ts:120-123` | Input jank as listings grow | S |
| PERF-6 | AuthContext rebuilds value object every render; ~3 cascade re-renders of all consumers on load; cards unwrapped by memo | `AuthContext.tsx:326-335`, `PetCard.tsx:27-28` | Scripting time on card grids | S |
| PERF-7 | Three distinct query keys fetch overlapping "hot posts" data (sidebars co-mounting = duplicate round-trips incl. profiles batch) | `TrendingSidebar.tsx:16`, `HomeSidebar.tsx:31`, `ExplorePage.tsx:22` | Redundant requests defeat caching | S |
| PERF-8 | 1-year immutable Cache-Control applies to unhashed files (`favicon.ico`, hero images) → future asset changes invisible up to a year | `next.config.mjs:16-49` | Latent correctness trap | S |
| PERF-9 | Hardcoded preconnect to **stale Supabase project ref** `aauevdimrbiowvxpllal…` (your live ref is `uibsmaizlrekfooryrwq`) — wasted handshake every load | `app/layout.tsx:151` | ~100–300ms connection setup risk | S |
| PERF-10 | ScrollReveal mounts listener + rebuilds variants per instance; wraps individual grid cards | `ScrollReveal.tsx:33-62`, `FeaturedPets.tsx:93-99` | Hydration tax ahead of LCP | S |

---

## 6. Testing (suite passes — for partly wrong reasons)

Git archaeology: July cleanup deleted `Navbar.tsx`/`ProtectedRoute.tsx`; CI broke because `Navbar.test.tsx` imported it; commit `59de3c9` **restored the dead 282-line Navbar just to keep its test green**. ROADMAP still says both were deleted.

| ID | Finding | Evidence | Effort |
|----|---------|----------|--------|
| TEST-1 | Dead-component cluster + tests anchoring it: `Navbar.tsx` (test-only importer), `ProtectedRoute.test.tsx` (tests its own inline copy of logic — covers zero real code), `PostCardServer.tsx` (147 lines, zero importers), `ContactInfo.tsx` (zero importers — superseded by ContactInfoCard) | git `59de3c9`, grep verification | S |
| TEST-2 | **AuthContext (352 lines, top churn) zero coverage** — username retry loop, isLoading paths, isAdmin derivation all unpinned; feeds AdminGuard + every hook | `contexts/AuthContext.tsx` | M |
| TEST-3 | PetListingForm (the conversion funnel) untested: WebP conversion, storage upload, HEAD verify, insert payload | `components/pet-listing/*` (no test dir) | L |
| TEST-4 | Realtime channel lifecycle untested (stale-channel-on-switch bug class would ship unnoticed); two copy-pasted implementations double the surface | `useMessages.ts:325-367`, `useGroupChat.ts:254-295` | M |
| TEST-5 | AdminGuard decision matrix untested; depends on 8s real timer (needs fake timers first) | `AdminGuard.tsx:8,31-58` | S |
| TEST-6 | SEO endpoints fail silent-empty, untested: sitemap swallows errors → deindex risk; feed.xml XML built by string concat | `sitemap.ts:35-51`, `feed.xml/route.ts:14-27` | M |
| TEST-7 | Coverage tooling installed (`@vitest/coverage-v8`) but never configured or run in CI — coverage has literally never been measured | `vitest.config.ts:10-14`, `ci.yml:44-45` | S |
| TEST-8 | No shared Supabase mock seam; each suite hand-rolls different chain depths; CI depends on placeholder creds | `vitest.setup.ts:1`, `ci.yml:47-48` | M |

---

## 7. Tech Debt · DX · Dependencies · Docs

| ID | Finding | Evidence | Effort |
|----|---------|----------|--------|
| DEBT-1 | **pnpm/npm identity crisis**: README says npm 9+, scripts invoke `npm run` internally, `.npmrc` has npm-only flags (`force`, `legacy-peer-deps`), but CI uses pnpm 9 + Node 22 (README says 20+) | `README.md:66,78`, `package.json:18-19`, `.npmrc:1-2`, `ci.yml:26-45` | S |
| DEPS-1 | npm `overrides` block (incl. ws 8.18.3 security pin) is **inert under pnpm** — lockfile contains no overrides; pins you think are applied aren't | `package.json:105-109` vs `pnpm-lock.yaml` | S |
| DX-1 | CI security-audit job can never fail (`pnpm audit … \|\| true`); warning-suppression env vars mask deprecations | `ci.yml:10-11,111` | S |
| DEBT-2 | Two toast systems mounted; Radix toaster + `use-toast.ts` + `ui/toast.tsx` (~320 lines) completely dead — everything uses sonner | `providers.tsx:5,34`; sole `use-toast` importer is its own wrapper | S |
| DEBT-3 | Relative-time logic duplicated by hand in PostCard + PostCardList while date-fns sits in the stack (8 files already standardize on it) | `PostCard.tsx:186`, `PostCardList.tsx:115` | S |
| DEBT-4 | Data access three patterns deep: hooks layer bypassed by 29 direct `@/lib/supabase/client` imports (incl. all admin pages) — TanStack caching/staleTime never applies there | `CommunityWrite.tsx:14`, `admin/*.tsx`, `HeroSection.tsx:7`, `AppSidebar.tsx:12` +24 more | L |
| DEBT-5 | Shared domain types live inside UI component: `server-queries.ts:163` and `useCommunity.ts:7` import `PostCardData` from a presentation component (layering inversion) | also `TrendingSidebar.tsx:6`, `CommunityPostDetail.tsx:10` | S |
| DEBT-6 | God files: `SignupForm.tsx` (527 lines), `profile/settings/page.tsx` (501) — both on auth-critical paths | wc -l | M |
| DX-2 | Stale generated types force `as unknown as` casts (tracked in ROADMAP — still present in 6 hook sites); regenerating is the 5-min critical task | `useGroups.ts:72,88,151,216,223`, `useGroupChat.ts:166` | S |
| DOCS-1 | docs/README.md links to nonexistent paths (`CODE_QUALITY_REVIEW.md`, `features/FEATURE_ROADMAP.md`) | `docs/README.md:10-23` | S |
| DOCS-2 | README structure section lists deleted dirs/files (`Footer.tsx`, `constants/`, `data/`); tsconfig includes ghost paths too; CONTRIBUTING link broken (lives in docs/) | `README.md:150-160,190`, `tsconfig.json:48-49` | S |
| DX-3 | No AGENTS.md/CLAUDE.md despite committed multi-agent skill infra — tribal knowledge (pnpm-only, hooks-layer rule, sonner-not-Radix) lives in contradictory docs | root listing | S |
| DEPS-2 | `@capacitor/cli` in prod deps (build tooling); `@types/sharp` deprecated stub (sharp ships own types since 0.32) | `package.json:29,79` | S |

---

## 8. Design Review

The visual identity is genuinely distinctive — warm cream base, coral/teal accents, blob-shaped imagery, rotated highlight behind "For Life," rounded 2xl geometry, Quicksand/Nunito pairing. It doesn't read templated. Issues found:

1. **Typography defect (systemic): `font-black` (900) used in ~78 places on headings, but Nunito loads only weights 400/700** (`app/layout.tsx:15-20`). Browsers synthesize faux-bold — the intended display weight never actually renders, slightly blurry/mushy on every page headline. Fix: load Nunito 800/900 subset (tiny woff2 delta) or standardize on font-extrabold + weight 800. *(HIGH confidence)*
2. **Hidden H1 tactic**: homepage feed renders `<h1 class="sr-only">AdoptDontShop — Pet Adoption & Community Portal</h1>` (`views/CommunityFeed.tsx:68`) — text hidden purely for crawlers violates Google's guidelines and risks a manual-action flag; commit `3c13f5a` introduced it deliberately. Replace with a visible, styled H1 (even compact) — the feed header deserves one anyway.
3. **Toast inconsistency risk** (ties to DEBT-2): two systems coexist; contributors guess right only by luck. Declare sonner the single system.
4. Minor: `text-gray-*` used alongside theme tokens in several components (`TrendingSidebar`, `OurStoryWidget`) — gray scale drifts from `playful-text` (#2D3436); worth a pass for cohesion.
5. Accessibility note (from ROADMAP, still open): no axe-core audit yet; combined with faux-bold rendering, heading legibility on low-end devices is the place to start.

---

## 9. Direction (product options — maintainer's call, grounded in repo evidence)

1. **Finish Phase D (Reddit-model feed)**: ROADMAP marks upvote/downvote + infinite scroll missing while the UI redesign bet everything on the Reddit model. Infinite scroll also fixes PERF-1's browse-grid growth. Highest product-value item already scaffolded.
2. **Moderation workflow completion**: SEC-7 (client-settable status) + BUG-2 (pending pages leak) show the review queue is half-wired; the admin panel exists but listings can bypass it. Completing this makes user-generated listings safe at scale — prerequisite for growth in India's shelter market.
3. **Email notifications via Edge Functions + Resend** (already in ROADMAP pending list): messaging + group chat exist but nothing pulls users back; adoption applications have no status tracking either (also pending). These two together close the engagement loop.
4. **Programmatic SEO expansion**: `/adopt-pets-in/[city]` pattern works and is your only currently-healthy programmatic surface (after SEO-1..3 are fixed). The CITIES config + patterns approach extends naturally to breed pages (`/adopt/golden-retriever-india`) using existing `animal_type`/`breed` columns — but only after canonical hygiene is fixed, or it multiplies the current problem.

---

## 10. Prioritized Roadmap

### Phase 0 — Stop the bleeding (this week, ~1 day total)
| # | Task | Finds | Effort |
|---|------|-------|--------|
| 0.1 | Cookie-free anon client for generateMetadata/sitemap/feed + remove silent catches + drop global `canonical:'/'` | SEO-1 | S–M |
| 0.2 | De-duplicate city page titles | SEO-2 | S |
| 0.3 | Load Nunito 800/900 (or drop font-black) | §8.1 | S |
| 0.4 | Replace sr-only H1 with visible styled H1 | §8.2 | S |
| 0.5 | Fix stale preconnect host | PERF-9 | S |
| 0.6 | Add `.eq('status','available')` to pet-by-slug lookups | BUG-2 | S |
| 0.7 | Guard imageLoader default export with try/catch | BUG-10 | S |
| 0.8 | Escape JSON-LD + RSS interpolations | SEC-4, SEC-5 | S |
| 0.9 | Regenerate Supabase types; delete the casts | DX-2 | S |
| 0.10 | Validate `?type=` param; reset page on filter change | BUG-6, BUG-7 | S |

### Phase 1 — Trust & safety foundation (week 2, ~3 days)
- Commit DB schema dump + adopt migration workflow (SEC-1)
- REVOKE EXECUTE on non-RPC functions; harden search_path (SEC-2)
- Move `fcm_token`/`phone` out of public reads (SEC-3)
- `WITH CHECK status='pending'` on INSERT policies (SEC-7)
- Safe-redirect helper for login/OAuth callback (SEC-6)
- Response hardening headers, CSP in report-only first (SEC-8)
- Platform toggles: leaked-password protection, OTP expiry, PG upgrade (SEC-11)
- Enforce privacy_settings on public profiles (BUG-11)

### Phase 2 — Correctness & performance (weeks 3–4)
- Unread-count pipeline (BUG-1) + atomic markAsRead + dedupe conversations (BUG-8, BUG-9)
- Query limits/pagination everywhere (PERF-1); memoize browse filtering (PERF-5)
- Upload-time image resizing + wire sized variants (PERF-2)
- Slug single-source-of-truth + redirects (SEO-3)
- View-count once-per-visit (BUG-3); object URL revocation (BUG-5); auth race guard (BUG-4)
- Single toast system, single timeAgo util, LazyMotion completion (DEBT-2, DEBT-3, PERF-3)

### Phase 3 — Testing & maintainability (ongoing)
- Delete dead cluster + its tests; update ROADMAP reality (TEST-1, DOCS-2)
- Characterization tests: AuthContext first, then PetListingForm, realtime hooks, AdminGuard (TEST-2..5)
- Configure coverage + CI step; shared Supabase mock seam (TEST-7, TEST-8)
- pnpm commitment: README/scripts/.npmrc/overrides (DEBT-1, DEPS-1); un-mute CI audit (DX-1)
- AGENTS.md capturing conventions (DX-3); fix docs links (DOCS-1)

### Explicitly not recommended now
- **Middleware/auth rewrite** — documented decision, RLS backstops it; revisit only if server components need session reads broadly.
- **New features before Phase 0–1** — canonical damage compounds daily; features multiply it.
- **Virtualized lists, micro-optimizations** — data volume doesn't justify yet; limits (PERF-1) do.

---

## 11. Not Covered by This Audit

- `mobile/` Android build internals and Play Store pipeline (Capacitor config checked for security only)
- `email-templates/` rendering across clients
- Full WCAG/accessibility pass (flagged as §8.5; needs axe-core runtime audit)
- Search Console / analytics data (recommend connecting GSC to quantify SEO-1's recovery)
- Load behavior at scale (indexes exist but ~25 flagged unused by advisors — normal for current traffic; re-check at growth)

---

## 12. Notes for AI Agents Executing This

- Package manager is **pnpm** in CI; local README lies today — trust `pnpm-lock.yaml`.
- Verify with: `pnpm lint && pnpm type-check && npx vitest --run` then `npx next build`.
- Cloudflare worker bundle limit is 3 MiB — re-check after adding anything.
- Don't reintroduce middleware, `constants/`, `data/`, or Radix toast (all deliberately removed/dead).
- Supabase project ref: see MCP; schema lives only in dashboard until SEC-1 lands — dump it first before any DB change.
