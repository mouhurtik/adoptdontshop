import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/ScrollReveal";

const EssentialsHero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-playful-cream/30">
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal
                    mode="fade-up"
                    width="100%"
                    className="text-center max-w-3xl mx-auto"
                >
                    <Badge variant="secondary" className="mb-4 bg-playful-yellow text-playful-text hover:bg-playful-yellow/80">
                        Editor's Picks
                    </Badge>
                    <h1 className="text-3xl md:text-6xl font-heading font-black text-playful-text mb-6 leading-tight">
                        Pamper Your
                        <span className="relative inline-block ml-3 transform -rotate-2">
                            <span className="absolute inset-0 bg-playful-teal rounded-2xl transform rotate-2"></span>
                            <span className="relative text-white px-4 py-1">Best Friend</span>
                        </span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
                        Discover our curated selection of top-rated food, toys, and accessories.
                        Every purchase supports our shelter partners.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default EssentialsHero;
