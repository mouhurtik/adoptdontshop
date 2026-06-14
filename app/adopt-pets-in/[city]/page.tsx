import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// City config — slug, display name, and location patterns to match in DB
const CITIES: Record<string, { name: string; state: string; patterns: string[] }> = {
    kolkata: { name: 'Kolkata', state: 'West Bengal', patterns: ['kolkata', 'calcutta', 'west bengal', 'howrah', 'salt lake'] },
    mumbai: { name: 'Mumbai', state: 'Maharashtra', patterns: ['mumbai', 'bombay', 'thane', 'navi mumbai'] },
    delhi: { name: 'Delhi', state: 'Delhi NCR', patterns: ['delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'] },
    bangalore: { name: 'Bangalore', state: 'Karnataka', patterns: ['bangalore', 'bengaluru', 'karnataka'] },
    pune: { name: 'Pune', state: 'Maharashtra', patterns: ['pune', 'pimpri', 'chinchwad'] },
    hyderabad: { name: 'Hyderabad', state: 'Telangana', patterns: ['hyderabad', 'secunderabad', 'telangana'] },
    chennai: { name: 'Chennai', state: 'Tamil Nadu', patterns: ['chennai', 'madras', 'tamil nadu'] },
    ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', patterns: ['ahmedabad', 'gandhinagar', 'gujarat'] },
    jaipur: { name: 'Jaipur', state: 'Rajasthan', patterns: ['jaipur', 'rajasthan'] },
    lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', patterns: ['lucknow', 'uttar pradesh', 'kanpur'] },
};

export function generateStaticParams() {
    return Object.keys(CITIES).map((city) => ({ city }));
}

type Props = {
    params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    const cityInfo = CITIES[city];
    if (!cityInfo) return { title: 'City Not Found' };

    return {
        title: `Adopt Dogs & Cats in ${cityInfo.name} — Free Pet Adoption | AdoptDontShop`,
        description: `Find rescue dogs, cats, and pets available for free adoption in ${cityInfo.name}, ${cityInfo.state}. Browse ${cityInfo.name} shelter animals, indie dogs, and kittens looking for forever homes.`,
        keywords: [
            `adopt dog ${cityInfo.name}`, `adopt cat ${cityInfo.name}`,
            `pet adoption ${cityInfo.name}`, `animal shelter ${cityInfo.name}`,
            `rescue dogs ${cityInfo.name}`, `free pet adoption ${cityInfo.name}`,
            `indie dog adoption ${cityInfo.name}`, `stray dog adoption ${cityInfo.state}`,
            `adopt pet near me`, `adopt dont shop`,
        ],
        alternates: {
            canonical: `/adopt-pets-in/${city}`,
        },
        openGraph: {
            title: `Adopt Dogs & Cats in ${cityInfo.name} | AdoptDontShop`,
            description: `Free pet adoption in ${cityInfo.name}. Browse rescue dogs, cats & more.`,
            type: 'website',
            url: `https://adoptdontshop.xyz/adopt-pets-in/${city}`,
        },
    };
}

export default async function CityAdoptionPage({ params }: Props) {
    const { city } = await params;
    const cityInfo = CITIES[city];
    if (!cityInfo) notFound();

    const supabase = await createServerSupabaseClient();

    // Match pets whose location contains any of the city's patterns (case-insensitive)
    const { data: allPets } = await supabase
        .from('pet_listings')
        .select('id, pet_name, breed, age, location, image_url, animal_type, status, slug')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    const pets = (allPets || []).filter((pet) =>
        cityInfo.patterns.some((pattern) =>
            pet.location?.toLowerCase().includes(pattern)
        )
    );

    // JSON-LD for local SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Pets for Adoption in ${cityInfo.name}`,
        description: `Rescue dogs and cats available for free adoption in ${cityInfo.name}, ${cityInfo.state}`,
        url: `https://adoptdontshop.xyz/adopt-pets-in/${city}`,
        numberOfItems: pets.length,
        itemListElement: pets.slice(0, 10).map((pet, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: `Adopt ${pet.pet_name}`,
                description: `${pet.breed || pet.animal_type || 'Rescue pet'} available for adoption in ${pet.location}`,
                image: pet.image_url || undefined,
                url: `https://adoptdontshop.xyz/pet/${pet.slug || pet.pet_name?.toLowerCase().replace(/\s+/g, '-') + '-' + pet.id.slice(0, 8)}`,
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                },
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-playful-cream">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-playful-text mb-4">
                            Adopt a Pet in {cityInfo.name}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Find rescue dogs, cats, and other animals looking for forever homes in{' '}
                            {cityInfo.name}, {cityInfo.state}. All adoptions are completely free.
                        </p>
                    </div>

                    {/* Pet grid */}
                    {pets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {pets.map((pet) => {
                                const petSlug = pet.slug || `${pet.pet_name?.toLowerCase().replace(/\s+/g, '-')}-${pet.id.slice(0, 8)}`;
                                return (
                                    <Link
                                        key={pet.id}
                                        href={`/pet/${petSlug}`}
                                        className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {pet.image_url ? (
                                            <div className="aspect-square overflow-hidden">
                                                <img
                                                    src={pet.image_url}
                                                    alt={`Adopt ${pet.pet_name} in ${cityInfo.name}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-gradient-to-br from-playful-coral/10 to-playful-teal/10 flex items-center justify-center">
                                                <span className="text-6xl">🐾</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h2 className="font-bold text-lg text-playful-text group-hover:text-playful-coral transition-colors">
                                                {pet.pet_name}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {pet.breed || pet.animal_type || 'Rescue Pet'} · {pet.age || 'Unknown age'}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                📍 {pet.location}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl shadow-soft mb-12">
                            <span className="text-6xl block mb-4">🐾</span>
                            <h2 className="text-2xl font-heading font-bold text-playful-text mb-3">
                                No pets listed in {cityInfo.name} yet
                            </h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Be the first to list a rescue pet in {cityInfo.name}! Help local animals find loving homes.
                            </p>
                            <Link
                                href="/list-pet"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-playful-coral text-white font-bold rounded-full hover:bg-coral-600 transition-colors"
                            >
                                List a Pet for Adoption
                            </Link>
                        </div>
                    )}

                    {/* SEO content block */}
                    <section className="bg-white rounded-3xl p-8 shadow-soft mb-8">
                        <h2 className="text-2xl font-heading font-bold text-playful-text mb-4">
                            Pet Adoption in {cityInfo.name}
                        </h2>
                        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                            <p>
                                Looking to adopt a dog or cat in {cityInfo.name}? AdoptDontShop connects rescue animals
                                with loving families across {cityInfo.state}. Whether you&apos;re looking for an Indie dog,
                                a kitten, or a specific breed, our platform makes it easy to find your perfect companion.
                            </p>
                            <p>
                                All pet adoptions on AdoptDontShop are completely free. We believe every rescue animal
                                deserves a forever home, and we&apos;re here to help make that happen in {cityInfo.name} and beyond.
                            </p>
                            <h3 className="text-lg font-bold text-playful-text">
                                Why Adopt in {cityInfo.name}?
                            </h3>
                            <ul>
                                <li>Save a life — thousands of stray and abandoned animals in {cityInfo.name} need homes</li>
                                <li>Indie dogs are incredibly loyal, healthy, and well-suited to Indian weather</li>
                                <li>Adoption is free and all pets come with vaccination records when available</li>
                                <li>Join {cityInfo.name}&apos;s growing community of responsible pet parents</li>
                            </ul>
                        </div>
                    </section>

                    {/* CTA — Browse all pets */}
                    <div className="text-center">
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-2 text-playful-coral font-bold hover:underline text-lg"
                        >
                            Browse all pets across India →
                        </Link>
                    </div>

                    {/* Other cities */}
                    <section className="mt-12">
                        <h2 className="text-xl font-heading font-bold text-playful-text mb-4 text-center">
                            Adopt Pets in Other Cities
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {Object.entries(CITIES)
                                .filter(([slug]) => slug !== city)
                                .map(([slug, info]) => (
                                    <Link
                                        key={slug}
                                        href={`/adopt-pets-in/${slug}`}
                                        className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-bold text-gray-600 hover:text-playful-coral hover:shadow-md transition-all"
                                    >
                                        {info.name}
                                    </Link>
                                ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
