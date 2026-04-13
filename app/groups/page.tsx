import { Suspense } from 'react';
import GroupsPage from '@/views/GroupsPage';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Groups | AdoptDontShop',
    description: 'Join communities of pet lovers. Find groups by city, breed, adoption topics and more.',
    keywords: ['pet groups', 'pet communities', 'animal lovers groups', 'adopt dont shop'],
};

export default function GroupsRoutePage() {
    return (
        <Suspense fallback={<div className="pt-32 min-h-screen bg-playful-cream" />}>
            <GroupsPage />
        </Suspense>
    );
}
