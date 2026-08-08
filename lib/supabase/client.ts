import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            '@supabase/ssr: Your project\'s URL and API key are required to create a Supabase client!\n\n' +
                'Local fix: copy .env.example to .env.local, add NEXT_PUBLIC_SUPABASE_URL and ' +
                'NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase dashboard, then restart `pnpm run dev`.'
        );
    }

    return { url, anonKey };
}

export function createClient() {
    const { url, anonKey } = getSupabaseEnv();
    return createBrowserClient<Database>(url, anonKey);
}

let browserClient: SupabaseClient<Database> | null = null;

function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}

// Lazy singleton — env vars are read on first use, not at module import time.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
    get(_target, prop, receiver) {
        const instance = getSupabaseClient();
        const value = Reflect.get(instance as object, prop, receiver);
        return typeof value === 'function' ? value.bind(instance) : value;
    },
});
