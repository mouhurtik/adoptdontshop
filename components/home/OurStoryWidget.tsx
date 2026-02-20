import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const OurStoryWidget = () => {
    return (
        <section className="py-16 bg-playful-cream">
            <div className="container mx-auto px-6">
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-10 shadow-soft border-2 border-playful-yellow/30 flex flex-col md:flex-row items-center gap-8">
                        {/* Founder Photo */}
                        <div className="shrink-0">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-4 border-playful-yellow/30">
                                <img
                                    src="https://lh3.googleusercontent.com/pw/AP1GczPP3ut83cBmFXmNL9D5I76DmwBvAYi8spjCclhrpwDDXXK51LZ8qIgojWYJNXPqznl0Go7jeWg-5vDIu3rtfHgbKXRkMogYq9mOo4Dkoce3lGFJXpOlZIxXzfpdO1w4ETX6KlxqqFhFOmZmk66u6Cq-wA=w711-h949-s-no-gm"
                                    alt="Mouhurtik Ray — Founder"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                <Award className="h-5 w-5 text-playful-yellow" />
                                <span className="text-sm font-bold text-playful-yellow uppercase tracking-wider">Our Story</span>
                            </div>
                            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-4">
                                Founded in 2025 by Mouhurtik Ray, Adopt Don&apos;t Shop connects stray and rescue
                                animals with loving families — because every pet deserves a second chance.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-playful-teal font-bold hover:text-teal-700 transition-colors group"
                            >
                                Learn More
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default OurStoryWidget;
