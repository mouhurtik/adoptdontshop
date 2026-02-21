import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
    const { user, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setFavorites([]);
            setIsLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const { data, error } = await supabase
                    .from('pet_favorites')
                    .select('pet_id')
                    .eq('user_id', user.id);

                if (error) throw error;
                setFavorites(data.map((f: any) => f.pet_id));
            } catch (err: any) {
                console.error('Error fetching favorites:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [user, isAuthenticated]);

    const toggleFavorite = async (petId: string) => {
        if (!isAuthenticated || !user) return;

        const isFavorited = favorites.includes(petId);

        // Optimistic update
        setFavorites(prev =>
            isFavorited ? prev.filter(id => id !== petId) : [...prev, petId]
        );

        try {
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
        } catch (err: any) {
            console.error('Error toggling favorite:', err);
            // Revert optimistic update
            setFavorites(prev =>
                isFavorited ? [...prev, petId] : prev.filter(id => id !== petId)
            );
        }
    };

    return { favorites, toggleFavorite, isLoading };
};
