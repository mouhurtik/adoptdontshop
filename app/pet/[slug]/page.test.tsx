import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Pet } from '@/types/pet.types';

const mocks = vi.hoisted(() => ({
    fetchPet: vi.fn(),
    transform: vi.fn(),
    notFound: vi.fn(() => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); }),
}));

vi.mock('@/lib/supabase/server-queries', () => ({
    fetchPetBySlugServer: mocks.fetchPet,
    serverPetToPet: mocks.transform,
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/views/PetDetails', () => ({ default: () => null }));

import PetDetailPage, { generateMetadata } from './page';

const pet = {
    id: 'c866752a-0000-4000-8000-000000000001',
    pet_name: 'Santra',
    slug: 'santra-c866752a',
    animal_type: 'Cat',
    breed: 'Indie',
    location: 'Mumbai',
    description: 'A rescue cat looking for a home.',
    image_url: 'https://example.com/santra.webp',
};

beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchPet.mockResolvedValue(pet);
    mocks.transform.mockReturnValue({ ...pet, name: pet.pet_name });
});

describe('pet detail route', () => {
    it('seeds the client view with the resolved pet', async () => {
        const page = await PetDetailPage({ params: Promise.resolve({ slug: pet.slug }) });
        expect(mocks.fetchPet).toHaveBeenCalledWith(pet.slug);
        expect(mocks.transform).toHaveBeenCalledWith(pet);
        expect((page as ReactElement<{ initialPet: Pet }>).props.initialPet.name).toBe('Santra');
    });

    it('uses the resolved pet URL for metadata, including legacy aliases', async () => {
        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'old-name--c866752a' }) });
        expect(metadata.title).toContain('Adopt Santra');
        expect(metadata.alternates?.canonical).toBe('/pet/santra-c866752a');
        expect(metadata.description).toBe(pet.description);
    });

    it.each([PetDetailPage, generateMetadata])('signals not found for a missing record', async (render) => {
        mocks.fetchPet.mockResolvedValue(null);
        await expect(render({ params: Promise.resolve({ slug: 'missing-00000000' }) })).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
        expect(mocks.notFound).toHaveBeenCalledOnce();
    });

    it.each([PetDetailPage, generateMetadata])('preserves database errors instead of signaling not found', async (render) => {
        const error = new Error('Unable to load pet details');
        mocks.fetchPet.mockRejectedValue(error);
        await expect(render({ params: Promise.resolve({ slug: pet.slug }) })).rejects.toBe(error);
        expect(mocks.notFound).not.toHaveBeenCalled();
    });
});
