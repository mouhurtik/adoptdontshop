import type { Metadata } from 'next';
import Store from '@/views/Store';

export const metadata: Metadata = {
    title: 'Pet essentials store',
    description: 'Plan everyday essentials for dogs and cats. Product links are being updated; store visits and purchases do not earn PawCoins.',
    alternates: { canonical: '/store' },
};

export default function StorePage() { return <Store />; }
