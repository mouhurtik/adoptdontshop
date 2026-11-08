# PawMap list-first design

Open `preview.html` in a browser. This standalone design has fictional examples
only and is not part of the deployed Next routes. No real sightings or map keys
are bundled. The user explicitly requested that PawMap remain unpublished.

- Default to a nearby list, not a full-screen map. City/area selection works
  without requesting device location. Optional device location needs an explicit
  action and must stay local to ranking unless a clear purpose requires otherwise.
- Sort by approximate area distance when a reliable area is known; otherwise group
  by city/area and say distance is unavailable. Do not invent live distances.
- A map control offers desktop hover/focus preview and click/tap to keep it open.
  Escape and an explicit Close button dismiss it. Mobile never depends on hover.
- Use subdued geographic detail and the same light/warm-dark tokens as the app.
  The preview uses a fictional SVG neighbourhood, not production map tiles.
- A live list must expose a coarse projection without precise coordinates,
  addresses, EXIF, feeding schedules or unredacted photo URLs. Removing pins from
  the interface while returning precise fields in the API is insufficient.
- Verification is an authorization rule in the database/API, not a client login
  check. Require revocable access and explicit caregiver consent for any more
  precise disclosure. An account or verified email alone does not establish trust.
- Keep exact sightings, originals and access requests private, audited and bounded.
  Never award coins for animal coordinates. A city-wide count or area membership
  must not make a single vulnerable animal easy to identify.

Before a live pilot: verify the correct Supabase schema, RLS, storage access,
public projections and abuse/revocation behavior. Import no old map/reward branch
wholesale. Existing map code from that branch remains outside main.
