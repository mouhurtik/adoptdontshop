import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Pet } from '@/types';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('pet_listings')
        .select('*');

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        const transformedPets = data.map(pet => ({
          ...pet,
          name: pet.pet_name,
          type: pet.animal_type,
          age: pet.age || 'Unknown',
          urgent: pet.status === 'urgent',
          image: pet.image_url
        }));

        setPets(transformedPets as Pet[]);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to load pets. Please try again.');
      toast.error('Failed to load pets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPetById = async (id: string): Promise<Pet | null> => {
    try {
      const { data, error } = await supabase
        .from('pet_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching pet from Supabase:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          name: data.pet_name,
          type: data.animal_type,
          age: data.age || 'Unknown',
          urgent: data.status === 'urgent',
          image: data.image_url
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching pet:', error);
      return null;
    }
  };

  const getPetCount = async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('pet_listings')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching pet count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Failed to fetch pet count:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    isLoading,
    error,
    fetchPets,
    getPetById,
    getPetCount
  };
};
