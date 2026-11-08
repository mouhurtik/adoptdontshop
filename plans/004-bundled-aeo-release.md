# Bundle 004: UI, public trust pages, AEO and optional measurement

Updated November 8, 2026. User authorized integrating several phases and pushing
the reviewed release to main. This bundle integrates the three existing UI commits
and implements the public-content/measurement work below. It does not include the
pending admin-email migration or live PawCoins issuance.

## Scope decisions

- Original folder is the active checkout. Existing UI commits 10314fa, dc9950e and
  a871db0 have been fast-forwarded into local main; the old checkout is preserved.
- Official Facebook is https://www.facebook.com/adoptdontshopxyz. Instagram and
  company LinkedIn remain official. Personal X, LinkedIn and YouTube stay associated
  with the founder/About section rather than the organisation's social identity.
- The user confirmed the Amazon account for the six existing links was deleted.
  Remove all six links; show disabled product-link controls until new approved
  links are supplied. Do not claim this release has active affiliate earnings.
- User posts publish before moderator review. The founder handles removal of
  violations. Existing pet-listing code still submits status pending; automatic
  publication needs a separate verified database/permissions change.
- No messages are posted to the founder account as an implementation side effect.
  Stable official links belong in site content/schema; a founder post can announce
  them later when the user chooses to publish one.

## AEO checker disposition

| Suggestion | This release |
| --- | --- |
| ai.txt | Add an informational discovery/rights notice; it is not a standard ranking requirement or blanket licence for member content |
| Description <=160 chars | Shared concise site description used by homepage and default social metadata |
| Freshness | Real stored post dates; visible help/privacy/terms review date; homepage CollectionPage date based on content, not a build-time timestamp |
| Lists/tables | Real getting-started list and practical FAQ content; no decorative tables solely to increase a score |
| Answer-style headings | Dedicated /help questions and a compact homepage community guide |
| FAQ content | On /help with matching FAQPage data; not mixed into the privacy policy and no promise of Google FAQ rich results |
| 1000+ words | Not a ranking prerequisite. Keep the feed concise; make the actual member post text server-visible rather than adding filler |
| Heading hierarchy | Feed has an H2 section before H3 post cards; guide/help have meaningful H2 sections |
| Breadcrumbs | Add to help/contact/privacy; retain post breadcrumbs with safe serialization |
| Speakable | Skip for this community feed; no voice-news integration or evidence that it would benefit these pages |
| Internal body links | Homepage guide and help link to browse, explore, about, contact and policy pages |
| External references | Help links to AWBI and RSPCA with accurate context; no invented research or endorsement |
| Social profiles | Confirmed official links visible in footer/contact and used in Organization.sameAs |
| Post authors | Preserve member bylines/profile links; server-provide published post data and render read-only rich content as HTML |
| Author/team page | Member posts point to their actual author; platform help points to the founder/About section |
| About/contact | Visible footer and contextual links, dedicated contact route, existing public support email |
| Visible dates | Real post dates and explicit editorial review dates on changed help/policy content |
| Privacy/terms | Existing routes retained, refreshed for community content and optional measurement, linked visibly |

## Measurement

Meta Pixel 1462969085759164 measures advertising activity, not SEO. Load Meta and
Google Analytics independently after an explicit choice; no optional script before
consent. Provide equal reject/save/accept choices and a persistent footer control.
No unconsented noscript beacon. Disable automatic Meta configuration/advanced
matching and send explicit public PageView events only. Exclude private/auth/admin,
map, native-shell and sensitive-query surfaces in the integration.

GA4 retains automatic/history pageview ownership: no second manual pageview tracker.
Property-side Enhanced Measurement and live Event Manager acceptance must be
verified separately; do not claim a mocked/browser-request check proves reported
conversions. Revocation blocks future events through this integration; it cannot
erase data already received by a provider or unload all previously executed SDK code.

## Publication gates

- Full lint, TypeScript and test suite pass.
- Web build and Cloudflare bundle pass, or concrete build blocker is reported.
- Signed-out desktop/mobile browser checks cover home, help, contact, privacy,
  about/store, browse pagination and a public post when available.
- Inspect real HTML metadata, JSON-LD and author/content output.
- Verify optional script loading/consent/revocation with vendor requests intercepted
  during local QA so test events are not sent to production measurement accounts.
- Stage release files explicitly. Preserve pending admin files, migration, audit,
  session attachment and local credentials outside this release commit.
- Push the reviewed main commits under the user's authorization. Record the commit
  and distinguish Git push, CI results, and the observed live deployment.

## Local verification before publication

- Exact release suite: 125 tests across 13 files passed. The six pending
  admin-email tests belong to the separate database change and were excluded.
- Full ESLint, TypeScript and production Next build passed.
- Signed-out browser checks passed at desktop and 390px mobile widths for home,
  help, privacy, contact, store, browse pagination and a real public member post.
  Verified canonical/description output, server-visible post prose, real author
  links/dates, no horizontal overflow and disabled old merchant links.
- Vendor SDK requests were intercepted: no optional script before choice,
  independent analytics/marketing choices, and revocation were checked. Actual
  GA4 reports and Meta Event Manager acceptance remain unverified.
- OpenNext completed its Next build but the Windows host denied its symlink
  creation (EPERM) during final bundling, including an elevated attempt. Added
  an independent Ubuntu CI bundle job and the missing explicit esbuild runtime
  dependency used by the installed OpenNext CLI. Linux CI must supply the final
  Cloudflare bundle result; a local Next build alone does not establish it.
- Admin-email drafts and SQL are preserved separately; no database changes were
  applied and no PawCoins balance or earning feature was activated.

## Publication record

Pushed `07bbcef` and the three existing UI commits to `origin/main` on November 8.
The pending admin drafts were restored with byte-for-byte hash verification and
remain outside that commit. Cloudflare started its automatic Workers build.

The first GitHub run passed TypeScript and reproduced an existing Security Audit
cleanup failure: setup-node tried to cache a pnpm store that this lockfile-only
audit job never creates. Removed caching from that job only. This fixes the job
infrastructure; the existing non-blocking audit policy is unchanged. The final
CI and live-site result should be checked against the follow-up commit.

## Official references

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://affiliate-program.amazon.in/help/operating/participation
