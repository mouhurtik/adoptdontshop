import Home from '@/views/Home';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
    description: 'Give a rescue pet a forever home. Browse dogs, cats, and other animals available for adoption in India. Join our community of animal lovers!',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me', 'adopt dont shop'],
};

export default async function HomePage() {
    // Server-side fetch — eliminates client-side waterfall for mobile LCP
    let initialPets: Array<Record<string, unknown>> = [];
    try {
        const supabase = await createServerSupabaseClient();
        const { data } = await supabase
            .from('pet_listings')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(4);
        if (data) initialPets = data;
    } catch {
        // Fallback: FeaturedPets will client-fetch if this fails
    }

    return <Home initialPets={initialPets} />;
}
