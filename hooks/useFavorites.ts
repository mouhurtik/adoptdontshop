'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/** Fetch the user's favorited pet IDs */
function useFavoritesQuery(userId: string | undefined) {
    return useQuery({
        queryKey: ['favorites', userId],
        queryFn: async (): Promise<string[]> => {
            const { data, error } = await supabase
                .from('pet_favorites')
                .select('pet_id')
                .eq('user_id', userId!);

            if (error) throw error;
            return (data || []).map((f: { pet_id: string }) => f.pet_id);
        },
        enabled: !!userId,
    });
}

/** Toggle a pet favorite with optimistic update and auto-rollback */
function useToggleFavorite() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ petId, isFavorited }: { petId: string; isFavorited: boolean }) => {
            if (!user) throw new Error('Must be logged in');

            if (isFavorited) {
                const { error } = await supabase
                    .from('pet_favorites')
                    .delete()
                    .match({ user_id: user.id, pet_id: petId });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('pet_favorites')
                    .insert({ user_id: user.id, pet_id: petId });
                if (error) throw error;
            }
        },
        onMutate: async ({ petId, isFavorited }) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });

            // Snapshot the previous value
            const previous = queryClient.getQueryData<string[]>(['favorites', user?.id]);

            // Optimistically update the cache
            queryClient.setQueryData<string[]>(['favorites', user?.id], (old = []) =>
                isFavorited ? old.filter(id => id !== petId) : [...old, petId]
            );

            return { previous };
        },
        onError: (_err, _vars, context) => {
            // Rollback to snapshot on error
            if (context?.previous) {
                queryClient.setQueryData(['favorites', user?.id], context.previous);
            }
        },
        onSettled: () => {
            // Refetch to ensure server state is in sync
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
        },
    });
}

/**
 * Drop-in replacement for the old useState/useEffect-based useFavorites.
 * Same API: { favorites, toggleFavorite, isLoading }
 */
export const useFavorites = () => {
    const { user, isAuthenticated } = useAuth();
    const { data: favorites = [], isLoading } = useFavoritesQuery(
        isAuthenticated ? user?.id : undefined
    );
    const mutation = useToggleFavorite();

    const toggleFavorite = (petId: string) => {
        if (!isAuthenticated || !user) return;
        const isFavorited = favorites.includes(petId);
        mutation.mutate({ petId, isFavorited });
    };

    return { favorites, toggleFavorite, isLoading };
};
