import Home from '@/views/Home';
import type { Metadata } from 'next';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
    description: 'Give a rescue pet a forever home. Browse dogs, cats, and other animals available for adoption in India. Join our community of animal lovers!',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me', 'adopt dont shop'],
};

export default function HomePage() {
    return <Home />;
}
