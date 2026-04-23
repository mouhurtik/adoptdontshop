import BrowsePets from '@/views/BrowsePets';
import { fetchPetListingsServer } from '@/lib/supabase/server-queries';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Browse Pets for Adoption | AdoptDontShop',
    description: 'Browse dogs, cats, and other rescue animals available for adoption near you. Filter by breed, age, location, and more.',
    keywords: ['adopt pet near me', 'adopt dog', 'adopt cat', 'rescue animals', 'pet adoption Kolkata', 'adopt pet near Kolkata'],
};

export default async function BrowsePage() {
    const serverPets = await fetchPetListingsServer(100);
    const initialPets = serverPets.map((p) => ({
        ...p,
        name: p.pet_name,
        type: p.animal_type ?? undefined,
        age: p.age || 'Unknown',
        urgent: p.status === 'urgent',
        image: p.image_url ?? undefined,
    })) as unknown as import('@/types/pet.types').Pet[];

    return <BrowsePets initialPets={initialPets} />;
}
