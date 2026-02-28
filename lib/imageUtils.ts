/**
 * Client-side image conversion utilities
 *
 * Converts uploaded images (PNG, JPG, GIF) to WebP format using
 * the HTML Canvas API. Zero external dependencies — works in all
 * modern browsers (Safari 16+, Chrome 32+, Firefox 65+).
 */

const DEFAULT_QUALITY = 0.85;
const DEFAULT_MAX_WIDTH = 1200;

/**
 * Convert any image File/Blob to WebP format via Canvas.
 *
 * @param file   The source image (File from an <input> or a Blob)
 * @param quality  WebP quality 0–1 (default 0.85)
 * @returns A WebP Blob
 */
export async function convertToWebP(
    file: File | Blob,
    quality: number = DEFAULT_QUALITY
): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const webpBlob = await canvas.convertToBlob({
        type: 'image/webp',
        quality,
    });
    return webpBlob;
}

/**
 * Resize (if needed) and convert an image to WebP.
 *
 * If the image's width exceeds `maxWidth`, it is proportionally
 * scaled down before encoding. Images smaller than `maxWidth` are
 * encoded at their original dimensions.
 *
 * @param file      The source image
 * @param maxWidth  Maximum width in px (default 1200)
 * @param quality   WebP quality 0–1 (default 0.85)
 * @returns A WebP Blob
 */
export async function resizeAndConvertToWebP(
    file: File | Blob,
    maxWidth: number = DEFAULT_MAX_WIDTH,
    quality: number = DEFAULT_QUALITY
): Promise<Blob> {
    const bitmap = await createImageBitmap(file);

    let targetWidth = bitmap.width;
    let targetHeight = bitmap.height;

    if (bitmap.width > maxWidth) {
        const ratio = maxWidth / bitmap.width;
        targetWidth = maxWidth;
        targetHeight = Math.round(bitmap.height * ratio);
    }

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    const webpBlob = await canvas.convertToBlob({
        type: 'image/webp',
        quality,
    });
    return webpBlob;
}

/**
 * Replace whatever file extension with `.webp`.
 *
 * @example toWebPFilename('photo.png')   → 'photo.webp'
 * @example toWebPFilename('IMG_001.JPG') → 'IMG_001.webp'
 */
export function toWebPFilename(originalName: string): string {
    const dotIndex = originalName.lastIndexOf('.');
    const base = dotIndex > 0 ? originalName.substring(0, dotIndex) : originalName;
    return `${base}.webp`;
}
