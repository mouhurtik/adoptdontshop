import React from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart, Search } from 'lucide-react';
import ParallaxSection from '@/components/ui/ParallaxSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface PlayfulHeroSectionProps {
    petCount: number;
}

const PlayfulHeroSection = ({ petCount }: PlayfulHeroSectionProps) => {
    return (
        <ParallaxSection
            className="pt-32 pb-20 min-h-[90vh] flex items-center bg-playful-cream"
            bgClassName="bg-playful-cream"
            speed={0.2}
            overlayOpacity={0}
        >
            {/* Animated Background Elements (Custom CSS floats maintained but wrapped in parallax) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-playful-yellow/20 rounded-full blur-3xl opacity-50 animate-float" />
                <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-playful-coral/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-playful-teal/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Content Column */}
                <div className="text-center lg:text-left">
                    <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-gray-100 mx-auto lg:mx-0">
                            <span className="flex h-2 w-2 rounded-full bg-playful-coral animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-600">Over <span className="text-playful-coral">{petCount}+</span> pets waiting for a home</span>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal mode="fade-up" delay={0.2} width="100%">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-playful-text mb-6 leading-tight tracking-tight">
                            Make a Friend <br />
                            <span className="relative inline-block mt-2 transform -rotate-2">
                                <span className="absolute inset-0 bg-playful-yellow rounded-[2rem] transform rotate-2 shadow-lg"></span>
                                <span className="relative text-playful-text px-6 py-2">For Life</span>
                            </span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal mode="fade-up" delay={0.3} width="100%">
                        <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Don't buy a friend, adopt one. Connect with thousands of vaccinated, loving pets waiting to complete your family.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal mode="fade-up" delay={0.4} width="100%">
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
                    </ScrollReveal>
                </div>

                {/* Image Column */}
                <div className="relative hidden lg:block">
                    <ScrollReveal mode="pop" delay={0.4} duration={0.8}>
                        <div className="relative z-10 blob-shape overflow-hidden border-8 border-white shadow-2xl bg-playful-coral/10 aspect-square max-w-lg mx-auto transform hover:rotate-1 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Happy Dog Running"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                    </ScrollReveal>
                </div>

            </div>
        </ParallaxSection>
    );
};

export default PlayfulHeroSection;



