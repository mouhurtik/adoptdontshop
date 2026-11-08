import { Suspense } from 'react';
import AboutUs from '@/views/AboutUs';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'About the community',
    description: 'Learn about our mission to connect stray and rescue animals with loving families. Meet the team behind AdoptDontShop.',
    alternates: { canonical: '/about' },
};

export default function AboutPage() {
    return (
        <Suspense>
            <AboutUs />
        </Suspense>
    );
}
