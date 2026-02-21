import Home from '@/views/Home';
import type { Metadata } from 'next';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'AdoptDontShop — Find Your Perfect Pet',
    description: 'Adopt rescue dogs, cats, and other animals near you. Browse available pets, read success stories, and join our community of animal lovers.',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me'],
};

export default function HomePage() {
    return <Home />;
}
