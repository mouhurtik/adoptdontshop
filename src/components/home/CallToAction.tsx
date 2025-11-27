import React from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart } from 'lucide-react';

const PlayfulCallToAction = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-playful-teal"></div>

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-playful-yellow opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                        Ready to meet your new best friend?
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium">
                        Thousands of pets are waiting for a loving home. Start your journey today and make a difference.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton size="lg" className="bg-white text-playful-teal hover:bg-gray-100 border-b-4 border-gray-200">
                            Adopt Now
                        </PrimaryButton>
                        <PrimaryButton size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                            <Heart className="mr-2 h-5 w-5" />
                            Donate to Shelter
                        </PrimaryButton>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlayfulCallToAction;



