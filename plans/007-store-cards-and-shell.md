# Bundle 007: product-style Store cards and simpler shell

User correction, November 8, 2026. This replaces Bundle 006's pantry/brand-row
layout with the explicitly requested All / Cats / Dogs card grid.

## Changes

- All is initially selected and shows all 13 existing affiliate links. Cats shows
  nine; Dogs shows four. The All ordering starts with both pets' dry/wet food.
  Keep native sponsored anchors, consent-gated click measurement and the existing
  exact publisher URLs. Do not invent prices, reviews, stock or new product links.
- Use consistent cards with image/illustration areas, pet labels, titles, short
  descriptions and Shop on Amazon actions. Reuse existing generic category photos
  and code-native illustrations. Brand panels use text names, not fabricated
  manufacturer logos or claimed official packaging. No Product/Offer schema is
  added for these category/search destinations.
- Theme control is icon-only with an accessible label and tooltip, immediately
  beside the site name on desktop/mobile. In the collapsed sidebar it remains
  available below the paw icon.
- Remove the sidebar Topics section. The feed's own topic filtering remains.
- The sidebar frame does not scroll. Its main navigation can shrink and scroll
  on short windows, preserving access to the profile and account controls. Do not
  hide overflowing controls with a scrollbar-only cosmetic workaround.
- Footer social links use standalone currentColor SVG marks in a single row,
  based on the reference treatment in the user's `mouhurtik_com` Footer.astro.
  LinkedIn's path is reused there; Facebook/Instagram use matching SVG marks.
  Keep all three approved official URLs and accessible link names. Contact email
  stays visible separately. The reference project was inspected read-only.

## Verification

- Local lint, TypeScript and production build passed; all 143 regression tests
  passed. Updated the existing card-filter and sidebar tests to the new contract.
- Local desktop, 390px and 320px browser checks: 13/9/4 card counts, light/dark
  layouts, no horizontal overflow, SVG footer links without visible platform-name
  text, and retained affiliate anchors.
- Synthetic signed-in browser checks at 1440x720 for member and admin layouts:
  neither sidebar nor its navigation overflowed. Theme icon fits to the right of
  the logo, with no text. At 1024x480, only main navigation scrolls and Logout
  remains within the viewport. Collapsing to 72px retains the theme control.
- Synthetic account/network responses were isolated locally; no live comment,
  message, account or role change was made. No changes to the portfolio project.
- Inspect GitHub Linux Cloudflare bundle and automatic Workers deployment, then
  confirm the production Store and footer. Preserve untracked audit/attachments.
