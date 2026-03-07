/**
 * Builds a public storage URL from the Supabase base URL.
 * Uses NEXT_PUBLIC_SUPABASE_URL env var.
 */
export function getStorageUrl(bucket: string, path: string): string {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
