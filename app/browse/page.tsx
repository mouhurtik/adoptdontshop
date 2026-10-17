import BrowsePets from '@/views/BrowsePets';
import { fetchPetListingsPageServer, serverPetToPet } from '@/lib/supabase/server-queries';
import { BROWSE_PAGE_SIZE } from '@/lib/browse-pagination';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Adopt Dogs & Cats in India — Browse Rescue Pets',
    description: 'Browse rescue dogs, cats, and other animals available for free adoption across India. Filter by breed, age, and city — Mumbai, Delhi, Kolkata, Bangalore, Pune & more.',
    alternates: {
        canonical: '/browse',
    },
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
    const { pets: serverPets, total } = await fetchPetListingsPageServer(1, BROWSE_PAGE_SIZE);
    const initialPets = serverPets.map(serverPetToPet);

    return <BrowsePets initialPets={initialPets} initialPage={1} initialTotalPets={total} />;
}
