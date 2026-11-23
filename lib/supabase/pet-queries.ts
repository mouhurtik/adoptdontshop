import type { SupabaseClient } from '@supabase/supabase-js';
import { parseSlugId } from '@/utils/slugUtils';
import type { Database, Tables } from './types';

export async function fetchPetBySlug(
    supabase: SupabaseClient<Database>,
    slug: string,
): Promise<Tables<'pet_listings'> | null> {
    const id = parseSlugId(slug).toLowerCase();
    const isFullId = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id);

    if (!isFullId && !/^[a-f0-9]{8}$/.test(id)) return null;

    let query = supabase.from('pet_listings').select('*');

    if (isFullId) {
        query = query.eq('id', id);
    } else {
        // UUID columns cannot use ILIKE. Bound the prefix using native UUID comparisons.
        query = query
            .gte('id', `${id}-0000-0000-0000-000000000000`)
            .lte('id', `${id}-ffff-ffff-ffff-ffffffffffff`);
    }

    // A colliding short ID must fail rather than silently opening a different pet.
    const { data, error } = await query.limit(2).maybeSingle();
    if (error) throw new Error('Unable to load pet details. Please try again.', { cause: error });
    return data;
}
