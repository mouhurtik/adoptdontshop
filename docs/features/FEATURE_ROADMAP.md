# AdoptDontShop — Feature Roadmap

**Last Updated:** February 16, 2026

---

## Current Features (v1.0)

| Feature | Status | Notes |
|---------|--------|-------|
| Browse pets with filters | ✅ Live | Type, age, urgent, sort |
| Pet detail page with gallery | ✅ Live | SEO slug URLs |
| List a pet for adoption | ✅ Live | Form with validation |
| Adoption application | ✅ Live | In-modal form |
| Shareable pet cards | ✅ Live | Image generation |
| Pet essentials guide | ✅ Live | Educational content |
| Success stories | ✅ Live | Static content |
| Sponsor showcase | ✅ Live | Static content |
| Dark mode | ✅ Live | System + manual toggle |
| Responsive design | ✅ Live | Mobile-first |
| Basic auth context | ✅ Built | Not fully integrated |

---

## Planned Features

### Phase 0 — Codebase Cleanup
- [ ] Refactor `PetListingForm.tsx` into sections
- [ ] Migrate `usePets.ts` to React Query
- [ ] Split `PetEssentials.tsx` into components

### Phase 1 — Authentication + User Profiles
- [ ] `profiles` table with auto-creation trigger
- [ ] `user_roles` table (admin, user, shelter_owner, moderator)
- [ ] RLS on all tables
- [ ] Login / Signup pages
- [ ] Account type selection (Individual / Organization)
- [ ] Profile settings page
- [ ] Link `pet_listings` to user profiles

### Phase 2 — Admin Portal
- [ ] Admin dashboard with analytics
- [ ] User management (view, disable, role assignment)
- [ ] Listing moderation (approve / reject)
- [ ] Adoption application review
- [ ] Admin-only route protection

### Phase 3 — Privacy-Focused Messaging
- [ ] `conversations` + `messages` + `message_read_receipts` tables
- [ ] Realtime messaging via Supabase subscriptions
- [ ] "Message Caregiver" from pet detail page
- [ ] Seen indicators (optional per user)
- [ ] Conversation list with unread counts

### Phase 4 — SEO + Polish
- [ ] Pre-render static pages (Home, About, Terms)
- [ ] Dynamic OG tags per pet via Cloudflare Worker
- [ ] Sitemap.xml generation
- [ ] JSON-LD structured data
- [ ] Vendor bundle splitting

---

## Future Considerations (v3.0+)

| Feature | Priority | Notes |
|---------|----------|-------|
| Organization accounts | Medium | Bulk listing, team management, verified badge |
| Email notifications | Medium | New messages, application updates |
| Pet favorites / wishlist | Low | Requires auth |
| Advanced search (location) | Low | Geolocation filtering |
| Blog / content section | Low | SEO value, educational content |
| Next.js migration | Low | Only if SEO becomes primary growth channel |
| Native mobile app | Low | Capacitor or React Native |
| Multi-language support | Low | i18n for regional expansion |
