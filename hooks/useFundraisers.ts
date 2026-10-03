'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { slugify } from '@/utils/slugUtils';

export type FundraiserCategory = 'all' | 'sterilization' | 'treatment' | 'shelter' | 'food_drive' | 'rescue' | 'other';
export type FundraiserSort = 'urgent' | 'new' | 'popular' | 'close_to_goal';

export interface Fundraiser {
    id: string;
    creator_id: string | null;
    title: string;
    slug: string;
    description: string | null;
    description_text: string | null;
    category: string;
    target_amount: number;
    raised_amount: number | null;
    currency: string | null;
    city: string | null;
    image_url: string | null;
    payment_upi: string | null;
    payment_qr_url: string | null;
    payment_details: string | null;
    is_urgent: boolean | null;
    status: 'pending' | 'active' | 'completed' | 'expired' | 'rejected' | string;
    deadline: string | null;
    supporter_count: number | null;
    created_at: string | null;
    updated_at: string | null;
    creator_profile?: {
        display_name: string | null;
        avatar_url: string | null;
        username: string | null;
    };
}

export interface FundraiserSupporter {
    id: string;
    fundraiser_id: string;
    user_id: string | null;
    donor_name: string | null;
    amount: number | null;
    message: string | null;
    is_anonymous: boolean | null;
    created_at: string | null;
}

interface FetchFundraisersParams {
    category?: FundraiserCategory;
    sort?: FundraiserSort;
    status?: string;
    limit?: number;
}

export function useFundraisers({
    category = 'all',
    sort = 'urgent',
    status = 'active',
    limit = 20,
}: FetchFundraisersParams = {}) {
    return useQuery({
        queryKey: ['fundraisers', category, sort, status, limit],
        queryFn: async (): Promise<Fundraiser[]> => {
            let query = supabase
                .from('fundraisers')
                .select('*')
                .limit(limit);

            if (status !== 'all') {
                query = query.eq('status', status);
            }

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            switch (sort) {
                case 'urgent':
                    query = query.order('is_urgent', { ascending: false }).order('created_at', { ascending: false });
                    break;
                case 'popular':
                    query = query.order('supporter_count', { ascending: false });
                    break;
                case 'close_to_goal':
                    query = query.order('raised_amount', { ascending: false });
                    break;
                case 'new':
                default:
                    query = query.order('created_at', { ascending: false });
                    break;
            }

            const { data, error } = await query;
            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Batch fetch creator profiles
            const creatorIds = Array.from(new Set(data.map(f => f.creator_id).filter(Boolean))) as string[];
            let profilesMap: Record<string, { display_name: string | null; avatar_url: string | null; username: string | null }> = {};

            if (creatorIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, display_name, avatar_url, username')
                    .in('id', creatorIds);

                if (profiles) {
                    profilesMap = Object.fromEntries(profiles.map(p => [p.id, p]));
                }
            }

            return data.map(item => ({
                ...item,
                creator_profile: item.creator_id ? profilesMap[item.creator_id] : undefined,
            })) as Fundraiser[];
        },
    });
}

export function useFundraiserBySlug(slug: string) {
    return useQuery({
        queryKey: ['fundraiser', slug],
        queryFn: async (): Promise<{ fundraiser: Fundraiser; supporters: FundraiserSupporter[] }> => {
            const { data: fundraiser, error } = await supabase
                .from('fundraisers')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !fundraiser) throw error || new Error('Fundraiser not found');

            // Fetch creator profile
            let creatorProfile = undefined;
            if (fundraiser.creator_id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url, username')
                    .eq('id', fundraiser.creator_id)
                    .maybeSingle();

                if (profile) creatorProfile = profile;
            }

            // Fetch supporters
            const { data: supporters } = await supabase
                .from('fundraiser_supporters')
                .select('*')
                .eq('fundraiser_id', fundraiser.id)
                .order('created_at', { ascending: false })
                .limit(50);

            return {
                fundraiser: { ...fundraiser, creator_profile: creatorProfile } as Fundraiser,
                supporters: (supporters || []) as FundraiserSupporter[],
            };
        },
        enabled: Boolean(slug),
    });
}

export function useCreateFundraiser() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (payload: {
            title: string;
            description: string;
            description_text?: string;
            category: string;
            target_amount: number;
            city?: string;
            image_url?: string;
            payment_upi?: string;
            payment_qr_url?: string;
            payment_details?: string;
            is_urgent?: boolean;
            deadline?: string;
        }) => {
            if (!user) throw new Error('You must be logged in to create a fundraiser');

            const baseSlug = slugify(payload.title);
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const slug = `${baseSlug}-${randomSuffix}`;

            const { data, error } = await supabase
                .from('fundraisers')
                .insert({
                    creator_id: user.id,
                    title: payload.title,
                    slug,
                    description: payload.description,
                    description_text: payload.description_text || payload.description.replace(/<[^>]*>/g, ''),
                    category: payload.category,
                    target_amount: payload.target_amount,
                    city: payload.city || null,
                    image_url: payload.image_url || null,
                    payment_upi: payload.payment_upi || null,
                    payment_qr_url: payload.payment_qr_url || null,
                    payment_details: payload.payment_details || null,
                    is_urgent: payload.is_urgent || false,
                    deadline: payload.deadline || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fundraisers'] });
        },
    });
}

export function useAddSupporter() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            fundraiserId,
            donorName,
            amount,
            message,
            isAnonymous,
        }: {
            fundraiserId: string;
            donorName: string;
            amount: number;
            message?: string;
            isAnonymous?: boolean;
        }) => {
            const { data, error } = await supabase
                .from('fundraiser_supporters')
                .insert({
                    fundraiser_id: fundraiserId,
                    user_id: user?.id || null,
                    donor_name: donorName,
                    amount,
                    message: message || null,
                    is_anonymous: isAnonymous || false,
                })
                .select()
                .single();

            if (error) throw error;

            // Award PawCoins to logged-in supporters
            if (user?.id) {
                await supabase.rpc('award_pawcoins', {
                    p_user_id: user.id,
                    p_amount: 15,
                    p_reason: 'fundraiser_support',
                    p_reference_id: fundraiserId,
                });
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fundraiser'] });
            queryClient.invalidateQueries({ queryKey: ['fundraisers'] });
        },
    });
}
