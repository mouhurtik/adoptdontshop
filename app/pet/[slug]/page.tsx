import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { fetchPetBySlugServer } from '@/lib/supabase/server-queries';
import PetDetails from '@/views/PetDetails';

export const revalidate = 3600;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const idPrefix = slug.split('-').pop() || '';

    try {
        const supabase = await createServerSupabaseClient();
        const { data: pet } = await supabase
            .from('pet_listings')
            .select('pet_name, breed, location, animal_type, description, image_url, id')
            .ilike('id', `${idPrefix}%`)
            .limit(1)
            .maybeSingle();

        if (pet) {
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
                    canonical: `/pet/${slug}`,
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
    } catch {
        // Fallback metadata if fetch fails
    }

    return {
        title: 'Pet Details',
        description: 'View pet details and adopt your new best friend.',
    };
}


export default async function PetDetailPage({ params }: Props) {
    const { slug } = await params;
    const serverPet = await fetchPetBySlugServer(slug);

    const initialPet = serverPet
        ? ({
              ...serverPet,
              name: serverPet.pet_name,
              type: serverPet.animal_type ?? undefined,
              age: serverPet.age || 'Unknown',
              urgent: serverPet.status === 'urgent',
              image: serverPet.image_url ?? undefined,
          } as unknown as import('@/types/pet.types').Pet)
        : null;

    return <PetDetails initialPet={initialPet} />;
}
