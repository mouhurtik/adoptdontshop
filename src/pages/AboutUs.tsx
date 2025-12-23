import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, PawPrint, Users, Target, Award } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Playful Header */}
        <ScrollReveal
          mode="fade-up"
          width="100%"
          className="text-center mb-24 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-coral/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-6 leading-tight">
            About
            <span className="relative inline-block ml-4 transform -rotate-2">
              <span className="absolute inset-0 bg-playful-teal rounded-2xl transform rotate-2"></span>
              <span className="relative text-white px-6 py-2">Us</span>
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
            Connecting loving homes with pets in need 🐾
          </p>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto space-y-24">
          {/* Mission Section */}
          <ScrollReveal
            mode="fade-up"
            delay={0}
            width="100%"
          >
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-soft border-2 border-playful-mint/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-playful-mint/20 p-4 rounded-full text-green-600">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-heading font-black text-playful-text">Our Mission</h2>
              </div>
              <div className="text-xl text-gray-600 font-medium leading-relaxed space-y-4">
                <p>
                  At Adopt Don't Shop, we believe every pet deserves a loving home. Our mission is
                  to connect abandoned, surrendered, and rescued animals with compassionate
                  individuals and families who will provide them with the care and love they
                  deserve.
                </p>
                <p>
                  We strive to reduce the number of animals in shelters by promoting adoption over
                  purchasing from breeders or pet stores. By choosing to adopt, you're not only
                  saving a life but also making room for another animal in need at a shelter or
                  rescue organization.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Founder Section */}
          <ScrollReveal
            mode="fade-up"
            delay={0.1}
            width="100%"
            className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl border-2 border-playful-yellow/30"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-playful-yellow/20 p-4 rounded-full text-yellow-600">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-heading font-black text-playful-text">Our Founder</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="bg-playful-yellow/10 rounded-[2rem] p-4 shadow-inner">
                  <div className="aspect-square bg-white rounded-[1.5rem] overflow-hidden shadow-md">
                    <img
                      src="/placeholder.svg"
                      alt="Mouhurtik Ray"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-3xl font-heading font-black text-playful-text mb-2">
                  Mouhurtik Ray
                </h3>
                <p className="text-xl text-playful-teal font-bold mb-6 bg-playful-teal/10 px-4 py-2 rounded-full inline-block">
                  Founder & CEO
                </p>

                <div className="text-xl text-gray-600 font-medium leading-relaxed space-y-4">
                  <p>
                    "I, Mouhurtik Ray, founded Adopt Don't Shop in 2025 with a simple yet powerful
                    vision: to help stray animals find loving homes. As someone who regularly feeds
                    and cares for local stray animals—and having personally adopted a rescue
                    kitten—I witnessed firsthand the challenges these animals face in finding the
                    care they deserve.
                  </p>
                  <p>
                    Driven by my experiences, I created Adopt Don't Shop to be a platform where
                    every stray and rescue animal can connect with caring individuals looking to
                    give them a second chance. This website is more than just a listing service;
                    it's a community built on the belief that every animal deserves love, care, and
                    a forever home.
                  </p>
                  <p>Join me in making a difference, one adoption at a time."</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Section */}
          <ScrollReveal
            mode="fade-up"
            delay={0.1}
            width="100%"
          >
            <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
              <div className="bg-playful-coral/20 p-4 rounded-full text-playful-coral">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-heading font-black text-playful-text">Contact Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-mint/30 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-playful-mint/20 p-4 mr-4 rounded-full text-green-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-playful-text">Email</h3>
                </div>
                <a
                  href="mailto:mouhurtikr@gmail.com"
                  className="text-xl text-gray-600 font-bold hover:text-playful-teal transition-colors break-all"
                >
                  mouhurtikr@gmail.com
                </a>
              </div>

              <div
                className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-teal/30 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-playful-teal/20 p-4 mr-4 rounded-full text-playful-teal">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-playful-text">LinkedIn</h3>
                </div>
                <a
                  href="https://www.linkedin.com/in/mouhurtik/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-gray-600 font-bold hover:text-playful-teal transition-colors break-all"
                >
                  linkedin.com/in/mouhurtik
                </a>
              </div>

              <div
                className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-coral/30 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-playful-coral/20 p-4 mr-4 rounded-full text-playful-coral">
                    <Twitter className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-playful-text">Twitter</h3>
                </div>
                <a
                  href="https://x.com/mouhurtik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-gray-600 font-bold hover:text-playful-teal transition-colors break-all"
                >
                  x.com/mouhurtik
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Call to Action */}
        <ScrollReveal
          className="mt-16 text-center"
          mode="fade-up"
          delay={0.1}
          width="100%"
        >
          <Link to="/browse">
            <PrimaryButton size="lg" className="text-xl px-10 py-4">
              <PawPrint className="mr-3 h-6 w-6" />
              Browse Available Pets
            </PrimaryButton>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AboutUs;
