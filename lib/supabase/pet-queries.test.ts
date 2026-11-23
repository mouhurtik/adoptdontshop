import { createClient } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPetBySlug } from './pet-queries';
import type { Database } from './types';

const id = 'c866752a-0000-4000-8000-000000000001';
const pet = { id, pet_name: 'Santra', status: 'available' };
const fetchMock = vi.fn<typeof fetch>();
const supabase = createClient<Database>('https://example.supabase.co', 'test-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchMock },
});

beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(JSON.stringify([pet]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }));
});

describe('fetchPetBySlug', () => {
    it.each(['santra-c866752a', 'old-name--c866752a', 'c866752a', 'Santra-C866752A'])(
        'resolves existing short-ID URLs with UUID bounds: %s',
        async (slug) => {
            await expect(fetchPetBySlug(supabase, slug)).resolves.toEqual(pet);
            const url = new URL(String(fetchMock.mock.calls[0][0]));
            expect(url.pathname).toBe('/rest/v1/pet_listings');
            expect(url.searchParams.getAll('id')).toEqual([
                'gte.c866752a-0000-0000-0000-000000000000',
                'lte.c866752a-ffff-ffff-ffff-ffffffffffff',
            ]);
            expect(url.searchParams.get('limit')).toBe('2');
            expect(url.searchParams.get('select')).toBe('*');
        },
    );

    it('resolves existing full-UUID URLs with an exact comparison', async () => {
        await expect(fetchPetBySlug(supabase, id.toUpperCase())).resolves.toEqual(pet);
        const url = new URL(String(fetchMock.mock.calls[0][0]));
        expect(url.searchParams.getAll('id')).toEqual([`eq.${id}`]);
    });

    it.each(['', 'santra', 'pet-not-hex', 'c866752', 'c866752aa', 'pet-c866752a%'])(
        'rejects malformed identifiers without a database request: %s',
        async (slug) => {
            await expect(fetchPetBySlug(supabase, slug)).resolves.toBeNull();
            expect(fetchMock).not.toHaveBeenCalled();
        },
    );

    it('returns null only when the query succeeds without a matching pet', async () => {
        fetchMock.mockResolvedValue(new Response('[]', { status: 200 }));
        await expect(fetchPetBySlug(supabase, 'santra-c866752a')).resolves.toBeNull();
    });

    it('does not disguise a database failure as a missing pet', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({
            code: '42883',
            message: 'operator does not exist: uuid ~~* unknown',
        }), { status: 404 }));

        await expect(fetchPetBySlug(supabase, 'santra-c866752a')).rejects.toMatchObject({
            message: 'Unable to load pet details. Please try again.',
            cause: { code: '42883' },
        });
    });

    it('does not silently choose a pet when short IDs collide', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify([
            pet,
            { ...pet, id: 'c866752a-0000-4000-8000-000000000002' },
        ]), { status: 200 }));

        await expect(fetchPetBySlug(supabase, 'santra-c866752a')).rejects.toThrow('Unable to load pet details');
    });
});
