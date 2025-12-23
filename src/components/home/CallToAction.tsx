import React from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Heart } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const PlayfulCallToAction = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-playful-teal/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-playful-yellow/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <ScrollReveal
                    mode="pop"
                    width="100%"
                    className="flex flex-col items-center"
                >
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-playful-text mb-6">
                        Ready to meet your new <span className="text-playful-teal">best friend?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Thousands of pets are waiting for a loving home. Start your journey today and make a difference.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton size="lg" className="shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                            Adopt Now
                        </PrimaryButton>
                        <PrimaryButton size="lg" variant="outline" className="border-playful-teal text-playful-teal hover:bg-playful-teal/10">
                            <Heart className="mr-2 h-5 w-5" />
                            Donate to Shelter
                        </PrimaryButton>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default PlayfulCallToAction;
