# Image Storage Migration Guide

> **Current setup:** Supabase Storage (free tier — 1GB).  
> **Future options:** Supabase Pro (100GB), Cloudinary, or Cloudflare R2.

---

## Option 1: Supabase Pro (Recommended Short-Term)

If you purchase Supabase Pro ($25/mo), you get **100GB storage** with CDN.

**Pros:** No code changes needed — existing upload logic stays the same.  
**Cons:** Images served from a single Supabase region, no auto-optimization (WebP/AVIF).

### Setup
Nothing to change. Current code already uses `supabase.storage.from('pet-images')`.

---

## Option 2: Cloudinary (Recommended Long-Term)

**Free tier:** 25GB storage, 25GB bandwidth/mo  
**Paid:** Starts at $89/mo for 225GB bandwidth (higher than R2)

**Pros:**  
- Automatic format optimization (WebP, AVIF based on browser)
- On-the-fly transformations via URL params (resize, crop, quality)
- Global CDN (Akamai)
- Drop-in React/Next.js SDK

**Cons:** Paid tier is expensive compared to R2

### Setup Steps

1. **Create Cloudinary account** at https://cloudinary.com/users/register
2. **Get credentials** from Dashboard → `cloud_name`, `api_key`, `api_secret`
3. **Add to `.env`:**
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Install SDK:**
   ```bash
   npm install cloudinary next-cloudinary
   ```
5. **Update `PetListingForm.tsx`** — Replace Supabase Storage upload with Cloudinary upload widget
6. **Update `next.config.mjs`** — Add `res.cloudinary.com` to image domains
7. **Migrate existing images** — Script to download from Supabase Storage and re-upload to Cloudinary

### Cloudinary URL Format
```
https://res.cloudinary.com/{cloud_name}/image/upload/w_400,h_300,c_fill,f_auto,q_auto/{public_id}
```
- `f_auto` — Auto-format (WebP/AVIF)
- `q_auto` — Auto-quality
- `w_400,h_300,c_fill` — Resize and crop

### Migration Script (Run Once)
```bash
# 1. Export image URLs from Supabase
# 2. Download each image
# 3. Upload to Cloudinary
# 4. Update pet_listings.image_url in DB
```
A detailed script will be created when ready to migrate.

---

## Option 3: Cloudflare R2

**Free tier:** 10GB storage, 0 egress fees  
**Paid:** $0.015/GB/mo storage (very cheap)

**Pros:**  
- Extremely cheap at scale
- Zero egress fees (unlike AWS S3)
- Native Cloudflare CDN integration
- Already on Cloudflare

**Cons:**  
- No built-in image transforms (need Cloudflare Workers for resize)
- More setup work than Cloudinary

### Setup Steps
1. Create R2 bucket in Cloudflare Dashboard
2. Generate R2 API tokens
3. Use `@aws-sdk/client-s3` for uploads (R2 is S3-compatible)
4. Serve via custom domain or `*.r2.dev` URL

---

## Comparison Summary

| Feature | Supabase Pro | Cloudinary | Cloudflare R2 |
|---------|-------------|------------|---------------|
| **Cost (low volume)** | $25/mo | Free (25GB) | Free (10GB) |
| **Cost (high volume)** | $25/mo flat | $89+/mo | ~$1-5/mo |
| **Auto-optimize** | ❌ | ✅ WebP/AVIF | ❌ (manual) |
| **CDN** | Single region | Global (Akamai) | Global (CF) |
| **Code changes** | None | Medium | Medium |
| **Best for** | Quick start | Image-heavy app | Budget at scale |

---

## Recommended Path

1. **Now:** Keep Supabase Storage. 1GB free is enough for ~200 optimized images.
2. **If upgrading Supabase Pro:** Stay with Supabase Storage (100GB, no code changes).
3. **When performance matters:** Migrate to Cloudinary for auto-optimization.
4. **At massive scale:** Consider R2 for cost savings.
