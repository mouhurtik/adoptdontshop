/**
 * One-time migration script: Convert all existing images to WebP
 *
 * What it does:
 *   1. Fetches all pet_listings with image_url (Supabase bucket)
 *   2. Fetches all community_posts with featured_image_url
 *   3. Downloads each image, converts to WebP via sharp, re-uploads
 *   4. Updates the database row with the new WebP URL
 *   5. Downloads the founder photo from Google Photos, converts, uploads
 *
 * Prerequisites:
 *   - npm install -D sharp (already added as devDep)
 *   - A .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *     (or set SUPABASE_SERVICE_ROLE_KEY for full write access)
 *
 * Usage:
 *   npm run migrate:webp
 *
 * Safety:
 *   - Idempotent: skips images that are already .webp
 *   - Does NOT delete originals (uncomment the cleanup section if you want that)
 *   - Logs every action for audit
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── Config ────────────────────────────────────────────────

const WEBP_QUALITY = 85;
const PET_MAX_WIDTH = 1200;
const COMMUNITY_MAX_WIDTH = 1600;

const FOUNDER_PHOTO_URL =
    'https://lh3.googleusercontent.com/pw/AP1GczPP3ut83cBmFXmNL9D5I76DmwBvAYi8spjCclhrpwDDXXK51LZ8qIgojWYJNXPqznl0Go7jeWg-5vDIu3rtfHgbKXRkMogYq9mOo4Dkoce3lGFJXpOlZIxXzfpdO1w4ETX6KlxqqFhFOmZmk66u6Cq-wA=w711-h949-s-no-gm';
const FOUNDER_DEST_PATH = 'founder/mouhurtik-ray.webp';

// ─── Load environment ──────────────────────────────────────

function loadEnv() {
    try {
        const envPath = resolve(process.cwd(), '.env.local');
        const envContent = readFileSync(envPath, 'utf-8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    } catch {
        // .env.local may not exist if env vars are set externally
    }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
        '❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Helpers ───────────────────────────────────────────────

async function downloadImage(url: string): Promise<Buffer> {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

async function convertToWebP(
    buffer: Buffer,
    maxWidth: number
): Promise<Buffer> {
    let pipeline = sharp(buffer);
    const meta = await pipeline.metadata();

    if (meta.width && meta.width > maxWidth) {
        pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}

function _extractBucketPath(
    publicUrl: string,
    bucketName: string
): string | null {
    // Supabase public URLs look like:
    //   https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.substring(idx + marker.length);
}

function isAlreadyWebP(url: string): boolean {
    return url.toLowerCase().endsWith('.webp');
}

// ─── Pet Listings Migration ────────────────────────────────

async function migratePetImages() {
    console.log('\n🐾 Migrating pet listing images to WebP...\n');

    const { data: pets, error } = await supabase
        .from('pet_listings')
        .select('id, pet_name, image_url')
        .not('image_url', 'is', null);

    if (error) {
        console.error('❌ Failed to fetch pet_listings:', error.message);
        return;
    }

    if (!pets || pets.length === 0) {
        console.log('  No pets with images found.');
        return;
    }

    console.log(`  Found ${pets.length} pets with images.\n`);

    let converted = 0;
    let skipped = 0;
    let failed = 0;

    for (const pet of pets) {
        const imageUrl = pet.image_url as string;

        if (isAlreadyWebP(imageUrl)) {
            console.log(`  ⏭️  [${pet.pet_name}] Already WebP — skipping`);
            skipped++;
            continue;
        }

        try {
            console.log(`  ⏳ [${pet.pet_name}] Downloading...`);
            const originalBuffer = await downloadImage(imageUrl);

            console.log(
                `     Converting (${(originalBuffer.length / 1024).toFixed(0)} KB → WebP)...`
            );
            const webpBuffer = await convertToWebP(originalBuffer, PET_MAX_WIDTH);
            const savings = (
                ((originalBuffer.length - webpBuffer.length) / originalBuffer.length) *
                100
            ).toFixed(1);
            console.log(
                `     Result: ${(webpBuffer.length / 1024).toFixed(0)} KB (${savings}% smaller)`
            );

            // Generate new filename
            const newFileName = `${Math.random().toString(36).substring(2, 15)}.webp`;

            console.log(`     Uploading as ${newFileName}...`);
            const { error: uploadError } = await supabase.storage
                .from('pet-images')
                .upload(newFileName, webpBuffer, {
                    contentType: 'image/webp',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get new public URL
            const { data: urlData } = supabase.storage
                .from('pet-images')
                .getPublicUrl(newFileName);

            // Update database
            const { error: updateError } = await supabase
                .from('pet_listings')
                .update({ image_url: urlData.publicUrl })
                .eq('id', pet.id);

            if (updateError) throw updateError;

            console.log(`  ✅ [${pet.pet_name}] Done → ${urlData.publicUrl}\n`);
            converted++;

            // Optional: delete old file from bucket
            // const oldPath = extractBucketPath(imageUrl, 'pet-images');
            // if (oldPath) {
            //     await supabase.storage.from('pet-images').remove([oldPath]);
            //     console.log(`     🗑️  Deleted old file: ${oldPath}`);
            // }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`  ❌ [${pet.pet_name}] Failed: ${msg}\n`);
            failed++;
        }
    }

    console.log(
        `\n  Pet images summary: ${converted} converted, ${skipped} skipped, ${failed} failed`
    );
}

// ─── Community Posts Migration ─────────────────────────────

async function migrateCommunityImages() {
    console.log('\n📝 Migrating community post images to WebP...\n');

    const { data: posts, error } = await supabase
        .from('community_posts')
        .select('id, title, featured_image_url')
        .not('featured_image_url', 'is', null);

    if (error) {
        console.error('❌ Failed to fetch community_posts:', error.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('  No posts with featured images found.');
        return;
    }

    console.log(`  Found ${posts.length} posts with featured images.\n`);

    let converted = 0;
    let skipped = 0;
    let failed = 0;

    for (const post of posts) {
        const imageUrl = post.featured_image_url as string;

        if (isAlreadyWebP(imageUrl)) {
            console.log(`  ⏭️  [${post.title}] Already WebP — skipping`);
            skipped++;
            continue;
        }

        try {
            console.log(`  ⏳ [${post.title}] Downloading...`);
            const originalBuffer = await downloadImage(imageUrl);

            console.log(
                `     Converting (${(originalBuffer.length / 1024).toFixed(0)} KB → WebP)...`
            );
            const webpBuffer = await convertToWebP(
                originalBuffer,
                COMMUNITY_MAX_WIDTH
            );
            const savings = (
                ((originalBuffer.length - webpBuffer.length) / originalBuffer.length) *
                100
            ).toFixed(1);
            console.log(
                `     Result: ${(webpBuffer.length / 1024).toFixed(0)} KB (${savings}% smaller)`
            );

            const newFileName = `migrated/${Date.now()}.webp`;

            console.log(`     Uploading as ${newFileName}...`);
            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(newFileName, webpBuffer, {
                    contentType: 'image/webp',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('community-images')
                .getPublicUrl(newFileName);

            const { error: updateError } = await supabase
                .from('community_posts')
                .update({ featured_image_url: urlData.publicUrl })
                .eq('id', post.id);

            if (updateError) throw updateError;

            console.log(`  ✅ [${post.title}] Done → ${urlData.publicUrl}\n`);
            converted++;
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`  ❌ [${post.title}] Failed: ${msg}\n`);
            failed++;
        }
    }

    console.log(
        `\n  Community images summary: ${converted} converted, ${skipped} skipped, ${failed} failed`
    );
}

// ─── Founder Photo Migration ───────────────────────────────

async function migrateFounderPhoto() {
    console.log('\n👤 Migrating founder photo to WebP...\n');

    try {
        // Check if already uploaded
        const { data: existing } = await supabase.storage
            .from('pet-images')
            .list('founder', { limit: 10 });

        if (existing && existing.some((f) => f.name === 'mouhurtik-ray.webp')) {
            const { data: urlData } = supabase.storage
                .from('pet-images')
                .getPublicUrl(FOUNDER_DEST_PATH);
            console.log(`  ⏭️  Already exists at ${urlData.publicUrl} — skipping`);
            console.log('  ⚠️  Remember to update AboutUs.tsx and OurStoryWidget.tsx with this URL');
            return urlData.publicUrl;
        }

        console.log('  ⏳ Downloading from Google Photos...');
        const originalBuffer = await downloadImage(FOUNDER_PHOTO_URL);
        console.log(
            `     Original: ${(originalBuffer.length / 1024).toFixed(0)} KB`
        );

        console.log('     Converting to WebP...');
        const webpBuffer = await convertToWebP(originalBuffer, 1200);
        const savings = (
            ((originalBuffer.length - webpBuffer.length) / originalBuffer.length) *
            100
        ).toFixed(1);
        console.log(
            `     Result: ${(webpBuffer.length / 1024).toFixed(0)} KB (${savings}% smaller)`
        );

        console.log(`     Uploading as ${FOUNDER_DEST_PATH}...`);
        const { error: uploadError } = await supabase.storage
            .from('pet-images')
            .upload(FOUNDER_DEST_PATH, webpBuffer, {
                contentType: 'image/webp',
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('pet-images')
            .getPublicUrl(FOUNDER_DEST_PATH);

        console.log(`  ✅ Founder photo uploaded → ${urlData.publicUrl}`);
        console.log(
            '  ⚠️  Now update AboutUs.tsx and OurStoryWidget.tsx with this URL'
        );
        return urlData.publicUrl;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ❌ Founder photo migration failed: ${msg}`);
        return null;
    }
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  AdoptDontShop — Image WebP Migration Script  ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`\nSupabase URL: ${SUPABASE_URL}`);
    console.log(
        `Auth key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon'}\n`
    );

    await migratePetImages();
    await migrateCommunityImages();
    const founderUrl = await migrateFounderPhoto();

    console.log('\n════════════════════════════════════════════════');
    console.log('Migration complete!');
    if (founderUrl) {
        console.log(`\nFounder photo URL (for code update):\n  ${founderUrl}`);
    }
    console.log(
        '\nNext steps:\n' +
        '  1. Verify images on the live site\n' +
        '  2. Update founder photo URLs in AboutUs.tsx & OurStoryWidget.tsx\n' +
        '  3. Optionally uncomment the cleanup code to delete old originals\n'
    );
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
