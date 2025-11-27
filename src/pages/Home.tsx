import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import FeaturedPets from '@/components/home/FeaturedPets';
import WhyAdopt from '@/components/home/WhyAdopt';
import SponsorsSection from '@/components/home/SponsorsSection';
import CallToAction from '@/components/home/CallToAction';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [petCount, setPetCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPetCount();
  }, []);

  const fetchPetCount = async () => {
    try {
      const { count, error } = await supabase
        .from('pet_listings')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching pet count:', error);
        return;
      }

      if (count !== null) {
        setPetCount(count);
      }
    } catch (error) {
      console.error('Failed to fetch pet count:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      {isLoading && <LoadingSpinner />}

      <HeroSection petCount={petCount} />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      <FeaturedPets />

      <WhyAdopt />

      <SponsorsSection />

      <CallToAction />
    </div>
  );
};

export default Home;



