import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import PetDetails from '@/views/PetDetails';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Extract the ID prefix from slug (e.g., "buddy-abc123" -> "abc123")
    const idPrefix = slug.split('-').pop() || '';

    try {
        const supabase = await createServerSupabaseClient();
        const { data: pet } = await supabase
            .from('pet_listings')
            .select('pet_name, breed, location, animal_type, description, image_url')
            .ilike('id', `${idPrefix}%`)
            .single();

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

export default function PetDetailPage() {
    return <PetDetails />;
}
