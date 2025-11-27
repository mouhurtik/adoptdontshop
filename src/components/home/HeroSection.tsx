import React from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart, Search, PawPrint } from 'lucide-react';

interface PlayfulHeroSectionProps {
    petCount: number;
}

const PlayfulHeroSection = ({ petCount }: PlayfulHeroSectionProps) => {
    return (
        <section className="relative overflow-hidden bg-playful-cream pt-20 pb-32">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-playful-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-playful-mint rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-block mb-4 px-4 py-1 bg-playful-yellow/30 text-yellow-800 rounded-full font-bold text-sm tracking-wide border border-playful-yellow">
                            <span className="mr-2">🎉</span> Over {petCount} pets waiting for you!
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold text-playful-text leading-tight mb-6">
                            Find Your New <br />
                            <span className="text-playful-coral relative inline-block">
                                Best Friend
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-playful-teal opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium max-w-lg mx-auto lg:mx-0">
                            Open your heart and home to a rescue pet. They are waiting to fill your life with unconditional love and joy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <PrimaryButton size="lg" className="group w-full sm:w-auto justify-center">
                                <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Find a Pet
                            </PrimaryButton>
                            <PrimaryButton variant="outline" size="lg" className="group w-full sm:w-auto justify-center">
                                <Heart className="mr-2 h-5 w-5 text-playful-coral group-hover:fill-current transition-colors" />
                                Success Stories
                            </PrimaryButton>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-gray-500 font-bold">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <PawPrint className="h-5 w-5 text-playful-teal" />
                                </div>
                                <span className="text-sm md:text-base">Vaccinated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <Heart className="h-5 w-5 text-playful-coral" />
                                </div>
                                <span className="text-sm md:text-base">Loved</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <span className="text-xl">🏠</span>
                                </div>
                                <span className="text-sm md:text-base">Ready for Home</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 blob-shape overflow-hidden border-8 border-white shadow-2xl bg-playful-coral/10 aspect-square max-w-md mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Happy Dog"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-0 lg:top-10 left-0 lg:-left-10 bg-white p-3 md:p-4 rounded-2xl shadow-xl z-20 border-b-4 border-playful-teal"
                        >
                            <span className="text-2xl md:text-3xl">🐶</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
                            className="absolute bottom-0 lg:bottom-10 right-0 lg:-right-5 bg-white p-3 md:p-4 rounded-2xl shadow-xl z-20 border-b-4 border-playful-coral"
                        >
                            <span className="text-2xl md:text-3xl">🐱</span>
                        </motion.div>
                    </motion.div>

                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
        </section>
    );
};

export default PlayfulHeroSection;



