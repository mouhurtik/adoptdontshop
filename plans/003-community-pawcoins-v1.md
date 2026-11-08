# Plan 003: Pilot community PawCoins with post-moderation rules

Updated November 8, 2026 after the user's moderation and earning preferences.
This replaces the earlier proposal that required moderator approval before every
content award. It is a plan, not an enabled reward system.

> Executor: preserve existing work and historical balances. Read scope and STOP
> conditions before implementation. Record code, database and browser evidence
> separately in the index. Do not infer live authorization from client guards.
> Drift check: `git diff --stat a871db0..HEAD -- lib/supabase/types.ts app/admin hooks/useCommunity.ts components/pet-listing/PetListingForm.tsx`.

## Status

- Priority: P2; a verified unsafe live award function would require an earlier fix
- Effort: L, approximately 3-5 development days after database verification
- Risk: HIGH because earning, balances and abuse handling require authorization
- Depends on: correct Supabase access, stable release baseline and user-reviewed rules
- Category: direction / security / migration
- Planned against: a871db0 plus Bundle 004 work, November 8, 2026

## Why this matters

The user wants to recognise visits and participation without waiting for purchase
cashback, and personally handles moderation after publication. Keep publication
and coin eligibility separate. A member should not need prior approval to post,
while a delayed/capped reward can be withheld or reversed when content is removed.
Points should accompany useful return flows; issuing coins is not proof of revenue
or retained members.

## Current state

- `hooks/useCommunity.ts` publishes community posts directly with status published.
- `components/pet-listing/PetListingForm.tsx` submits listings with status pending.
  The desired automatic listing publication therefore needs explicit database and
  source changes; it must not be claimed as the currently verified behavior.
- The old feature branch contains user_pawcoins/pawcoin_transactions and public
  client calls to award_pawcoins with caller-chosen recipient/amount/reason.
  Inspect live function definitions and grants rather than importing that path.
- `components/ui/UserBadge.tsx` uses founder/admin/patron labels. Community rewards
  must never imply those privileges or verification.
- Official social destinations are the approved Facebook, Instagram and company
  LinkedIn URLs in `lib/site.ts`; personal founder channels are separate.
- Amazon account links were removed in Bundle 004 after the user confirmed the
  account was deleted. New links will be supplied later. Amazon engagement earns
  zero coins regardless of publisher account or replacement link.

## Proposed v1 earning contract

These values are a pilot proposal. Display the rules before enabling earning.
Community PawCoins have no rupee value, withdrawal, transfer, purchase or promised
conversion to a future cashback balance. Future purchase cashback needs its own
financial ledger and merchant-approved attribution.

| Event | Award | Limit | What it actually establishes |
| --- | --- | --- | --- |
| Successful daily sign-in/claim | 1 | Once per authenticated account per UTC day | A valid account session and server claim, not a page view or ad view |
| Complete basic verified-account profile | 5 | Once per account | Server-checked verification and basic profile fields; no government ID or exact location required |
| Optional official social outbound visit | 2 | Once per account per approved platform | An outbound visit claim only; not proof of a follow, like, watch time or an action on that platform |
| Original community post remains eligible after 48 hours | 3 | At most 2 per UTC week | Published, unremoved/unflagged, passes anti-duplicate rules; absence of a report is not expert verification |
| Original adoption listing remains eligible after 48 hours | 5 | At most 1 per UTC week | The listing is public, owned by the account, not a duplicate/relist, and not removed or flagged |

Global automatic caps: 15 coins per UTC day and 25 per UTC week, resetting Monday
00:00 UTC. Use server time. Whole awards succeed or fail; never queue a capped
award into a later period. A claim is not guaranteed an award.

Only email-verified accounts can earn. Content/social rewards require an account
at least seven days old; the one-time profile and daily-sign-in rules may start
sooner. Inspect trusted verification state server-side, not user-editable metadata.
Do not award likes, comment counts, page views, ad engagement, Amazon/store visits,
orders, referrals, donation claims, claimed adoptions or animal coordinates.

A social visit must be optional and transparently described as a click/visit.
Check each platform's applicable rules before enabling that platform. Do not
require following/liking/subscribing or label a click as proof of doing so. Keep
this feature disabled per platform when permission is unclear. Do not send member
identity or coin balances to the social site or measurement vendors.

Cosmetic milestones at 25, 100 and 250 net points can unlock a community badge or
profile accent. These are not spendable balances in v1. They never grant admin or
moderation powers, a verification badge, adoption priority, or access to precise
animal locations. Explain reversals and milestone changes in the earning rules.

## Scope

In scope: a tracked additive Supabase migration and a narrow gitignore exception;
`lib/supabase/types.ts`; a new `hooks/useCommunityPawCoins.ts`; private
`components/pawcoins/` balance/history/rules UI; a secure `app/admin/pawcoins/page.tsx`;
limited profile integration; a server-owned rule/configuration store; authorized
moderation/removal hooks; approved outbound social controls; isolated PostgreSQL
and UI tests; this plan/index.

Publication behavior is a separate reviewed substep: preserve immediate community
posting. Inspect live RLS/status-transition rules before changing pet listings from
pending to available. A creator may publish allowed content, but cannot undo a
moderator removal, clear an abuse flag, grant themselves a role or manufacture a
server verification state.

Out of scope: Amazon/advert reward paths, map/fundraiser imports, cash redemption,
financial promises, user transfers, buying points, public balance leaderboards,
unrequested marketing sends, and resetting or silently validating legacy balances.

## Steps

### 1. Verify the live target and preserve historical data

Verify the connection URL is https://uibsmaizlrekfooryrwq.supabase.co. Inspect
actual tables, RLS, role grants, triggers, constraints and reward/moderation function
bodies, including SECURITY DEFINER owners, search_path and all execute overloads.
Count balances/transactions without exporting personal data. No ordinary account
may assign itself privileges or write a balance or trusted moderation flag.

If the old award_pawcoins function accepts arbitrary untrusted grants, identify
callers and prepare a narrow security correction before exposing rewards. Preserve
historical ledger entries and record unverified legacy balances separately. Use
an additive/versioned v1 ledger or an explicitly reviewed migration mapping, not a
production reset or a blanket push of unrelated local migrations.

Verify: direct anonymous/member privilege and balance mutations fail; target and
migration history are recorded. A missing/wrong connection blocks this step only,
not the public UI/AEO or future approved affiliate-link release.

### 2. Implement server-owned earning and delayed eligibility

Store user, event kind/source identity, rule version, award timestamp, amount and
moderation/reversal references in an append-only ledger. Uniqueness must prevent
repeated claims of the same source, daily sign-in, platform visit or relisted pet.
The server derives recipient, amount, eligibility and time. Clients must not
choose a recipient, amount, rule, approval state or backdated timestamp.

After publication, content awards remain pending for 48 hours. An authorized
claim/processor rechecks publication status, ownership, removal/abuse flags,
account age and anti-duplicate evidence at award time. Pending does not block
publication and is not shown as an earned balance. A cooldown is only one abuse
control, not a substitute for moderation or a claim of content quality.

Serialize awards per recipient in PostgreSQL, check day/week limits and insert
the ledger event plus any balance projection in the same transaction. Use unique
constraints as well as application checks. Ordinary members can read only their
own history/balance and cannot mutate the ledger. Pin search_path and restrict
function execution where a SECURITY DEFINER function is required.

Verify: an eligible claim creates exactly one award; duplicate/retried/concurrent
claims cannot duplicate points or exceed caps. Different concurrent events also
respect caps. A transaction failure leaves no partial balance update.

### 3. Support post-publication removal and reversal

Give the founder an authorized removal/reward-reversal path with a required reason
and an audit record. A flagged/removed contribution is ineligible while pending;
if already rewarded, append one correcting event tied to the original award.
Do not edit the award or re-award the same content after a repost/reapproval.
Reversals do not replenish that period's earning allowance. Recalculate cosmetic
milestones from net valid points without affecting account permissions.

Verify: owners cannot clear moderator flags or reverse/recreate their own rewards;
repeated reversal is idempotent; duplicate/relisted content stays ineligible;
UTC boundaries, expired sessions and revoked admin roles are covered.

### 4. Add clear member/admin UI and a bounded pilot

Display Community PawCoins, private paginated history, pending eligibility,
resets/caps and cosmetic milestones. Do not use currency signs, cashback claims,
verified labels or conversion promises. Daily claim and social-visit controls
must state what the award represents. A failed claim should explain that it did
not earn points; it must not block core posting or adoption actions.

Reuse existing profile and card styling. The admin page uses constrained server
operations with database authorization, not the old arbitrary client amount form.
Provide a server switch to pause each earning rule while keeping history readable.
Do not introduce outgoing emails/messages as an implementation side effect.

Verify on two member accounts and the founder/admin: no cross-account history,
no member minting/self-privilege, correct pending/earned/reversed UI, usable mobile
layout, and no points for Amazon or ads. Review founder moderation workload.

### 5. Evaluate return visits and quality

Record a complete baseline week, then compare complete seven-day cohorts for
weekly active members, useful actions and returning contributors. Show counts
beside rates. Track award reversals, duplicate attempts and moderation time.
Daily claims alone do not count as useful participation. If shallow check-ins or
spam grow without useful activity, reduce or pause that rule rather than simply
raising its award. Keep point balances/content text out of third-party analytics.

## Commands and tests

| Purpose | Command | Expected result |
| --- | --- | --- |
| Type check | `pnpm type-check` | Exit 0 |
| UI tests | `pnpm exec vitest run components/pawcoins/__tests__` | Behavioral cases pass |
| SQL integration | `pnpm exec vitest run supabase/__tests__/community-pawcoins.integration.test.ts` | Authorization, delayed eligibility, concurrency, caps and reversal cases pass |
| Lint | `pnpm exec eslint hooks/useCommunityPawCoins.ts components/pawcoins app/admin/pawcoins` | Exit 0 |
| Release checks | `pnpm exec vitest run`, `pnpm build`, `pnpm run cf:build` | Required checks pass |
| Diff | `git diff --check` | No output |

Add the integration test and fixture under supabase/__tests__. Use a disposable
local PostgreSQL database, a pool with separate connections for concurrency cases,
and the Node Vitest environment. Read PAWCOINS_TEST_DATABASE_URL without logging
it; refuse non-loopback hosts and database names without the _pawcoins_test suffix.
Missing infrastructure fails with a setup instruction, not a skipped green test.
The pg driver/types may be added as development dependencies if no suitable client
exists. Do not claim a serialized mock proves concurrency safety.

## Done criteria

- [ ] Correct live target, role/status grants and legacy data handling verified.
- [ ] Immediate community posting preserved; listing behavior explicitly tested.
- [ ] Server owns verification, timestamps, event identity, amount and recipient.
- [ ] All access, duplicate, cooldown, concurrency, cap and reversal tests pass.
- [ ] Member UI has cosmetic utility and truthful non-financial/visit wording.
- [ ] No Amazon/ad reward path or privilege unlock exists.
- [ ] Signed-in browser acceptance and server pause controls verified.
- [ ] Pilot measurements and founder moderation workload recorded in the index.

## STOP conditions and maintenance

Stop the affected step if the target is wrong, ordinary users control protected
roles/flags, legacy data would be destroyed, concurrency cannot be verified, or
cash redemption is requested without a separate funded financial design. Keep
unrelated release work moving. Version rule changes; do not silently recalculate
old awards. Future cashback never automatically converts community points.
