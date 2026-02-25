'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePetCount } from '@/hooks/usePets';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import FeaturedPets from '@/components/home/FeaturedPets';
import WhyAdopt from '@/components/home/WhyAdopt';
import SponsorsSection from '@/components/home/SponsorsSection';
import CallToAction from '@/components/home/CallToAction';
import OurStoryWidget from '@/components/home/OurStoryWidget';
import ScrollReveal from '@/components/ui/ScrollReveal';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data: petCount = 0 } = usePetCount();

  // Redirect mobile users to community feed (mobile-first experience)
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile) {
      router.push('/community');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (animalType?: string) => {
    if (animalType) {
      router.push(`/browse?type=${encodeURIComponent(animalType)}`);
    } else if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/browse');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="overflow-hidden bg-playful-cream min-h-screen">

      <HeroSection petCount={petCount} />

      <ScrollReveal width="100%" mode="fade-up" delay={0.2}>
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />
      </ScrollReveal>

      <FeaturedPets />

      <WhyAdopt />

      <ScrollReveal width="100%" mode="fade-in">
        <SponsorsSection />
      </ScrollReveal>

      <CallToAction />

      <OurStoryWidget />
    </div>
  );
};

export default Home;
