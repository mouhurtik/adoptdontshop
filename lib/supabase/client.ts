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

// Lazy singleton for client-side use — only initializes when first accessed,
// preventing crashes during Next.js static prerendering in CI (where env vars may be absent).
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
    get(_target, prop, receiver) {
        if (!_supabase) {
            _supabase = createClient();
        }
        return Reflect.get(_supabase, prop, receiver);
    },
});
