# AdoptDontShop — Security Audit

**Date:** June 14, 2026  
**Auditor:** AI Code Review  
**Scope:** Full codebase, RLS policies, auth flow, data handling  
**Stack:** Next.js 16 (App Router) + Supabase + Cloudflare Pages  

---

## Overall Score: **7.0/10** ⭐

Significantly improved since the Feb 2026 review (5.0 → 7.0). RLS is now properly configured across all 13 tables with 43 policies. Auth flow is solid. Main gaps are rate limiting, XSS surface in rich text, and one overly permissive SELECT policy (now fixed).

---

## Findings Summary

| ID | Severity | Status | Finding |
|----|----------|--------|---------|
| S1 | 🔴 Medium | ⚠️ Open | XSS risk in TiptapRenderer (user HTML content) |
| S2 | 🔴 Medium | ⚠️ Open | No rate limiting on form submissions |
| S3 | 🟠 Low | ✅ Mitigated | Admin check is client-side (RLS enforces server-side) |
| S4 | 🟠 Medium | ✅ **Fixed** | `pet_listings` SELECT policy was too permissive |
| S5 | 🟠 Low | ⚠️ Open | `messages.conversation_id` is TEXT, not UUID FK |
| S6 | 🟡 Low | ⚠️ Open | No email verification enforcement |
| S7 | 🟡 Low | ⚠️ Open | Username generation race condition |
| S8 | 🟠 Medium | ✅ **Fixed** | `fetchPetByIdPrefix` was downloading entire table |
| S9 | 🟢 None | ✅ OK | `.env` contains anon key (expected, in .gitignore) |

---

## Detailed Findings

### 🔴 S1: XSS Risk in TiptapRenderer
- **File:** `views/CommunityPostDetail.tsx`
- **Issue:** TiptapRenderer renders user-submitted Tiptap JSON as HTML. While Tiptap's editor sanitizes input on the client side, if content is directly modified in the database, it could contain `<script>` tags or `onerror` event handlers.
- **Risk:** Medium — requires DB-level access to exploit, but community posts are public
- **Recommendation:** Add server-side HTML sanitization via `dompurify` or `sanitize-html` before rendering. Alternatively, validate Tiptap JSON structure on INSERT via a Supabase Edge Function.

### 🔴 S2: No Rate Limiting
- **Issue:** Adoption applications, post creation, message sending, and signups have no rate limiting.
- **Risk:** Medium — automated bots could spam the platform
- **Recommendation:** 
  1. Use Cloudflare WAF rate limiting rules (free tier: 1 rule)
  2. Or add a Supabase Edge Function with token-bucket rate limiting
  3. At minimum, add client-side cooldown timers on form submissions

### 🟠 S3: Client-Side Admin Check (Mitigated)
- **File:** `contexts/AuthContext.tsx` (lines 100-101)
- **Issue:** `isAdmin` boolean is derived client-side from the `user_roles` table query
- **Mitigation:** RLS policies enforce `is_admin(auth.uid())` on all admin operations. The admin UI may be visible to a modified client, but no data access is possible without the proper role.
- **Status:** Acceptable risk — RLS is the real gate

### 🟠 S4: pet_listings SELECT Policy ✅ FIXED
- **Was:** `qual: "true"` — anyone could query ALL listings including pending/rejected
- **Now:** `status IN ('available', 'urgent') OR user_id = auth.uid() OR is_admin(auth.uid())`
- **Impact:** Pending listings are no longer visible to the public

### 🟠 S5: messages.conversation_id Type Mismatch
- **Issue:** `conversation_id` is TEXT, but `conversations.id` is UUID. The RLS policy casts `(messages.conversation_id)::uuid` which works but is fragile.
- **Recommendation:** Migrate column type from TEXT to UUID with a proper FK constraint:
  ```sql
  ALTER TABLE messages ALTER COLUMN conversation_id TYPE UUID USING conversation_id::uuid;
  ALTER TABLE messages ADD CONSTRAINT fk_messages_conversation 
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
  ```
  ⚠️ Test on staging first — existing data must be valid UUIDs

### 🟡 S6: No Email Verification
- **Issue:** Users can sign up and immediately post/message without email verification
- **Recommendation:** Enable "Confirm email" in Supabase Auth settings → Authentication → Providers → Email

### 🟡 S7: Username Generation Race Condition
- **File:** `contexts/AuthContext.tsx` (lines 60-88)
- **Issue:** Two users logging in simultaneously could get the same auto-generated username. The UNIQUE constraint rejects one silently.
- **Recommendation:** Use a DB function with `ON CONFLICT DO NOTHING` and retry logic

### 🟠 S8: Full Table Scan in Pet Lookup ✅ FIXED
- **Was:** `fetchPetByIdPrefix` called `select('*')` on ALL pet_listings, then filtered client-side
- **Now:** Uses `.ilike('id', '${idPrefix}%')` server-side filter — fetches only 1 row
- **Impact:** Reduced bandwidth and prevented info leakage of non-available listings

---

## RLS Policy Audit (43 Policies Across 13 Tables)

All tables have RLS enabled. Key policies:

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

---

## Recommendations Priority

1. **S2 (Rate Limiting)** — Add Cloudflare WAF rule to limit POST requests to 10/min per IP
2. **S1 (XSS)** — Add `sanitize-html` to TiptapRenderer or validate content on INSERT
3. **S6 (Email Verification)** — Enable in Supabase Dashboard (1 click)
4. **S5 (Message FK)** — Migrate conversation_id to UUID type (test on staging first)
5. **S7 (Username Race)** — Low priority, happens rarely
