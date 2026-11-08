import type { Metadata } from 'next';
import Store from '@/views/Store';

export const metadata: Metadata = {
    title: 'Pet essentials store',
    description: 'Browse cat and dog food, familiar brands, toys and care essentials through AdoptDontShop’s Amazon affiliate collections.',
    alternates: { canonical: '/store' },
};

export default function StorePage() { return <Store />; }
