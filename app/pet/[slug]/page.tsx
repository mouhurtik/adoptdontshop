import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPetBySlugServer, serverPetToPet } from '@/lib/supabase/server-queries';
import PetDetails from '@/views/PetDetails';

export const revalidate = 3600;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pet = await fetchPetBySlugServer(slug);
    if (!pet) notFound();

    const title = `Adopt ${pet.pet_name} — ${pet.breed || pet.animal_type || 'Pet'} in ${pet.location || 'India'}`;
    const description =
        pet.description?.substring(0, 160) ||
        `Meet ${pet.pet_name}, a ${pet.breed || 'rescue pet'} looking for a forever home in ${pet.location || 'India'}. Adopt for free!`;

    return {
        title,
        description,
        keywords: [
            `adopt ${pet.animal_type || 'pet'} ${pet.location || 'India'}`,
            `${pet.breed || ''} adoption`,
            'free pet adoption India',
            'adopt dont shop',
        ],
        alternates: {
            canonical: `/pet/${pet.slug}`,
        },
        openGraph: {
            title,
            description,
            images: pet.image_url ? [pet.image_url] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: pet.image_url ? [pet.image_url] : [],
        },
        other: {
            'product:price:amount': '0',
            'product:price:currency': 'INR',
        },
    };
}


export default async function PetDetailPage({ params }: Props) {
    const { slug } = await params;
    const serverPet = await fetchPetBySlugServer(slug);
    if (!serverPet) notFound();

    return <PetDetails initialPet={serverPetToPet(serverPet)} />;
}
