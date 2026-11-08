# Bundle 005: simpler community, appearance, Store and admin emails

User requested these changes on November 8, 2026, following Bundle 004.

## Decisions and implementation

- Public contact is `founder@adoptdontshop.xyz`, including About, policies, Help,
  Contact and the shared footer. Mailbox deliverability is not established by a
  source change and no test email was sent.
- Compared the user's `f7f8d4a6-adoptdontshop.mouhurtik.workers.dev` reference in
  a browser. Fonts were already Quicksand/Nunito. Restore 20px/700 post titles
  and an 18px/700 logo; retain keyboard, touch, navigation and scroll improvements.
- Use one main feed with existing topic tags. Replace the sidebar's joined-group
  and create-group flow with topic links. Existing group routes/data stay intact.
  Topic links must update filters even when navigating within the home route.
- Replace the large homepage marketing card with a compact visible heading and
  short useful description/link. No text is concealed for search rankings.
- Add `/store` to desktop and mobile navigation, page metadata and sitemap. Keep
  the original About/store tab usable. Replacement affiliate links are still
  pending, so buttons remain disabled and there are no purchase/visit rewards.
- Add system-aware light/dark selection before first paint, an explicit toggle,
  cross-tab updates and persisted choice. Dark mode uses warm brown backgrounds,
  soft cream type and orange accents, with separate readable action fills.
- Extract comments into a shared parent/reply layout. Link both kinds of author
  to their profile and deliberate message composer. Use a bounded, labelled
  textarea with a flat, integrated submit control, pending/empty guards and
  retryable failure state. Keep failed drafts instead of silently losing text.
- `/messages/new?to=…` requires sign-in and a valid non-self recipient. It sends
  no automatic greeting; a typed message and explicit submit are required. On
  success open only an accessible conversation in the existing Messages screen.
- Enable Workers observability in `wrangler.toml` with 10% head sampling. This
  controls diagnostic request logging, not registered-user or retention metrics.
  No new request/body/email logging is added. Dashboard log visibility is a
  separate provider check after deployment.

## Admin email release

Reached the correct project (`uibsmaizlrekfooryrwq`, AdoptDontShop,
ACTIVE_HEALTHY, ap-south-1) via the saved account's Management API because no
Supabase MCP tools were exposed. Observed 50 Auth users, 50 profiles, one role
record and a database of approximately 65.6 MB.

Inspected live `user_roles` RLS, grants, policies, triggers and role-related
definer functions. Members can read their own role; only `is_admin(auth.uid())`
can mutate roles. The helper has a fixed search path. No caller-controlled
role assignment path was found in that inspected surface.

Applied only `20261106000000_admin_user_emails.sql` through Management API SQL,
including a PostgREST schema-cache notification. This was not a bulk migration
push and no unrelated migration or user data was changed. The function is
idempotent, authorizes `auth.uid()` in the database and reads requested Auth IDs
only, up to 1000 per call. Emails are not added to public profiles. The migration
is tracked with a narrow gitignore exception; older private SQL remains ignored.

Live checks in a rolled-back transaction established:

1. Anonymous execution is denied.
2. An ordinary real member cannot retrieve emails.
3. The member cannot grant themselves an admin role.
4. The admin lookup maps all 50 requested IDs/emails exactly to Auth records.
5. Empty inputs return no rows and 1001 IDs are rejected.

The REST endpoint is available and returns permission denial (`42501`) for an
anonymous call. Verification returned only counts/pass-fail, not real emails.
The authenticated browser table was checked with synthetic fixtures, not an
owner's live admin session. The UI supports email lookup errors/retry and search.

## PawMap remains unpublished

The user explicitly chose an unpublished design preview while access controls
are pending. [Open the standalone preview](../docs/design/pawmap-list-first/preview.html)
and [read its data/access contract](../docs/design/pawmap-list-first/README.md).
It demonstrates a list sorted by approximate area, filters, light/warm-dark
themes, desktop hover/focus preview and mobile tap. All examples are fictional;
there is no live map route, exact animal location, device-location request or
third-party map integration in this bundle.

## Verification and publication

- Local lint, TypeScript and production build passed. All 138 tests in 16 files
  passed, including admin emails and comment/message behavior.
- Browser checked desktop and 390px/320px layouts, actual computed font weights,
  light/dark surfaces, persisted theme, Store selection, topic navigation and
  signed-out forms. Synthetic signed-in checks covered comment parent/reply
  profile links, enabled/disabled input state, mobile overflow and admin Email
  cells. No real comment, message or user account was created by browser QA.
- Standalone PawMap checked list default, cat filtering, map hover, pinned map
  click/tap, Close, and mobile overflow.
- Publish with explicit staging, excluding the historical audit, session
  attachments, configuration credentials, browser logs and temporary backups.
  Verify GitHub Linux Cloudflare bundle and automatic Workers deployment before
  claiming the new source is live.

## References checked

- https://developers.cloudflare.com/workers/observability/logs/workers-logs/
- https://developers.google.com/search/docs/essentials/spam-policies#hidden-text-and-link-abuse
- User's historical Worker deploy and https://www.meowmbai.fun/map for visual comparison.
