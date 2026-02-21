import BrowsePets from '@/views/BrowsePets';
import type { Metadata } from 'next';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'Browse Pets for Adoption | AdoptDontShop',
    description: 'Browse dogs, cats, and other rescue animals available for adoption near you. Filter by breed, age, location, and more.',
    keywords: ['adopt pet near me', 'adopt dog', 'adopt cat', 'rescue animals', 'pet adoption Kolkata', 'adopt pet near Kolkata'],
};

export default function BrowsePage() {
    return <BrowsePets />;
}
