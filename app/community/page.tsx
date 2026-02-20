'use client';

import CommunityFeed from '@/views/CommunityFeed';
import { Suspense } from 'react';

export default function CommunityPage() {
    return (
        <Suspense fallback={<div className="pt-32 min-h-screen bg-playful-cream" />}>
            <CommunityFeed />
        </Suspense>
    );
}
