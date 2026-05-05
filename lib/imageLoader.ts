// Custom image loader for Cloudflare Pages
// Passes through image URLs directly since Supabase image transforms
// require a paid plan and Cloudflare image resizing requires a paid plan.

interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src }: ImageLoaderProps): string {
    // Return all URLs as-is — no server-side transforms available on free tiers
    return src;
}

// Helper: returns the original URL (no transforms on free tier)
// Used by PostCard and PostCardServer for consistent image handling
export function getOptimizedImageUrl(src: string, _width?: number, _quality?: number): string {
    return src;
}
