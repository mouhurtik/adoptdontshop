/**
 * Generate Android app icons from the AdoptDontShop logo
 * Run: npx tsx scripts/generate-app-icons.ts
 */
import sharp from 'sharp';
import path from 'path';

const LOGO = path.resolve('public/android-chrome-512x512.png');
const RES = path.resolve('mobile/android/app/src/main/res');

// Android density → pixel size mapping for launcher icons
const SIZES: Record<string, number> = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
};

// Foreground icons are larger (adaptive icon safe zone = 108dp → 72dp visible)
const FG_SIZES: Record<string, number> = {
    'mipmap-mdpi': 108,
    'mipmap-hdpi': 162,
    'mipmap-xhdpi': 216,
    'mipmap-xxhdpi': 324,
    'mipmap-xxxhdpi': 432,
};

async function main() {
    console.log('🐾 Generating app icons from AdoptDontShop logo...\n');

    for (const [folder, size] of Object.entries(SIZES)) {
        const outDir = path.join(RES, folder);

        // ic_launcher.png — full icon
        await sharp(LOGO)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 248, b: 240, alpha: 1 } })
            .png()
            .toFile(path.join(outDir, 'ic_launcher.png'));
        console.log(`  ✅ ${folder}/ic_launcher.png (${size}x${size})`);

        // ic_launcher_round.png — same image, round clip handled by Android
        await sharp(LOGO)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 248, b: 240, alpha: 1 } })
            .png()
            .toFile(path.join(outDir, 'ic_launcher_round.png'));
        console.log(`  ✅ ${folder}/ic_launcher_round.png (${size}x${size})`);
    }

    // Foreground icons for adaptive icons (Android 8+)
    for (const [folder, size] of Object.entries(FG_SIZES)) {
        const outDir = path.join(RES, folder);

        await sharp(LOGO)
            .resize(Math.round(size * 0.67), Math.round(size * 0.67), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .extend({
                top: Math.round(size * 0.165),
                bottom: Math.round(size * 0.165),
                left: Math.round(size * 0.165),
                right: Math.round(size * 0.165),
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .resize(size, size) // ensure exact size after extend
            .png()
            .toFile(path.join(outDir, 'ic_launcher_foreground.png'));
        console.log(`  ✅ ${folder}/ic_launcher_foreground.png (${size}x${size})`);
    }

    console.log('\n✨ All icons generated successfully!');
}

main().catch(console.error);
