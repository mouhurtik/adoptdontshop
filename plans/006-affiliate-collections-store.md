# Bundle 006: Amazon collection browsing and Store redesign

November 8, 2026. The user supplied 13 replacement affiliate URLs and rejected
the individual-product-card design. This release treats the links as category
and brand selections rather than individual product recommendations.

## Verified destinations

All 13 exact user-supplied `link.amazon` URLs resolved successfully in a browser
to `www.amazon.in/s` search results with an affiliate tag. The queries matched
the supplied dry/wet cat food, Friskies, Whiskas, Sheba, cat toys/accessories,
spot-on/fountain, dry/wet dog food, Pedigree and Royal Canine labels.

The first HEAD-method probe returned HTTP 400; normal browser GET resolution
worked for every URL. Do not call these links broken based on that probe, or
describe them as individual items or official manufacturer storefronts.

The exact original short URLs remain in `collectionsData.ts`. No query parameter,
publisher tag or link identifier was invented/replaced. Display the brand name
Royal Canin correctly while preserving the supplied URL and its original query.
Brand searches may include a broader range of products; labels must not promise
a species filter that the destination does not implement.

These checks establish destinations and tagged links, not account approval,
order attribution, shipped orders or commission received. Those remain provider
dashboard checks by the owner; do not claim revenue solely from outbound clicks.

## Design and behavior

- Retain Quicksand/Nunito, the approved lighter typography, cream/teal/coral light
  theme and warm brown dark theme.
- Use a compact header, a visible affiliate disclosure and two keyboard-accessible
  pet tabs. Cats start selected because the owner supplied nine cat collections.
- Food links are the first selections. Brand rows form a distinct adjacent group.
  Cat play/care links are a compact second section. Dogs show the four supplied
  food/brand links; no missing dog categories or placeholder products are invented.
- All 13 links are native anchors, open in a separate tab and carry
  `rel="sponsored noopener noreferrer"`. No account is required to browse.
- Use neutral category icons and text brand names. Do not imply a particular SKU,
  approved medication, official brand relationship, live price, rating or stock.
- Prices, checkout, delivery and returns belong to Amazon/the seller. Store visits
  and purchases earn no PawCoins. The site does not infer a member's order.
- Remove the old fake product catalogue and its card component. Migrate remaining
  component references; send `/resources`, `/pet-essentials` and the old
  `/about?tab=store` destination to `/store`. The About Store control links there.
- Update Store metadata, Help, privacy and llms discovery text for active links.

## Measurement

Use the existing single optional GA integration, not a new SDK. `affiliate_click`
records only collection ID, category, pet type, merchant and fixed placement/
platform/link type after analytics consent. Do not include destination URL,
member identity, search text or inferred purchase. Native-shell web events remain
disabled. Link navigation never waits on an analytics response.

## Verification

- Full suite: 143 tests across 18 files passed. Focused checks cover cat/dog
  selection, correct sample destinations, sponsored attributes, disclosure,
  keyboard switching and consent-gated collection events. Brand-label refinements
  passed the focused tests again.
- Lint and TypeScript passed; production Next build passed.
- Browser checked desktop, 390px and 320px widths, nine cat/four dog anchors,
  all 13 unique original short URLs, light/dark layouts and no horizontal overflow.
- Checked legacy redirects through local HTTP; all end at the new Store. The old
  About query may remain as `?tab=store`; canonical stays `/store`.
- Browser QA intercepted optional vendor scripts. Actual GA reports and Amazon
  earnings were not verified, and no order was placed.
- Final publication must include GitHub's Linux Cloudflare bundle check and the
  automatic Workers deployment, followed by inspection of the live Store.

## Deployment repair

The initial `173896a` push passed the web build, tests and TypeScript but failed
the Cloudflare build: Next.js 16.1.6 received an extensionless Google Fonts URL
and reported `next/font/google queries have exactly one entry`. The same error
is described in https://github.com/vercel/next.js/issues/99114.

Bundle the exact Latin font files from the successful local build with their OFL
licenses and load through `next/font/local`. Retain Quicksand/Nunito, CSS variable
names and weight ranges; remove the live Google download from builds. Validate
the follow-up commit's CI/Cloudflare result and browser font rendering.

## Primary reference

[Amazon India operating agreement, section 10](https://affiliate-program.amazon.in/help/operating/agreement)
requires a prominent Associate disclosure. The page uses the prescribed statement.
