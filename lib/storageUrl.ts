/**
 * Builds a public storage URL from the Supabase base URL.
 * Uses NEXT_PUBLIC_SUPABASE_URL env var so it works with both
 * supabase.co (direct) and jiobase.com (Jio ISP workaround).
 */
export function getStorageUrl(bucket: string, path: string): string {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
