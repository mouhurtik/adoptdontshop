import React from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart, Search, PawPrint } from 'lucide-react';

interface PlayfulHeroSectionProps {
    petCount: number;
}

const PlayfulHeroSection = ({ petCount }: PlayfulHeroSectionProps) => {
    return (
        <section className="relative overflow-hidden bg-playful-cream pt-32 pb-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-playful-yellow/20 rounded-full blur-3xl opacity-50 animate-float" />
                <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-playful-coral/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-playful-teal/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
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


                    </motion.div>

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 blob-shape overflow-hidden border-8 border-white shadow-2xl bg-playful-coral/10 aspect-square max-w-lg mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Happy Dog Running"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>


                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default PlayfulHeroSection;



