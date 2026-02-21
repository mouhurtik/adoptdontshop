import Link from 'next/link';
import { Award, ArrowRight, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const OurStoryWidget = () => {
    return (
        <section className="py-24 bg-playful-cream relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-playful-coral/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-playful-teal/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6">
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col lg:flex-row relative">
                        {/* Image Section */}
                        <div className="w-full lg:w-2/5 p-6 md:p-8 shrink-0">
                            <div className="relative w-full h-[300px] lg:h-full min-h-[400px] rounded-[2rem] overflow-hidden group">
                                <img
                                    src="https://lh3.googleusercontent.com/pw/AP1GczPP3ut83cBmFXmNL9D5I76DmwBvAYi8spjCclhrpwDDXXK51LZ8qIgojWYJNXPqznl0Go7jeWg-5vDIu3rtfHgbKXRkMogYq9mOo4Dkoce3lGFJXpOlZIxXzfpdO1w4ETX6KlxqqFhFOmZmk66u6Cq-wA=w711-h949-s-no-gm"
                                    alt="Mouhurtik Ray — Founder"
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white text-left">
                                    <h3 className="text-2xl font-black font-heading tracking-wide mb-1">Mouhurtik Ray</h3>
                                    <p className="font-bold text-playful-yellow uppercase tracking-widest text-sm">Founder</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
                            <Quote className="absolute top-12 left-12 h-24 w-24 text-gray-50 opacity-50 -z-0 rotate-180" />
                            
                            <div className="relative z-10 text-left">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="bg-playful-yellow/20 p-2.5 rounded-full text-playful-yellow">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Our Story</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-heading font-black text-playful-text mb-6 leading-tight">
                                    Every pet deserves a <br className="hidden md:block"/><span className="text-playful-coral">second chance</span>.
                                </h2>
                                <p className="text-lg md:text-2xl text-gray-500 font-medium leading-relaxed mb-8 font-heading">
                                    Founded in 2025, Adopt Don't Shop was born from a simple belief: that no animal should be left behind. We connect stray and rescue animals with loving, forever families.
                                </p>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center gap-3 bg-playful-teal text-white font-bold px-8 py-4 rounded-full hover:bg-teal-600 transition-all hover:shadow-lg hover:-translate-y-1 group"
                                >
                                    Read Full Story
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default OurStoryWidget;
