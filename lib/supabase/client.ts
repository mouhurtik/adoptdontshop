import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Default singleton for client-side use
// Replaces: import { supabase } from "@/integrations/supabase/client"
export const supabase = createClient();
