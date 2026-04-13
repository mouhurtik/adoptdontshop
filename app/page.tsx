import { Suspense } from 'react';
import CommunityFeed from '@/views/CommunityFeed';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
    description: 'Join the AdoptDontShop community. Share stories, discuss pet care, browse rescue animals for adoption, and connect with fellow animal lovers in India.',
    keywords: ['adopt pet', 'rescue animals', 'pet community', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt dont shop'],
};

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-playful-cream" />}>
            <CommunityFeed variant="home" />
        </Suspense>
    );
}
