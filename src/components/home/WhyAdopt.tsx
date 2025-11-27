import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, ShieldCheck } from 'lucide-react';

const PlayfulWhyAdopt = () => {
    const reasons = [
        {
            icon: <Heart className="w-8 h-8 text-white" />,
            title: "Save a Life",
            description: "When you adopt, you're not just getting a friend, you're saving a life and making space for another animal in need.",
            color: "bg-playful-coral",
            delay: 0
        },
        {
            icon: <Home className="w-8 h-8 text-white" />,
            title: "Unconditional Love",
            description: "Shelter pets are known for their loyalty and affection. They know you saved them and will love you forever.",
            color: "bg-playful-teal",
            delay: 0.2
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-white" />,
            title: "Healthy & Vaccinated",
            description: "Our pets are vaccinated, microchipped, and spayed/neutered before adoption. They are ready for a fresh start.",
            color: "bg-playful-yellow",
            delay: 0.4
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-playful-lavender rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-playful-mint rounded-full blur-xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-playful-text mb-6">
                        Why <span className="text-playful-teal">Adopt?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Adopting a pet is one of the most rewarding experiences. Here is why you should consider adoption.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: reason.delay, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-[2rem] shadow-soft border border-gray-100 hover:shadow-hover transition-all duration-300"
                        >
                            <div className={`w-16 h-16 ${reason.color} rounded-2xl flex items-center justify-center mb-6 shadow-md rotate-3 group-hover:rotate-6 transition-transform`}>
                                {reason.icon}
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-playful-text mb-4">
                                {reason.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {reason.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlayfulWhyAdopt;



