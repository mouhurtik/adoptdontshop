import { Suspense } from 'react';
import CommunityFeed from '@/views/CommunityFeed';
import type { Metadata } from 'next';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'Community Blog | AdoptDontShop',
    description: 'Read blog posts, adoption tips, pet care guides, and heartwarming stories from the AdoptDontShop community.',
    keywords: ['pet adoption blog', 'pet care tips', 'animal rescue stories', 'adopt dont shop'],
};

export default function CommunityPage() {
    return (
        <Suspense fallback={<div className="pt-32 min-h-screen bg-playful-cream" />}>
            <CommunityFeed />
        </Suspense>
    );
}
