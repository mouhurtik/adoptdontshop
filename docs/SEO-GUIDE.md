# AdoptDontShop — SEO Guide

> Reference document for all SEO-related configurations, metadata locations, and optimization strategies.

---

## 1. Metadata Architecture

In Next.js App Router, metadata is resolved by **merging** layout → page, with **page-level metadata overriding layout**. This is why the title wasn't updating — `app/page.tsx` had its own title that overrode the default in `app/layout.tsx`.

### Where Metadata Lives

| File | Scope | What it controls |
|------|-------|-----------------|
| `app/layout.tsx` | **Global default** | Default title, OG, Twitter, robots, icons, manifest |
| `app/page.tsx` | Home page only | Overrides layout title for `/` |
| `app/community/layout.tsx` | Community listing | Title for `/community` |
| `app/community/[slug]/page.tsx` | Individual blog posts | Dynamic `generateMetadata()` → unique title, OG image, canonical |
| `app/pet/[slug]/page.tsx` | Individual pet pages | Dynamic `generateMetadata()` → unique title, OG image |
| `app/browse/layout.tsx` | Browse page | Title for `/browse` |
| `app/about/layout.tsx` | About page | Title for `/about` |
| `constants/config.ts` | App-wide constants | `APP_CONFIG.DESCRIPTION` used in footer/components |

### Title Tag Template

The root layout uses a template system:
```
default: 'AdoptDontShop: Adopt Rescue Dogs & Cats Near You'  (51 chars)
template: '%s | AdoptDontShop'
```

Any child page that sets a `title` string will be rendered as `{title} | AdoptDontShop`. To bypass the template (like the home page does), set the full title string directly.

### Rule: Page > Layout

> [!IMPORTANT]
> If both `app/foo/layout.tsx` AND `app/foo/page.tsx` export metadata with a `title`, the **page** wins. Many routes in this project have duplicate metadata in both — the layout export is effectively dead code. Clean up over time.

---

## 2. Structured Data (JSON-LD)

| Schema | File | Purpose |
|--------|------|---------|
| `Organization` | `app/layout.tsx` | Global site identity |
| `BlogPosting` | `views/CommunityPostDetail.tsx` | Rich results for blog posts (author, date, image) |

### Adding New Schemas

For new page types, add inline `<script type="application/ld+json">` with the appropriate schema. Key types to consider:
- `FAQPage` — for FAQ sections
- `Product` — if pet essentials gets merchant integration
- `LocalBusiness` — if physical locations are added

---

## 3. Sitemap

**File:** `app/sitemap.ts`  
**URL:** `https://adoptdontshop.xyz/sitemap.xml`

Currently includes:
- Static pages (`/`, `/browse`, `/community`, `/about`, etc.)
- All published pet listings (`/pet/{slug}`)
- All published community posts (`/community/{slug}`)

### After adding new routes:
1. Add the route to the `staticPages` array in `sitemap.ts`
2. Submit updated sitemap in Google Search Console

---

## 4. RSS Feed

**File:** `app/feed.xml/route.ts`  
**URL:** `https://adoptdontshop.xyz/feed.xml`

Returns the 50 most recent published community posts as RSS 2.0 XML. Auto-discovered via `<link rel="alternate">` in `layout.tsx`.

**Submit to aggregators:**
- [Feedly](https://feedly.com) — search for your feed URL
- Google News Publisher Center (if eligible)
- Any pet/animal focused RSS directories

---

## 5. Favicons & Web Manifest

**Files in `public/`:**

| File | Size | Used by |
|------|------|---------|
| `favicon.ico` | Multi-size | Browsers (legacy) |
| `favicon.svg` | Scalable | Modern browsers |
| `favicon-16x16.png` | 16×16 | Tab icon |
| `favicon-32x32.png` | 32×32 | Tab icon |
| `favicon-96x96.png` | 96×96 | Shortcuts |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `android-chrome-192x192.png` | 192×192 | Android (manifest) |
| `android-chrome-512x512.png` | 512×512 | Android splash (manifest) |
| `site.webmanifest` | — | PWA manifest |

> [!NOTE]
> Google caches favicons for weeks. If the old green logo still appears in search results, use Google Search Console's URL Inspection → Request Indexing to force a re-crawl. It may take 2-4 weeks for Google to update the cached favicon.

### Updating favicons:
1. Replace all PNG files in `public/` with new versions
2. Update `favicon.svg` (inline SVG) and `favicon.ico`
3. Deploy and request re-indexing in Google Search Console

---

## 6. Rendering & LLM Readability (Seoptimer Insight)

**Problem:** 62% rendering percentage means most content is client-rendered via JavaScript. Search engines and LLMs that don't execute JS will miss it.

**What's already server-rendered:**
- Home page (static with ISR)
- Pet detail pages (`generateMetadata` + ISR)
- Community post pages (`generateMetadata` + ISR) ← **newly added**
- Sitemap, RSS feed

**What's still client-rendered:**
- Community post body (TiptapRenderer is `dynamic` with `ssr: false`)
- Browse page pet grid (data loaded via React Query)
- Messages, Profile pages (authenticated content — expected)

**To reduce rendering percentage further:**
1. Consider Server Components for the browse page pet grid (SSR the initial load, hydrate for filters)
2. The TiptapRenderer could potentially be server-rendered if the content is plain HTML

---

## 7. Page File Size

**Current static bundle:** ~2.7MB across 70 files

**Optimizations already applied:**
- `optimizePackageImports` for lucide, framer-motion, date-fns, supabase, etc.
- Dynamic import for TiptapEditor (code-split, only loads on write page)
- Trimmed unused font weights (Quicksand 300, Nunito 800 dropped)
- Reduced Unsplash image sizes (Hero w=800, Insurance w=800, q=75)

**Further reduction options:**
- Lazy-load framer-motion animations (`LazyMotion` + `domAnimation`)
- Lazy-load below-fold sections (Sponsors, Success Stories on home page)
- Convert Unsplash images to `<Image>` component with automatic WebP optimization
- Consider `next/dynamic` for heavy below-fold components

---

## 8. Link Building Strategy

| Strategy | Priority | Action |
|----------|----------|--------|
| Content marketing | 🔴 High | Write shareable blog posts (adoption success stories, care guides) — community feature is perfect for this |
| Directory submissions | 🔴 High | Submit to pet directories, Crunchbase, Product Hunt, IndiaMART |
| Social profiles | 🟡 Medium | Create official profiles on Instagram, Twitter, Facebook with backlinks |
| Guest blogging | 🟡 Medium | Write for pet blogs / animal welfare sites with backlinks |
| Shelter partnerships | 🟡 Medium | Get listed on partner shelter websites |
| RSS syndication | 🟢 Done | `/feed.xml` auto-discovered — submit to aggregators |
| Schema markup | 🟢 Done | Organization + BlogPosting schemas active |
| Internal linking | 🟢 Done | Related Posts section on every blog post |

---

## 9. Quick Reference: Key URLs

| URL | Purpose |
|-----|---------|
| `https://adoptdontshop.xyz/sitemap.xml` | Sitemap (submit to GSC) |
| `https://adoptdontshop.xyz/feed.xml` | RSS feed (submit to aggregators) |
| `https://adoptdontshop.xyz/robots.txt` | Robots file |
| `https://adoptdontshop.xyz/llms.txt` | LLM context file |

---

## 10. Checklist: Adding a New Page

When adding a new route to the app:

1. **Export metadata** in the `page.tsx` (not just the layout)
2. **Add to sitemap** in `app/sitemap.ts`
3. **Use semantic HTML** — single `<h1>`, proper heading hierarchy
4. **Add canonical URL** if the page can be accessed from multiple paths
5. **Test OG preview** — share the URL on WhatsApp/Twitter to verify image + title
