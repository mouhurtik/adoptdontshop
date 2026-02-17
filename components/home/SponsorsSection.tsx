import React from 'react';
import { motion } from 'framer-motion';

const PlayfulSponsorsSection = () => {
    const sponsors = [
        "Paws & Claws", "Happy Tails", "PetSmart", "Chewy", "Royal Canin", "Purina"
    ];

    return (
        <section className="py-16 bg-playful-lavender/30">
            <div className="container mx-auto px-4 text-center">
                <p className="text-playful-text font-bold mb-8 uppercase tracking-widest text-sm opacity-70">
                    Trusted by our partners
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1, rotate: Math.random() * 4 - 2 }}
                            className="text-2xl font-heading font-bold text-playful-text/50 hover:text-playful-coral cursor-pointer"
                        >
                            {sponsor}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlayfulSponsorsSection;



