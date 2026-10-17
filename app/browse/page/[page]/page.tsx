import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrowsePets from '@/views/BrowsePets';
import {
    fetchPetListingsPageServer,
    serverPetToPet,
} from '@/lib/supabase/server-queries';
import {
    BROWSE_PAGE_SIZE,
    getBrowsePageHref,
    parseBrowsePage,
} from '@/lib/browse-pagination';

export const revalidate = 3600;

type Props = {
    params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page: pageSegment } = await params;
    const page = parseBrowsePage(pageSegment);

    if (page === null || page === 1) notFound();

    return {
        title: `Browse Rescue Pets — Page ${page}`,
        description: `Browse page ${page} of rescue dogs, cats, and other animals available for free adoption across India.`,
        alternates: {
            canonical: getBrowsePageHref(page),
        },
    };
}

export default async function BrowsePageRoute({ params }: Props) {
    const { page: pageSegment } = await params;
    const page = parseBrowsePage(pageSegment);

    if (page === null || page === 1) notFound();

    const { pets: serverPets, total } = await fetchPetListingsPageServer(page, BROWSE_PAGE_SIZE);
    const totalPages = Math.ceil(total / BROWSE_PAGE_SIZE);

    if (page > totalPages) notFound();

    return (
        <BrowsePets
            initialPets={serverPets.map(serverPetToPet)}
            initialPage={page}
            initialTotalPets={total}
        />
    );
}
