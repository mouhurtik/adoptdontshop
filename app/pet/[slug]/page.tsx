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

    try {
        const supabase = await createServerSupabaseClient();
        const { data: pets } = await supabase
            .from('pet_listings')
            .select('pet_name, breed, location, animal_type, description, image_url, id');

        const idPrefix = slug.split('-').pop() || '';
        const pet = (pets ?? []).find((p) => p.id.startsWith(idPrefix));

        if (pet) {
            const title = `Adopt ${pet.pet_name} — ${pet.breed} in ${pet.location}`;
            const description =
                pet.description ||
                `Meet ${pet.pet_name}, a ${pet.breed} looking for a forever home in ${pet.location}. Adopt, don't shop!`;

            return {
                title,
                description,
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
