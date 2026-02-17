'use client';

// Custom image loader for Cloudflare Pages
// Since next/image's default optimization doesn't work on Cloudflare,
// we pass through the image URL directly

interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    // For external URLs, return as-is
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // For local images, add width/quality params for potential future CDN optimization
    return `${src}?w=${width}&q=${quality || 75}`;
}
