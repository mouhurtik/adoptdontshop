import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetCount } from '@/hooks/usePets';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import FeaturedPets from '@/components/home/FeaturedPets';
import WhyAdopt from '@/components/home/WhyAdopt';
import SponsorsSection from '@/components/home/SponsorsSection';
import CallToAction from '@/components/home/CallToAction';
import ScrollReveal from '@/components/ui/ScrollReveal';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: petCount = 0 } = usePetCount();

  const handleSearch = (animalType?: string) => {
    if (animalType) {
      navigate(`/browse?type=${encodeURIComponent(animalType)}`);
    } else if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/browse');
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
    </div>
  );
};

export default Home;
