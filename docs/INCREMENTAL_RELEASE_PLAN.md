# Incremental release plan

The current execution scope is [Bundle 004](../plans/004-bundled-aeo-release.md).
The newer [roadmap](../plans/README.md) supersedes the historical ordering below.

Updated November 7, 2026. This is a release proposal, not a record of deployment.

## One working folder

Use `E:\Projects\Flagship Projects\adoptdontshop` for new work. Keep one small change
in progress at a time, validate it, commit it, and release it before starting the next.

The second checkout currently preserves three completed UI commits on
`feat/ui-refinement`: `10314fa`, `dc9950e`, and `a871db0`. Review and bring these commits
into `main` as one UI release. Once their history and any local-only files are
preserved in the original folder, retire the second worktree. Do not copy its
directory over the original checkout or merge the entire welfare feature snapshot.

The admin email change is being prepared directly in the original folder and can
be reviewed independently. Neither checkout has been merged or pushed by this work.

## Release order

| Release | Scope | Evidence before continuing |
| --- | --- | --- |
| 1. Admin emails | Admin-only email column and search | Correct Supabase project, verified role policies, migration applied, admin and non-admin checks, signed-in admin review |
| 2. Completed UI | Existing navigation, scrolling and browse pagination commits | Tests/build and desktop/mobile review of the combined checkout |
| 3. Affiliate shop pilot | Small curated catalog, affiliate disclosures, outbound links and aggregate click reporting; no cashback promise | Approved affiliate accounts and links, click attribution, confirmed orders and actual commission |
| 4. Return visits | Start with saved adoption searches and relevant listing/reply notifications; make delivery opt-in | Weekly active users, seven-day return rate, listing enquiries; compare before/after |
| 5. PawMap | A small moderated nearby sightings feature, without coin issuance | Location/privacy controls, moderation, useful local coverage and current sightings |
| 6. Cashback pilot | PawCoins for merchant-approved, verified purchases | Per-user order attribution, confirmed commission, returns/reversals, idempotent ledger and reconciled payouts |

The shop-first order is a new recommendation because monetization is now a priority;
the previous plan put PawMap first. A large signup total alone does not establish
active usage or demand for a cashback product. Validate purchases and return visits
before expanding the wallet or building a stock-holding store.

Later, test clearly labelled sponsorships from relevant local pet businesses once
there is enough local engagement to offer them useful exposure. Keep ordinary
adoption listings accessible.

## Cashback boundaries

Treat spending rewards and community reputation as separate balances. Begin with
cashback only where the merchant agreement allows it. A purchase should move through
tracked, pending, confirmed, and paid states, with cancellation/reversal handling.
Do not award redeemable balances for clicks or self-reported purchases.

CashKaro's [terms](https://cashkaro.com/terms-conditions) require qualifying purchases
and resulting cashback received by CashKaro. Amazon India's standard
[participation requirements, clause 14](https://affiliate-program.amazon.in/help/operating/participation)
prohibit incentives for using affiliate links; an ordinary affiliate account is
not sufficient approval for a cashback program.

## Admin email release

Code: `app/admin/users/page.tsx`, `lib/supabase/types.ts`.
Migration: `supabase/migrations/20261106000000_admin_user_emails.sql`.

The function checks `auth.uid()` against the existing `public.user_roles` table,
then returns only IDs and emails for up to 1000 requested Auth users. Anonymous
execution is revoked. Emails are not copied into public profiles. The UI keeps
profile details available and offers a retry if email retrieval fails.

The existing profile list and search still operate on the rows returned by its
current query; this release does not add directory pagination or a complete
Auth-account inventory.

Before applying the migration:

1. Verify the target URL is `https://uibsmaizlrekfooryrwq.supabase.co`.
2. Inspect `auth.users`, `public.user_roles`, its grants and policies. Confirm ordinary
   users cannot insert or update an admin role for themselves. Confirm the function
   name is unused, or review any existing definition before replacing it.
3. Apply this one migration through the migration tool or SQL editor. Do not run
   a blanket database push: older local migrations are not a verified live baseline.
4. Test a signed-out request and an ordinary-user request are rejected, and an admin
   can retrieve only the requested emails. Do not print real email data into logs.
5. Deploy the UI and check `/admin/users` while signed in as an administrator.

The connected Supabase tool currently reports `yntepnnhctpnfvfceurd`, which differs
from the app configuration. No migration has been applied through that connection.
The existing Supabase CLI login also does not list AdoptDontShop. A connection
with access to the correct project is required for live verification and migration.

Local verification commands:

```powershell
pnpm exec vitest run app/admin/users/__tests__/UsersPage.test.tsx
pnpm type-check
pnpm exec eslint app/admin/users/page.tsx app/admin/users/__tests__/UsersPage.test.tsx lib/supabase/types.ts scripts/check-admin-user-emails.mjs
```

The isolated SQL checker accepts the path to an existing PGlite module without
adding an application dependency:

```powershell
node scripts/check-admin-user-emails.mjs 'C:\path\to\@electric-sql\pglite\dist\index.js'
```

It creates an in-memory fixture, applies the actual migration, and checks access
controls, role revocation, requested-user scoping and size limits. It does not
establish that the live database's existing role policies are safe.

Verification completed locally on November 7, 2026: six admin UI tests, thirteen
isolated SQL checks, TypeScript, scoped ESLint, and `git diff --check` passed.
The SQL checker used an already installed PGlite module; no application dependency
or lockfile was added. No production build, Cloudflare preview, or signed-in browser
acceptance was performed for this change. No Git commit, push, merge, or live
database write was performed.
