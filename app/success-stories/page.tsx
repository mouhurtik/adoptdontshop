import SuccessStories from '@/views/SuccessStories';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Adoption Success Stories | AdoptDontShop',
    description: 'Read heartwarming stories of pets who found their forever homes through AdoptDontShop.',
};

export default function SuccessStoriesPage() {
    return <SuccessStories />;
}
