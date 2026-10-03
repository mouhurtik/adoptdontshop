# AdoptDontShop — Agent Notes

> Concise conventions so any human or AI session can ship a correct change on the first try.

## Package manager — pnpm only

README lies in older revisions. Source of truth is `pnpm-lock.yaml` + CI (`pnpm 9`).
Never run `npm install` or `npx` against npm-era scripts — use `pnpm <script>`.

| Task | Command |
|------|---------|
| Dev | `pnpm dev` |
| Lint | `pnpm lint` |
| Type-check | `tsc --noEmit` (or `pnpm type-check`) |
| Tests | `pnpm test -- --run` |
| Coverage | not yet configured — see ROADMAP |
| Build | `pnpm build` (`next build`) |
| Cloudflare build | `pnpm cf:build` (`opennextjs-cloudflare build`) |

Verify every change with: `pnpm lint && pnpm type-check && pnpm test -- --run` then `pnpm build` if you touched routing/SEO/data-layer.

Constraints: Cloudflare worker ≤3 MiB; `@opennextjs/cloudflare` is the adapter; don't use `next export`.

## Architecture map

```
app/                 routes + per-segment metadata (read server/queries via createPublicSupabaseClient for public SEO paths)
  (no middleware)     auth is client-side via AuthContext — don't recreate middleware
views/               page-level 'use client' views (1:1 with app routes — valid pattern, not an indirection to remove)
components/          reusable UI (PostCard, PetCard, TiptapEditor, TrendingSidebar…)
  AppSidebar/TopBar/BottomNav/LayoutShell  shell model
hooks/               data layer (usePets, useCommunity, useMessages, useGroups…)
  WINNER             the hooks layer is the intended data path — avoid new direct `@/lib/supabase/client` imports outside lib/ + contexts/AuthContext
contexts/            AuthContext, AuthModalContext
lib/supabase/        client.ts (browser lazy Proxy), server.ts (cookie client + cookie-free public client), types.ts (generated — regenerate when schema changes, not hand-edited)
types/, utils/       shared TS
```

## Conventions

- **Toasts:** `sonner` only. The Radix `hooks/use-toast` + `ui/toast` system was deleted (see AUDIT_Aug2026.md DEBT-2).
- **Images:** Supabase Storage transforms via `lib/imageLoader.ts` helper; avoid runtime transform fallback that 400'd on free tier — prefer upload-time resizing.
- **Env:** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (or `.env`); anon key is publishable, protected by RLS. Don't inline service_role.
- **Supabase types:** Regenerate from live DB, don't patch casts. Many current hooks still carry `as unknown as` workarounds scheduled for removal.
- **Worker bundle:** Check size after adding deps; remove heavy isolates (e.g. html2canvas stays dynamic import).
- **Migrations:** Now present — `supabase/migrations/…` via `supabase db diff` workflow; `docs/SECURITY_AUDIT.md` and `docs/AUDIT_Aug2026.md` record remaining advisor items.

## Pitfalls re-fixed in this repo

- Global `alternates.canonical: '/'` caused every static page to claim to be the homepage — fixed; each route now self-canonicalizes.
- Global 1-year `immutable` cache on unhashed `favicon.ico`/hero images masked updates — fixed.
- `NEXT_PUBLIC_` vars in `.env` are inlined into client chunks at build start — stale `next dev` zombies or cached chunks after changing `.env` require killing the server + hard refresh/incognito.
