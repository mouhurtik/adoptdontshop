import BrowsePets from '@/views/BrowsePets';
import { fetchPetListingsServer } from '@/lib/supabase/server-queries';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Adopt Dogs & Cats in India — Browse Rescue Pets | AdoptDontShop',
    description: 'Browse rescue dogs, cats, and other animals available for free adoption across India. Filter by breed, age, and city — Mumbai, Delhi, Kolkata, Bangalore, Pune & more.',
    keywords: [
        'adopt pet near me', 'adopt dog India', 'adopt cat India',
        'rescue animals India', 'free pet adoption',
        'adopt dog Mumbai', 'adopt dog Delhi', 'adopt cat Kolkata',
        'adopt dog Bangalore', 'adopt cat Pune', 'adopt dog Hyderabad',
        'adopt cat Chennai', 'adopt dog Ahmedabad', 'adopt cat Jaipur',
        'adopt dog Lucknow', 'indie dog adoption', 'stray dog adoption',
        'puppy adoption near me', 'kitten adoption India',
    ],
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
