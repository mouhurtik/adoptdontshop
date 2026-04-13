import HomeClient from '@/views/Home';
import HeroSection from '@/components/home/HeroSection';
import WhyAdopt from '@/components/home/WhyAdopt';
import SponsorsSection from '@/components/home/SponsorsSection';
import CallToAction from '@/components/home/CallToAction';
import OurStoryWidget from '@/components/home/OurStoryWidget';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Welcome to AdoptDontShop | Rescue Pet Adoption & Care Community',
    description: 'Give a rescue pet a forever home. Browse dogs, cats, and other animals available for adoption in India. Join our community of animal lovers!',
    keywords: ['adopt pet', 'rescue animals', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt pet near me', 'adopt dont shop'],
};

export default function WelcomePage() {
    const initialPets: Array<Record<string, unknown>> = [];
    const petCount = 0;

    return (
        <div className="overflow-hidden bg-playful-cream min-h-screen">
            <HeroSection petCount={petCount} />
            <HomeClient initialPets={initialPets} petCount={petCount} />
            <WhyAdopt />
            <ScrollReveal width="100%" mode="fade-in">
                <SponsorsSection />
            </ScrollReveal>
            <CallToAction />
            <OurStoryWidget />
        </div>
    );
}
