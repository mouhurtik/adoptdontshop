# AdoptDontShop — Security Audit

**Date:** June 14, 2026  
**Auditor:** AI Code Review  
**Scope:** Full codebase, RLS policies, auth flow, data handling  
**Stack:** Next.js 16 (App Router) + Supabase + Cloudflare Pages  

---

## Overall Score: **8.5/10** ⭐⭐

Significantly improved since the Feb 2026 review (5.0 → 8.5). All critical and high-priority findings have been resolved. RLS is properly configured across all 13 tables with 43 policies. Auth flow is solid with race-condition-safe username generation.

---

## Findings Summary

| ID | Severity | Status | Finding |
|----|----------|--------|---------|
| S1 | 🟡 Low | ✅ Mitigated | TiptapRenderer uses JSON schema (not raw HTML) — safe by design |
| S2 | 🟠 Medium | ⚠️ Recommended | No rate limiting on forms — use Cloudflare WAF rules |
| S3 | 🟠 Low | ✅ Mitigated | Admin check is client-side (RLS enforces server-side) |
| S4 | 🟠 Medium | ✅ **Fixed** | `pet_listings` SELECT policy restricted to available/urgent/own/admin |
| S5 | 🟠 Low | ✅ **Fixed** | `messages.conversation_id` migrated from TEXT to UUID with FK constraint |
| S6 | 🟡 Low | ✅ Clarified | Email verification enabled for email/password; not needed for Google OAuth |
| S7 | 🟡 Low | ✅ **Fixed** | Username generation uses retry loop with `.is('username', null)` guard |
| S8 | 🟠 Medium | ✅ **Fixed** | `fetchPetByIdPrefix` uses server-side `ilike` filter (was full table scan) |
| S9 | 🟢 None | ✅ OK | `.env` contains anon key (expected, in .gitignore) |

**7 of 9 findings resolved.** S2 (rate limiting) requires infrastructure-level configuration (Cloudflare WAF).

---

## What We Fixed

### S4: pet_listings RLS Policy
- **Before:** `qual: "true"` — anonymous users could query ALL listings including pending/rejected
- **After:** `status IN ('available', 'urgent') OR user_id = auth.uid() OR is_admin(auth.uid())`

### S5: messages.conversation_id Type Safety
- **Before:** `conversation_id` was TEXT type, RLS policies used fragile `::uuid` cast
- **After:** Column migrated to UUID type with proper FK constraint to `conversations(id) ON DELETE CASCADE`. RLS policies updated to remove the cast.

### S7: Username Race Condition
- **Before:** Check-then-insert pattern (TOCTOU) — two simultaneous logins could clash
- **After:** Retry loop (up to 3 attempts) with `.is('username', null)` guard prevents overwrites. UNIQUE constraint violations trigger automatic retry with random suffix.

### S8: Full Table Scan Eliminated
- **Before:** `fetchPetByIdPrefix` called `select('*')` on ALL pet_listings, filtered client-side
- **After:** Uses `.ilike('id', '${idPrefix}%').limit(1).maybeSingle()` — fetches exactly 1 row
- Fixed in both `server-queries.ts` (SSR) and `usePets.ts` (client)

---

## Architecture Security Summary

### RLS Policies (43 Across 13 Tables) ✅

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| pet_listings | ✅ available/urgent/own/admin | ✅ auth + user_id | ✅ owner/admin | ✅ owner/admin |
| adoption_applications | ✅ pet owner/admin | ✅ authenticated | — | — |
| profiles | ✅ public | ✅ own | ✅ own | — |
| user_roles | ✅ own | admin only | admin only | admin only |
| community_posts | ✅ published/own | ✅ auth + author | ✅ author/admin | ✅ author/admin |
| post_comments | ✅ not deleted/own | ✅ auth + author | ✅ author/admin | ✅ author/admin |
| messages | ✅ participant/admin | ✅ auth + sender | ✅ participant/admin | — |
| conversations | ✅ participant | ✅ participant | ✅ participant | — |
| groups | ✅ public/member | ✅ auth creator | ✅ owner/admin | — |
| group_members | ✅ public/member | ✅ own | — | ✅ own/admin |
| pet_favorites | ✅ own | ✅ own | — | ✅ own |
| saved_posts | ✅ own | ✅ own | — | ✅ own |
| post_likes | ✅ public | ✅ auth + user | — | ✅ own |

### Auth Flow ✅
- Supabase Auth with `@supabase/ssr`
- Google OAuth + Email/Password
- Email verification for email signups
- Server-side session validation via `createServerSupabaseClient()`
- Client-side session via `supabase.auth.onAuthStateChange()`

### Data Handling ✅
- All user content rendered through Tiptap JSON schema (not raw HTML)
- `dangerouslySetInnerHTML` used only for JSON-LD schema (hardcoded data, no user input)
- Environment variables follow Next.js `NEXT_PUBLIC_` convention
- No service role key exposed to client

---

## Remaining Recommendation

### S2: Rate Limiting (Recommended, Not Critical)
Add Cloudflare WAF rate limiting rules to prevent automated abuse:
- POST to `/api/*` — limit to 10 requests/minute per IP
- POST to auth endpoints — limit to 5 requests/minute per IP
- This can be configured in Cloudflare Dashboard → Security → WAF → Rate Limiting Rules (1 rule available on free plan)
