'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PetCard from '@/components/PetCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Pet {
    id: string | number;
    pet_name: string;
    image_url: string | null;
    breed: string;
    location: string;
    status: string;
    animal_type?: string | null;
    age: number | string | null;
}

const PlayfulFeaturedPets = () => {
    const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLatestPets();
    }, []);

    const fetchLatestPets = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('pet_listings')
                .select('*')
                .eq('status', 'available')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) {
                console.error('Error fetching pet listings:', error);
                return;
            }

            if (data) {
                setFeaturedPets(data);
            }
        } catch (error) {
            console.error('Failed to fetch pet listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-playful-coral border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="py-20 bg-playful-cream">
            <div className="container mx-auto px-4">
                <ScrollReveal
                    mode="fade-up"
                    width="100%"
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 bg-playful-mint/30 text-teal-800 rounded-full font-bold text-sm tracking-wide mb-4">
                        Meet Our Stars
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-playful-text mb-6">
                        Featured <span className="text-playful-coral">Friends</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        These adorable pets are looking for their forever homes. Could you be the one they've been waiting for?
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {featuredPets.map((pet, index) => (
                        <ScrollReveal
                            key={pet.id}
                            mode="fade-up"
                            delay={index * 0.1}
                            width="100%"
                            className="h-full"
                        >
                            <PetCard
                                id={String(pet.id)}
                                name={pet.pet_name}
                                breed={pet.breed}
                                age={typeof pet.age === 'number' ? pet.age : parseInt(pet.age as string) || 2}
                                location={pet.location}
                                image={pet.image_url || "/placeholder.svg"}
                                type={pet.animal_type || 'dog'}
                            />
                        </ScrollReveal>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/browse">
                        <PrimaryButton size="lg" className="group">
                            View All Pets
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </PrimaryButton>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PlayfulFeaturedPets;
