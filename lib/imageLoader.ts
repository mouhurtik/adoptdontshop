// Custom image loader for Cloudflare Pages with Supabase image transforms
// Supabase storage URLs are rewritten to use the render API for on-the-fly resizing

interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    const q = quality || 75;

    // For Supabase storage URLs, use the image transformation API
    // Rewrites: /storage/v1/object/public/ → /storage/v1/render/image/public/
    if (src.includes('.supabase.co/storage/v1/object/public/')) {
        return src.replace(
            '/storage/v1/object/public/',
            '/storage/v1/render/image/public/'
        ) + `?width=${width}&quality=${q}&resize=contain`;
    }

    // For other external URLs, return as-is (no transforms available)
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // For local images, add width/quality params for potential future CDN optimization
    return `${src}?w=${width}&q=${q}`;
}

// Helper to generate an optimized URL for raw <img> tags (not using next/image)
export function getOptimizedImageUrl(src: string, width: number, quality: number = 75): string {
    if (src.includes('.supabase.co/storage/v1/object/public/')) {
        return src.replace(
            '/storage/v1/object/public/',
            '/storage/v1/render/image/public/'
        ) + `?width=${width}&quality=${quality}&resize=contain`;
    }
    return src;
}
