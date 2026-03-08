'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchSection from '@/components/home/SearchSection';
import FeaturedPets from '@/components/home/FeaturedPets';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface HomeClientProps {
  initialPets?: Array<Record<string, unknown>>;
  petCount?: number;
}

const HomeClient = ({ initialPets, petCount: _petCount }: HomeClientProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
    <>
      <ScrollReveal width="100%" mode="fade-up">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />
      </ScrollReveal>

      <FeaturedPets initialPets={initialPets} />
    </>
  );
};

export default HomeClient;
