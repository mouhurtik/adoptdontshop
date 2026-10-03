'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StoreProduct {
    id: string;
    name: string;
    description: string | null;
    category: 'food' | 'toys' | 'accessories' | 'health' | 'grooming' | 'other';
    pet_type: 'dog' | 'cat' | 'both';
    image_url: string | null;
    affiliate_url: string;
    affiliate_source: string | null;
    price_display: string | null;
    original_price: string | null;
    badge: string | null;
    pawcoins_reward: number | null;
    is_active: boolean | null;
    sort_order: number | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface UserPawCoins {
    balance: number;
    total_earned: number;
}

interface FetchProductsParams {
    category?: string;
    petType?: 'all' | 'dog' | 'cat';
    search?: string;
}

export function useStoreProducts({
    category = 'all',
    petType = 'all',
    search = '',
}: FetchProductsParams = {}) {
    return useQuery({
        queryKey: ['store-products', category, petType, search],
        queryFn: async (): Promise<StoreProduct[]> => {
            let query = supabase
                .from('store_products')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            if (petType !== 'all') {
                query = query.or(`pet_type.eq.${petType},pet_type.eq.both`);
            }

            if (search.trim()) {
                query = query.ilike('name', `%${search.trim()}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as StoreProduct[];
        },
    });
}

export function useUserPawCoins() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['user-pawcoins', user?.id],
        queryFn: async (): Promise<UserPawCoins> => {
            if (!user) return { balance: 0, total_earned: 0 };

            const { data, error } = await supabase
                .from('user_pawcoins')
                .select('balance, total_earned')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;
            return {
                balance: data?.balance || 0,
                total_earned: data?.total_earned || 0,
            };
        },
        enabled: Boolean(user?.id),
    });
}

export interface AffiliatePlatform {
    id: string;
    name: string;
    slug: string;
    logo_initial: string;
    tagline: string;
    affiliate_url: string;
    reward_text: string;
    reward_pawcoins: number;
    badge: string;
    popular_categories: string[];
    perk: string;
    brand_color: string;
    bg_gradient: string;
}

export const AFFILIATE_PLATFORMS: AffiliatePlatform[] = [
    {
        id: 'supertails',
        name: 'Supertails',
        slug: 'supertails',
        logo_initial: 'ST',
        tagline: "India's #1 pet care superstore, pharmacy & vet clinic",
        affiliate_url: 'https://supertails.com/?utm_source=adoptdontshop',
        reward_text: 'Up to 8% PawCoins',
        reward_pawcoins: 10,
        badge: 'Featured Partner',
        popular_categories: ['Pet Food', 'Pharmacy', 'Toys', 'Treats'],
        perk: 'Flat 10% off with coupon: FIRST10',
        brand_color: '#7C3AED',
        bg_gradient: 'from-purple-500 to-indigo-600',
    },
    {
        id: 'amazon',
        name: 'Amazon Pets',
        slug: 'amazon',
        logo_initial: 'AZ',
        tagline: 'Prime 1-day delivery on 15,000+ top pet food & gear brands',
        affiliate_url: 'https://amzn.to/44VAWBs',
        reward_text: 'Up to 10% PawCoins',
        reward_pawcoins: 10,
        badge: 'Fastest Delivery',
        popular_categories: ['Royal Canin', 'Pedigree', 'Cat Litter', 'Crates'],
        perk: 'Extra 10% off via Subscribe & Save',
        brand_color: '#F59E0B',
        bg_gradient: 'from-amber-500 to-orange-600',
    },
    {
        id: 'huft',
        name: 'Heads Up For Tails',
        slug: 'huft',
        logo_initial: 'HUFT',
        tagline: 'Luxury orthopedic beds, collars, apparel & gourmet treats',
        affiliate_url: 'https://headsupfortails.com/?utm_source=adoptdontshop',
        reward_text: 'Flat 6% PawCoins',
        reward_pawcoins: 10,
        badge: 'Premium Brand',
        popular_categories: ['Orthopedic Beds', 'Natural Treats', 'Collars & Leashes'],
        perk: 'Free shipping on orders above ₹999',
        brand_color: '#EC4899',
        bg_gradient: 'from-pink-500 to-rose-600',
    },
    {
        id: 'zigly',
        name: 'Zigly',
        slug: 'zigly',
        logo_initial: 'ZG',
        tagline: 'Veterinary prescription diets, professional grooming & essentials',
        affiliate_url: 'https://www.zigly.com/?utm_source=adoptdontshop',
        reward_text: 'Up to 7% PawCoins',
        reward_pawcoins: 8,
        badge: 'Vet Approved',
        popular_categories: ['Prescription Diets', 'Supplements', 'Grooming'],
        perk: 'Same-day delivery in metro cities',
        brand_color: '#06B6D4',
        bg_gradient: 'from-cyan-500 to-teal-600',
    },
    {
        id: 'petsy',
        name: 'Petsy',
        slug: 'petsy',
        logo_initial: 'PT',
        tagline: 'Curated international & indie brands for happy paws',
        affiliate_url: 'https://www.petsy.online/?utm_source=adoptdontshop',
        reward_text: 'Flat 5% PawCoins',
        reward_pawcoins: 8,
        badge: 'Curated Deals',
        popular_categories: ['Imported Foods', 'Interactive Toys', 'Shampoos'],
        perk: 'Loyalty points on every checkout',
        brand_color: '#10B981',
        bg_gradient: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'drools',
        name: 'Drools Direct',
        slug: 'drools',
        logo_initial: 'DR',
        tagline: 'Fresh nutrition direct from the makers of Focus & Real Chicken',
        affiliate_url: 'https://www.drools.com/?utm_source=adoptdontshop',
        reward_text: 'Up to 9% PawCoins',
        reward_pawcoins: 10,
        badge: 'Direct Store',
        popular_categories: ['Drools Focus', 'Real Chicken', 'Calci Bones'],
        perk: 'Factory-direct freshness & mega saver packs',
        brand_color: '#EF4444',
        bg_gradient: 'from-red-500 to-amber-600',
    },
];

export function useTrackAffiliateClick() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (product: StoreProduct) => {
            if (!user?.id) return;

            const reward = product.pawcoins_reward || 1;
            await supabase.rpc('award_pawcoins', {
                p_user_id: user.id,
                p_amount: reward,
                p_reason: 'affiliate_click',
                p_reference_id: product.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-pawcoins'] });
        },
    });
}

export function useTrackPlatformClick() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (platform: AffiliatePlatform) => {
            if (!user?.id) return;
            await supabase.rpc('award_pawcoins', {
                p_user_id: user.id,
                p_amount: platform.reward_pawcoins || 5,
                p_reason: 'platform_affiliate_visit',
                p_reference_id: platform.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-pawcoins'] });
        },
    });
}
