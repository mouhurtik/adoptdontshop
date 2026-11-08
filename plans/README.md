# Revenue and retention release plans

Prepared November 8, 2026, using the Improve planning workflow. Updated for Bundle 004 execution. Planning baseline:
`main` at `1390541`, plus the existing uncommitted admin-email change. Publication status is recorded in Bundle 004; remaining phases are implementation proposals.

This index supersedes the proposed order in `docs/INCREMENTAL_RELEASE_PLAN.md`.
The current decision is Amazon affiliate income after replacement links arrive, community PawCoins later,
and purchase cashback only when a merchant allows it and attribution works.

## Product decisions

- Amazon orders and clicks earn no PawCoins.
- Community PawCoins v1 recognise bounded member activity and unlock cosmetics.
  They have no rupee value, withdrawal, transfer, purchase, or promised future
  conversion to cashback. These are proposed v1 terms for product review.
- Future purchase cashback must use a separate financial ledger and balance.
- Returning users need useful content, replies, and relevant adoption updates in
  addition to recognition. A capped daily-login reward can be piloted, but useful return flows remain necessary.
- Keep public exact-location PawMap, fundraisers, and the React Native migration
  out of the revenue pilot. Capacitor remains the mobile path.

## Phases to release separately

Estimates are development effort, not revenue forecasts or approval timelines.
Existing deployment failures, provider approvals, and device testing can add time.

| Phase | Deliverable | Suggested effort | Release condition / evidence |
| --- | --- | --- | --- |
| 0 | Integrate the three completed UI commits into the original folder; release admin emails when the correct database is available | 1-2 days if existing checks pass | UI history preserved, desktop/mobile review, build checks; database authorization and signed-in admin review for emails |
| 1 | Verified Amazon catalog, disclosures, ordinary links and affiliate-click measurement | 1-3 days | Await replacement links: user confirmed the old account was deleted. Bundle 004 removes its links and prepares the catalog. |
| 2 | Give existing members a reason to return: reliable replies/in-app notifications and one opt-in relevant update workflow | 2-4 days | Events delivered once to the correct member; preferences and unsubscribe/disable work; return-rate baseline recorded |
| 3 | Community PawCoins pilot with post-moderation earning events, caps, history and cosmetic milestones | 3-5 days after schema verification | Database authorization, duplicate/concurrency/reversal checks, private balance/history, clear earning rules |
| 4 | Test one web ad placement and/or a clearly labelled local sponsorship | 1-2 days plus approval | Suitable content and measured traffic; no rewarded ad clicks; revenue, performance and engagement compared |
| 5 | Capacitor internal beta using the stable web release | 3-5 days plus device/store testing | Native login/return, token cleanup, offline recovery, uploads, Back navigation, merchant checkout and notification taps pass |
| Later | Merchant-approved purchase cashback and a private local PawMap pilot | Separate planning | Attribution, payment/reversal controls, or verified local care partners and least-disclosure access respectively |

Phase 0 is not permission to delete the other checkout before its history and
local-only files are preserved. A blocked admin-email migration must not hold
the Amazon catalog hostage: publish independently scoped commits when safe.

## Detailed execution order and status

| Plan | Title | Priority | Effort | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| [004](004-bundled-aeo-release.md) | UI, AEO/trust pages and optional measurement | P1 | M | Existing UI commits; user scope decisions | PUSHED as 07bbcef; CI and live deployment being verified |
| [001](001-release-baseline-and-measurement.md) | Consolidate the release baseline and verify measurement | P1 | M | None | TODO |
| [002](002-amazon-affiliate-pilot.md) | Launch the Amazon affiliate pilot | P1 | M | 001 web/analytics pieces; not the admin database migration | TODO |
| [003](003-community-pawcoins-v1.md) | Launch community PawCoins with server-owned rules | P2 | L | Correct Supabase connection; stable baseline and retention flow; ship Amazon first | TODO |

Detailed implementation of Phases 2, 4, and 5 should be scoped from the observed
pilot results rather than silently added to the first release.

## One-folder Git workflow

Use `E:\Projects\Flagship Projects\adoptdontshop` for implementation. Reuse the
existing `feat/ui-refinement` commits (`10314fa`, `dc9950e`, `a871db0`); do not
create more worktrees. Keep a single active change and a separate reviewable
commit per release. Preserve the untracked audit and session attachment files.

Review the exact staged diff, run the checks relevant to that release, and publish
the reviewed release to `main` when authorized for execution. Verify the deployed
result before starting the next feature. Do not merge the welfare snapshot wholesale.

## First-month scorecard

Measure a full baseline week, then compare complete weekly periods. At this size,
report absolute counts beside rates and avoid treating one or two people as a trend.

| Area | Measures | Source of truth |
| --- | --- | --- |
| Audience | Visits, engaged visitors, landing pages, source/medium | Existing GA4, with Cloudflare Web Analytics as a second perspective |
| Retention | Weekly active members; seven-day return by signup cohort; useful actions | Privacy-limited analytics and successful application events |
| Adoption/community | Saved pets, submitted enquiries, eligible listings and contributions | Successful database actions; self-reported adoption is labelled separately |
| Shop | Store visits, product clicks, placement CTR | Analytics; clicks are not purchases |
| Revenue | Amazon ordered/shipped items and reported earnings; actual paid commission separately | Amazon Associates reports; no invented customer attribution |
| PawCoins | Unique contributors, approved awards, reversals, moderation workload, retained contributors | Server ledger and moderator audit records |

Review the affiliate pilot after at least two complete weeks of measured traffic.
If people visit but rarely click, improve selection and placement. If clicks do not
produce orders, check link ownership/tracking and product relevance before expanding
the catalog. PawCoins success is useful participation and return visits, not points
issued. Do not use paid acquisition until attribution and basic unit economics work.

## Connection state

Last successful Supabase MCP check on November 7 returned
`https://yntepnnhctpnfvfceurd.supabase.co`. The saved server command also contained
`--project-ref yntepnnhctpnfvfceurd`. AdoptDontShop's app configuration uses
`uibsmaizlrekfooryrwq`; that ID is the project-ref value, not the full API URL.
On November 8 Supabase tools were not exposed in this session; re-discover and
verify the URL before any database query or write.

Playwright MCP tools became available in this session on November 8. Availability
does not establish a signed-in browser session or passing browser acceptance.

## Considered and deferred

- Importing the whole feature branch: couples unrelated unfinished features to
  revenue and includes click-based coin awards.
- Making cashback a prerequisite for affiliate income: unnecessary delay; the
  user explicitly chose an affiliate-only first release.
- Coins for ad/Amazon engagement or raw likes: excluded. Daily login and one-time
  official social outbound visits are a bounded, non-cash experiment in Plan 003;
  a social click is not proof of a follow or a third-party action.
- A large custom analytics dashboard: use existing GA4 and provider reports first.
- A public exact-location animal map: privacy design and moderation are separate
  prerequisites, not part of this revenue release.

## Sources checked

- [Amazon India participation requirements](https://affiliate-program.amazon.in/help/operating/participation)
- [Amazon India operating agreement](https://affiliate-program.amazon.in/help/operating/agreement)
- [Google AdSense program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Cuelinks campaign capabilities](https://apiui.cuelinks.com/docs/reference/campaigns)
- [Cuelinks transaction reporting](https://apiui.cuelinks.com/docs/reference/transactions)
