// Custom image loader for Cloudflare Pages
// Appends width/quality hints to Supabase Storage URLs for render transforms.
// Supabase free tier includes basic image transforms via the render API.

interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    // Only transform Supabase Storage URLs
    if (src.includes('supabase.co/storage/')) {
        const url = new URL(src);
        url.searchParams.set('width', String(width));
        url.searchParams.set('quality', String(quality || 75));
        return url.toString();
    }

    // Return all other URLs as-is
    return src;
}

// Helper: returns optimized URL with width/quality params for Supabase images
// Used by PostCard and PostCardServer for consistent image handling
export function getOptimizedImageUrl(src: string, width?: number, quality?: number): string {
    if (!width || !src.includes('supabase.co/storage/')) return src;

    try {
        const url = new URL(src);
        url.searchParams.set('width', String(width));
        url.searchParams.set('quality', String(quality || 75));
        return url.toString();
    } catch {
        return src;
    }
}
