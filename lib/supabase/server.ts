import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Cookie-free anon client for public reads (SEO metadata, sitemap, feed).
 * Avoids `cookies()` entirely — safe inside generateMetadata/sitemap on
 * Cloudflare Workers where the cookie-based client can fail silently.
 * Returns null when env vars are absent (e.g. bare local build) so
 * prerendering degrades gracefully instead of crashing.
 */
let publicClient: SupabaseClient<Database> | null = null;

export function createPublicSupabaseClient(): SupabaseClient<Database> | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.error('[supabase] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY not set — public data unavailable');
        return null;
    }
    if (!publicClient) {
        publicClient = createClient<Database>(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return publicClient;
}

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}
