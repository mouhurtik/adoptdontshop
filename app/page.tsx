import Home from '@/views/Home';
import type { Metadata } from 'next';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'AdoptDontShop — Largest Pet Adoption Community',
    description: 'India\'s largest pet adoption community. Browse rescue dogs, cats, and other animals near you. Join our community of animal lovers and find your perfect companion.',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me', 'adopt dont shop'],
};

export default function HomePage() {
    return <Home />;
}
