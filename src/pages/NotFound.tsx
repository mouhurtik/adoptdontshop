import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Dog, Cat, ArrowLeft } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ScrollReveal from "@/components/ui/ScrollReveal";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-playful-cream flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-10 text-playful-yellow opacity-20 transform -rotate-12 animate-pulse">
        <Dog size={120} />
      </div>
      <div className="absolute bottom-1/4 right-10 text-playful-teal opacity-20 transform rotate-12 animate-pulse delay-700">
        <Cat size={120} />
      </div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-playful-coral/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-playful-blue/10 rounded-full blur-3xl -z-10"></div>

      <div className="text-center px-6 max-w-2xl relative z-10">
        <div className="mb-8 relative inline-block">
          <div className="text-9xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-playful-coral to-playful-yellow opacity-20 select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 blur-sm">
            404
          </div>
          <ScrollReveal
            mode="fade-up"
            delay={0.2}
            width="100%"
            className="text-6xl md:text-8xl font-heading font-black text-playful-text mb-4"
          >
            404
          </ScrollReveal>
        </div>

        <ScrollReveal
          mode="fade-up"
          delay={0.3}
          width="100%"
          className="text-2xl md:text-3xl font-bold text-gray-700 mb-6"
        >
          Oops! This page has gone astray
        </ScrollReveal>

        <ScrollReveal
          mode="fade-up"
          delay={0.4}
          width="100%"
          className="text-gray-600 mb-10 max-w-md mx-auto text-lg"
        >
          The page you are looking for might have been removed, had its name changed, or joined a new family.
        </ScrollReveal>

        <ScrollReveal
          mode="fade-up"
          delay={0.5}
          width="100%"
        >
          <Link to="/">
            <PrimaryButton size="lg" className="shadow-xl shadow-playful-coral/20 hover:shadow-playful-coral/30">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Home
            </PrimaryButton>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default NotFound;



