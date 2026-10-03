'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AnimalType = 'all' | 'cat' | 'dog' | 'other';

export interface StreetAnimalSighting {
    id: string;
    user_id: string | null;
    animal_type: 'cat' | 'dog' | 'other';
    name: string | null;
    description: string | null;
    latitude: number;
    longitude: number;
    location_name: string | null;
    city: string | null;
    image_url: string | null;
    is_vaccinated: boolean | null;
    is_sterilized: boolean | null;
    vaccination_notes: string | null;
    status: string | null;
    confirmation_count: number | null;
    last_confirmed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    user_confirmed?: boolean;
}

interface FetchSightingsParams {
    city?: string;
    animalType?: AnimalType;
    status?: string;
}

export function useMapSightings({
    city,
    animalType = 'all',
    status = 'active',
}: FetchSightingsParams = {}) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['map-sightings', city, animalType, status, user?.id],
        queryFn: async (): Promise<StreetAnimalSighting[]> => {
            let query = supabase
                .from('street_animal_sightings')
                .select('*');

            if (status !== 'all') {
                query = query.eq('status', status);
            }

            if (city && city !== 'all') {
                query = query.ilike('city', `%${city}%`);
            }

            if (animalType !== 'all') {
                query = query.eq('animal_type', animalType);
            }

            const { data, error } = await query.order('last_confirmed_at', { ascending: false });
            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Check which ones user has already confirmed
            let confirmedSet = new Set<string>();
            if (user?.id) {
                const sightingIds = data.map(s => s.id);
                const { data: userConfirmations } = await supabase
                    .from('sighting_confirmations')
                    .select('sighting_id')
                    .eq('user_id', user.id)
                    .in('sighting_id', sightingIds);

                if (userConfirmations) {
                    confirmedSet = new Set(userConfirmations.map(c => c.sighting_id));
                }
            }

            return data.map(s => ({
                ...s,
                animal_type: s.animal_type as 'cat' | 'dog' | 'other',
                user_confirmed: confirmedSet.has(s.id),
            }));
        },
    });
}

export function useConfirmSighting() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (sightingId: string) => {
            if (!user) throw new Error('Sign in to confirm sighting');

            const { data, error } = await supabase
                .from('sighting_confirmations')
                .insert({
                    sighting_id: sightingId,
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    throw new Error("You've already confirmed this spot!");
                }
                throw error;
            }

            // Award 2 PawCoins for confirming sighting
            await supabase.rpc('award_pawcoins', {
                p_user_id: user.id,
                p_amount: 2,
                p_reason: 'sighting_confirmed',
                p_reference_id: sightingId,
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['map-sightings'] });
            queryClient.invalidateQueries({ queryKey: ['user-pawcoins'] });
        },
    });
}

export function useCreateSighting() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (payload: {
            animal_type: 'cat' | 'dog' | 'other';
            name?: string;
            description?: string;
            latitude: number;
            longitude: number;
            location_name?: string;
            city?: string;
            image_url?: string;
            is_vaccinated?: boolean;
            is_sterilized?: boolean;
            vaccination_notes?: string;
        }) => {
            if (!user) throw new Error('Sign in to add a street animal spot');

            const { data, error } = await supabase
                .from('street_animal_sightings')
                .insert({
                    user_id: user.id,
                    animal_type: payload.animal_type,
                    name: payload.name || null,
                    description: payload.description || null,
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    location_name: payload.location_name || null,
                    city: payload.city || null,
                    image_url: payload.image_url || null,
                    is_vaccinated: payload.is_vaccinated || false,
                    is_sterilized: payload.is_sterilized || false,
                    vaccination_notes: payload.vaccination_notes || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['map-sightings'] });
        },
    });
}
