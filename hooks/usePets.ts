import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Pet } from '@/types/pet.types';
import type { Tables } from '@/lib/supabase/types';

type PetListingRow = Tables<'pet_listings'>;

/** Transform raw Supabase row into Pet with UI convenience fields */
const transformPet = (raw: PetListingRow): Pet => ({
  ...raw,
  name: raw.pet_name,
  type: raw.animal_type ?? undefined,
  age: raw.age || 'Unknown',
  urgent: raw.status === 'urgent',
  image: raw.image_url ?? undefined,
});

/** Fetch all pet listings with a timeout to prevent hangs */
const fetchPets = async (): Promise<Pet[]> => {
  // Timeout guard: if fetch takes >15s, abort
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const { data, error } = await supabase
      .from('pet_listings')
      .select('*')
      .eq('status', 'available')
      .abortSignal(controller.signal);

    if (error) throw error;
    return (data ?? []).map(transformPet);
  } finally {
    clearTimeout(timeout);
  }
};

/** Fetch a single pet by matching an ID prefix (slug-based lookup) */
const fetchPetByIdPrefix = async (idPrefix: string): Promise<Pet | null> => {
  const { data, error } = await supabase
    .from('pet_listings')
    .select('*');

  if (error) throw error;

  const match = data?.find(p =>
    p.id.toLowerCase().startsWith(idPrefix.toLowerCase())
  );

  return match ? transformPet(match) : null;
};

/** Fetch total pet count (head-only query) */
const fetchPetCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('pet_listings')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count ?? 0;
};

// ─── Hooks ────────────────────────────────────────────────

/** Hook to fetch all pets — cached, auto-refetches on window focus */
export const usePets = () => {
  const { data: pets = [], isLoading, error } = useQuery({
    queryKey: ['pets'],
    queryFn: fetchPets,
  });

  return { pets, isLoading, error: error?.message ?? null };
};

/** Hook to fetch a single pet by slug ID prefix */
export const usePetBySlug = (idPrefix: string | undefined) => {
  return useQuery({
    queryKey: ['pet', idPrefix],
    queryFn: () => fetchPetByIdPrefix(idPrefix!),
    enabled: !!idPrefix,
  });
};

/** Hook to fetch the total pet count */
export const usePetCount = () => {
  return useQuery({
    queryKey: ['petCount'],
    queryFn: fetchPetCount,
  });
};

export default usePets;
