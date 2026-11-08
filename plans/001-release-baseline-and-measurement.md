# Plan 001: Establish one release baseline and verify measurement

## Execution update: Bundle 004

The three named UI commits are integrated into local main. Optional measurement
now lives in `lib/tracking.ts` and `components/analytics/`, replacing the older
unconditional GA initialization described in the planning snapshot below.
Local build, lint, TypeScript, release tests and signed-out browser checks passed;
see [Bundle 004](004-bundled-aeo-release.md) for precise evidence and the Windows
OpenNext limitation. Live provider reports and the correct Supabase connection
remain outstanding. The admin email patch is preserved separately and unpublished.

> Executor: preserve existing work and execute only this scope. Read all STOP
> conditions first. Update this plan's status in `plans/README.md` after review.
> Drift check: `git diff --stat 1390541..HEAD -- app components lib views package.json pnpm-lock.yaml`.
> Compare existing excerpts and uncommitted changes before editing; expected
> integration of the named UI commits is not unexplained drift.

## Status

- Priority: P1
- Effort: M, approximately 1-2 development days if the existing release checks pass
- Risk: MED, because shared UI, analytics and admin authorization are involved
- Depends on: none
- Category: direction / release / measurement
- Planned at: `1390541`, November 8, 2026, plus existing uncommitted admin work

## Why this matters

The original checkout is on `main`; completed UI work is preserved in a second
checkout. An admin email change is prepared but not deployed. Consolidating this
baseline removes branch juggling while establishing whether real visitors and
returning members are being measured. Keep the Amazon pilot independent of any
delay in the database-dependent email release.

## Current state

- Original: `E:\Projects\Flagship Projects\adoptdontshop`, `main` at `1390541`.
- Second checkout: `E:\Projects\Flagship Projects\adoptdontshop-ui-refinement`,
  clean at `a871db0` when inspected. Existing commits are `10314fa` (UI),
  `dc9950e` (browse pagination), and `a871db0` (mobile context/scroll correction).
- Uncommitted admin work: `.gitignore`, `app/admin/users/page.tsx`,
  `lib/supabase/types.ts`, `app/admin/users/__tests__/UsersPage.test.tsx`,
  `supabase/migrations/20261106000000_admin_user_emails.sql`, and
  `scripts/check-admin-user-emails.mjs`.
- Preserve the pre-existing untracked `.opencode/` attachment and
  `docs/WELFARE_RELEASE_AUDIT.md`; do not include them accidentally in a release.
- `app/layout.tsx:154-171` already initialises GA4:

  ```ts
  gtag('config', 'G-FJ0SET7VX9', { send_page_view: true });
  ```

  It loads lazily and schedules idle work/fallback delay. Live collection and
  ownership of this property have not been verified.
- `app/admin/page.tsx:51` counts `profiles` records. That is a cumulative profile
  count, not weekly active members or a complete visitor inventory.
- The app uses Next.js 16, React 19, typed Supabase clients and pnpm. Preserve
  desktop sidebar, mobile top bar/bottom navigation, browse SEO, and existing
  native scrolling/reduced-motion decisions.

## Scope

In scope: integrating only the three existing UI commits and their existing files;
the prepared admin files listed above; `app/layout.tsx`; `app/admin/page.tsx` for
an accurate registered-profile label; `lib/analytics.ts` and
`lib/__tests__/analytics.test.ts` if a small shared event helper is needed;
`views/PrivacyPolicy.tsx` for truthful measurement disclosure; this plan/index.

Out of scope: map, fundraiser, reward and shop imports from the welfare branch;
new worktrees; React Native; ad SDKs; bulk account exports; marketing sends; a
new analytics service or custom reporting dashboard.

## Commands

Run from the original folder. Inspect the CI/package-manager configuration before
an install; do not change the lockfile merely to repair a local dependency link.

| Purpose | Command | Expected result |
| --- | --- | --- |
| Inventory | `git status --short --branch` and `git worktree list` | All existing work accounted for |
| UI history | `git log --oneline main..feat/ui-refinement` | The three named commits before integration |
| Type check | `pnpm type-check` | Exit 0 |
| Admin regression | `pnpm exec vitest run app/admin/users/__tests__/UsersPage.test.tsx` | Six existing email tests pass |
| Full suite | `pnpm exec vitest run` | Exit 0, or documented pre-existing failures preventing release |
| Lint | `pnpm lint` | Exit 0; classify baseline failures honestly |
| Web build | `pnpm build` | Exit 0 |
| Cloudflare build | `pnpm run cf:build` | Exit 0 before claiming Cloudflare readiness |
| Whitespace | `git diff --check` | No output |

## Steps

### 1. Preserve and integrate the finished UI work

Record both checkouts' status and ignored local-only configuration. Preserve
uncommitted work without adding secrets to Git. Review
`git diff --stat main..feat/ui-refinement` and the three commits. While main is
still their ancestor, use `git merge --ff-only feat/ui-refinement` in the original
folder, only after confirming it will preserve the uncommitted admin changes.
Do not reset, force checkout, overwrite the folder, or create another worktree.

Verify: `git log -4 --oneline` includes the three UI commits, and
`git diff --stat main..feat/ui-refinement` is empty immediately after integration.
The original folder now contains the UI implementation and the existing admin
patch. If main has diverged, reassess the history instead of forcing a merge.

Run the relevant tests/builds in the original folder. Browser acceptance at
desktop and mobile sizes must cover `/`, `/explore`, `/browse`,
`/browse/page/2`, navigation and scrolling. Record results separately from builds.
Only retire the old worktree after its local-only files are preserved and its
commits are reachable from main. Folder removal is a separate destructive step.

### 2. Complete the independent admin email release

Re-discover Supabase MCP and verify its URL equals
`https://uibsmaizlrekfooryrwq.supabase.co`. Inspect the live role policies/grants,
`auth.users`, `public.user_roles`, migration history and any existing function
named `admin_get_user_emails`. No ordinary user may be able to assign themselves
an admin role. Do not infer this from `AdminGuard`.

Use the prepared migration only after those checks. It authorizes `auth.uid()`
before returning requested emails, fixes `search_path`, and denies anonymous
execution. Do not bulk-push unrelated local migrations or copy emails into
public profiles. Do not print real addresses into test logs.

Verify: the six UI tests and isolated SQL checker pass; direct signed-out and
ordinary-member requests are denied; an authenticated admin sees the correct
Email column/search in the deployed admin UI. A local mock is not this live proof.
If the connection is unavailable, retain this as a pending, separately scoped
change and continue the Amazon web pilot without publishing the incomplete patch.

### 3. Verify the existing analytics property

Confirm the owner can access GA4 property `G-FJ0SET7VX9`. In a browser, inspect
collection for initial load, internal navigation and Back/Forward. Verify exactly
one correctly attributed page view per screen. Enhanced Measurement may already
handle history changes; add manual page views only if that check shows a gap.
Check that the lazy initialisation does not discard early shop interactions.

If needed, add a small typed `lib/analytics.ts` helper with allowlisted event
parameters, production/environment controls, and a safe no-op when analytics is
unavailable or disabled. It must not prevent normal navigation. Do not initialise
a second GA instance. Plan 002 will use this helper for affiliate clicks.

Exclude private admin, chat, auth-callback and sensitive map details from external
measurement. Strip sensitive query parameters; never send emails, phone numbers,
message content, exact coordinates or arbitrary free text. Review privacy and
consent settings for the actual deployment, and describe the real setup accurately.

Verify: browser inspection shows the intended measurement only, with one page
view per public screen and no sensitive URL/parameter leakage. Any added helper
tests cover unavailable analytics, repeated navigation and parameter allowlisting.

### 4. Establish the baseline and publish reviewable releases

Label the existing dashboard count as registered profiles. Record a seven-day
baseline for visits, engaged visitors, active members and successful actions,
using the same dates and hostname. Do not divide lifetime profiles by page views
to report signup conversion. Do not export addresses to analytics.

Commit UI, admin emails and measurement as separate logical changes, staging exact
paths. Publish the reviewed release under the operator's execution authorization;
do not bundle the welfare snapshot. Record commit and deployment evidence, not
just a localhost response. Do not wait a full baseline week to release the shop.

## Done criteria

- [ ] Completed UI history is preserved and active in the original folder.
- [ ] Required checks and desktop/mobile browser review have recorded results.
- [ ] Email release is either verified live or explicitly isolated as pending.
- [ ] GA4 collection/navigation has been observed; claims name unverified areas.
- [ ] Profile count is labelled accurately and a baseline period is defined.
- [ ] No unrelated untracked files or secret configuration enter a commit.
- [ ] `plans/README.md` status records completed and pending substeps separately.

## STOP conditions and maintenance

Stop the affected substep if a target project differs, role assignment is unsafe,
the UI history diverges unexpectedly, local-only files would be lost, or required
release checks fail twice. Investigate the concrete failure; do not claim a local
build proves deployed or native acceptance. Keep unrelated substeps moving.
Future analytics work must reuse the single helper and recheck SPA duplication.
