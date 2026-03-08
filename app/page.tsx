import HomeClient from '@/views/Home';
import HeroSection from '@/components/home/HeroSection';
import WhyAdopt from '@/components/home/WhyAdopt';
import SponsorsSection from '@/components/home/SponsorsSection';
import CallToAction from '@/components/home/CallToAction';
import OurStoryWidget from '@/components/home/OurStoryWidget';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 3600; // Rebuild every hour

export const metadata: Metadata = {
    title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
    description: 'Give a rescue pet a forever home. Browse dogs, cats, and other animals available for adoption in India. Join our community of animal lovers!',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me', 'adopt dont shop'],
};

export default async function HomePage() {
    // Server-side fetch with 5s timeout — prevents SEOptimer/crawler timeouts
    let initialPets: Array<Record<string, unknown>> = [];
    let petCount = 0;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const supabase = await createServerSupabaseClient();
        const [petsResult, countResult] = await Promise.all([
            supabase
                .from('pet_listings')
                .select('*')
                .eq('status', 'available')
                .order('created_at', { ascending: false })
                .limit(4)
                .abortSignal(controller.signal),
            supabase
                .from('pet_listings')
                .select('*', { count: 'exact', head: true })
                .abortSignal(controller.signal),
        ]);
        clearTimeout(timeout);
        if (petsResult.data) initialPets = petsResult.data;
        if (countResult.count) petCount = countResult.count;
    } catch {
        // Fallback: FeaturedPets will client-fetch if this fails
    }

    return (
        <div className="overflow-hidden bg-playful-cream min-h-screen">
            {/* Server Components — content in initial HTML, visible to crawlers at full opacity */}
            <HeroSection petCount={petCount} />
            {/* Client-side interactive sections (search + featured pets) */}
            <HomeClient initialPets={initialPets} petCount={petCount} />
            {/* Server-rendered below-fold sections — no ScrollReveal = no opacity:0 in HTML */}
            <WhyAdopt />
            <SponsorsSection />
            <CallToAction />
            <OurStoryWidget />
        </div>
    );
}
