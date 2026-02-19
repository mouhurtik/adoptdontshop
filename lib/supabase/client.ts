import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

let _supabase: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error(
            'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
        );
    }

    return createBrowserClient<Database>(url, key);
}

/**
 * Lazy singleton for client-side use.
 * Only initializes when first called, preventing crashes during
 * Next.js static prerendering in CI (where env vars may be absent).
 */
export function getSupabase() {
    if (!_supabase) {
        _supabase = createClient();
    }
    return _supabase;
}

// Re-export as `supabase` for backward compat — getter that returns the real client.
// IMPORTANT: Use this only at call sites (inside functions/hooks/effects), NOT at module top level.
export const supabase = (() => {
    // Return a proxy that defers initialization but properly binds methods
    return new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
        get(_target, prop, _receiver) {
            const client = getSupabase();
            const value = (client as unknown as Record<string | symbol, unknown>)[prop];
            if (typeof value === 'function') {
                return value.bind(client);
            }
            return value;
        },
    });
})();
