import React from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart, Search } from 'lucide-react';

const PlayfulHeroSection = ({ petCount }: { petCount: number }) => {
    return (
        <section className="relative overflow-hidden pt-16 pb-16 min-h-[90vh] flex items-center bg-playful-cream">
            {/* Static Background Elements — no animation to prevent CLS */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-playful-yellow/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-playful-coral/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-playful-teal/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-20 container mx-auto px-4 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                    {/* Content Column — NO ScrollReveal, content visible immediately */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-gray-100 mx-auto lg:mx-0">
                            <span className="flex h-2 w-2 rounded-full bg-playful-coral animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-600">Over <span className="text-playful-coral">{petCount}+</span> pets waiting for a home</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-playful-text mb-6 leading-tight tracking-tight">
                            Make a Friend <br />
                            <span className="relative inline-block mt-2 transform -rotate-2">
                                <span className="absolute inset-0 bg-playful-yellow rounded-[2rem] transform rotate-2 shadow-lg"></span>
                                <span className="relative text-playful-text px-6 py-2">For Life</span>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Don't buy a friend, adopt one. Connect with thousands of vaccinated, loving pets waiting to complete your family.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
                            <PrimaryButton size="lg" className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300">
                                <Search className="mr-2 h-5 w-5" />
                                Find a Pet Now
                            </PrimaryButton>
                            <PrimaryButton variant="outline" size="lg" className="w-full sm:w-auto border-2 hover:bg-white/50">
                                <Heart className="mr-2 h-5 w-5 text-playful-coral" />
                                Success Stories
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Image Column — NO ScrollReveal, visible immediately for LCP */}
                    <div className="relative hidden lg:block">
                        <div className="relative z-10 blob-shape overflow-hidden border-8 border-white shadow-2xl bg-playful-coral/10 aspect-square max-w-lg mx-auto transform hover:rotate-1 transition-transform duration-500">
                            <img
                                src="/images/hero-dogs.webp"
                                alt="Happy rescue dog and cat together"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                                loading="eager"
                                fetchPriority="high"
                                width={640}
                                height={640}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PlayfulHeroSection;
