'use client';

import { Suspense } from 'react';
import AboutUs from '@/views/AboutUs';

export default function AboutPage() {
    return (
        <Suspense>
            <AboutUs />
        </Suspense>
    );
}
