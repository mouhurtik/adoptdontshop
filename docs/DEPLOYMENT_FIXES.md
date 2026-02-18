# Deployment Fixes & Optimization Log

## Platform
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Hosting:** Cloudflare Pages via @opennextjs/cloudflare@1.16.5
- **Free Tier Limit:** 3 MiB (gzipped) worker size

---

## Fix 1: Worker Bundle Size Exceeded 3 MiB (Round 1)

**Problem:** `handler.mjs` was 12,344 KiB + `@vercel/og` WASM files 1,432 KiB. Gzipped total exceeded 3 MiB.

**Changes:**
- Removed 8 unused packages: `recharts`, `sharp`, `react-day-picker`, `cmdk`, `vaul`, `input-otp`, `react-resizable-panels`, `embla-carousel-react`
- Deleted 7 unused UI component files: `chart.tsx`, `calendar.tsx`, `command.tsx`, `drawer.tsx`, `input-otp.tsx`, `resizable.tsx`, `carousel.tsx`
- Dynamic imported `html2canvas` in `ShareButton.tsx` to avoid bundling it eagerly

**Result:** handler.mjs dropped from 12,344 → 6,664 KiB

---

## Fix 2: GitHub Actions CI Lint Failure

**Problem:** `next lint` is broken in Next.js 16 (reports "Invalid project directory").

**Changes:**
- Changed lint script from `next lint` to `eslint .`
- Installed `eslint-plugin-react-refresh` (was missing)
- Fixed `eslint.config.js`: added `.next`/`.open-next` to ignores, fixed component path prefixes
- Fixed 2 unused import errors in source files

**Result:** Lint passes with 0 errors, 15 warnings

---

## Fix 3: @ast-grep/napi Native Binding Missing on Linux

**Problem:** `package-lock.json` generated on Windows didn't include `@ast-grep/napi-linux-x64-gnu` needed by Cloudflare Pages (Linux build environment).

**Changes:**
- Added `force=true` to `.npmrc` (ensures all platform-specific optional deps are included in lockfile)
- Regenerated `package-lock.json` from clean install
- Fixed framer-motion type error in `SuccessModal.tsx` (`type: "spring"` → `type: "spring" as const`)

**Result:** Lockfile now includes all platform-specific binaries

---

## Fix 4: Worker Bundle Size Exceeded 3 MiB (Round 2)

**Problem:** After fixes 1-3, gzipped bundle was 3,089 KiB — still 18 KiB over the 3 MiB (3,072 KiB) limit.

**Root Causes:**
1. 22 unused `@radix-ui` packages still installed (tree-shaking didn't fully eliminate them)
2. 4 other unused dependencies (`@hookform/resolvers`, `date-fns`, `react-hook-form`, `zod`)
3. `@vercel/og` WASM + JS files (~2.2 MiB) bundled despite not using OG image generation

**Changes:**

### Removed 26 unused packages from `package.json`:
| Category | Packages |
|----------|----------|
| @radix-ui (22) | accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, toggle, toggle-group |
| Other (4) | @hookform/resolvers, date-fns, react-hook-form, zod |

### Deleted 26 unused UI wrapper files from `components/ui/`:
Same names as the @radix-ui packages above (each had a corresponding shadcn/ui wrapper that was never imported by application code).

### Retained @radix-ui packages (5 — actively used):
| Package | Used By |
|---------|---------|
| react-dialog | PetListingForm.tsx, SuccessDialog.tsx |
| react-slot | button.tsx (used across app) |
| react-tabs | ProductsSection.tsx |
| react-toast | toaster.tsx → providers.tsx |
| react-tooltip | providers.tsx |

### Created `scripts/strip-vercel-og.js` (backup optimization):
- Replaces `@vercel/og` WASM and JS files with minimal stubs after build
- Saves ~2.2 MiB when activated
- **Not currently needed** — package removal alone got us under the limit
- To activate: change Cloudflare Pages build command to `npm run cf:build`

**Result:**
| Metric | Before | After |
|--------|--------|-------|
| handler.mjs | 11,814 KiB | 5,783 KiB |
| npm packages | 933 | 886 |
| Gzipped total | 3,089 KiB | Under 3,072 KiB ✅ |

---

## Remaining Warnings (Non-Blocking)

| Warning | Description | Fix |
|---------|-------------|-----|
| `postcss.config.js` module type | Add `"type": "module"` to `package.json` | Low priority |
| Middleware deprecation | Next.js 16 renamed "middleware" to "proxy" | Still works, cosmetic |
| Multiple lockfiles | `pnpm-lock.yaml` in parent directory | Can set `turbopack.root` in next.config |

---

## Key Configuration Files

- **`.npmrc`**: `legacy-peer-deps=true`, `force=true` (ensures cross-platform optional deps)
- **`eslint.config.js`**: Flat config, ignores `.next`/`.open-next`, uses `eslint .` not `next lint`
- **`scripts/strip-vercel-og.js`**: Emergency stub script if bundle size grows again
- **`package.json` scripts**:
  - `cf:build` — OpenNext build + strip-vercel-og
  - `cf:deploy` — build + strip + wrangler deploy

---

*Last updated: February 17, 2026*
