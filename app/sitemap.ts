import type { MetadataRoute } from 'next';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { generatePetSlug } from '@/utils/slugUtils';

// Top Indian cities for SEO landing pages
const CITY_SLUGS = [
    'kolkata', 'mumbai', 'delhi', 'bangalore', 'pune',
    'hyderabad', 'chennai', 'ahmedabad', 'jaipur', 'lucknow',
];

// Static pages (only include canonical URLs, not redirect sources)
const STATIC_ROUTES = [
    '', '/browse', '/map', '/fundraisers', '/shop', '/support-us',
    '/about', '/success-stories', '/welcome',
    '/terms', '/privacy-policy',
];

function staticEntries(): MetadataRoute.Sitemap {
    const baseUrl = 'https://adoptdontshop.xyz';
    const staticPages = STATIC_ROUTES.map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : (route === '/browse' || route === '/map' || route === '/fundraisers') ? 0.95 : 0.8,
    }));

    // City landing pages for local SEO
    const cityPages = CITY_SLUGS.map(city => ({
        url: `${baseUrl}/adopt-pets-in/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...staticPages, ...cityPages];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
        console.error('[sitemap] database unavailable — emitting static pages only');
        return staticEntries();
    }
    const baseUrl = 'https://adoptdontshop.xyz';

    // Dynamic pet pages
    const { data: pets, error: petsError } = await supabase
        .from('pet_listings')
        .select('id, pet_name, updated_at')
        .eq('status', 'available');
    if (petsError) {
        console.error('[sitemap] pet_listings query failed:', petsError.message);
    }

    const petPages = (pets || []).map(pet => ({
        url: `${baseUrl}/pet/${generatePetSlug(pet.pet_name ?? '', pet.id)}`,
        lastModified: new Date(pet.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Dynamic community post pages
    const { data: posts, error: postsError } = await supabase
        .from('community_posts')
        .select('slug, updated_at')
        .eq('status', 'published');
    if (postsError) {
        console.error('[sitemap] community_posts query failed:', postsError.message);
    }

    const postPages = (posts || []).map(post => ({
        url: `${baseUrl}/community/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic fundraiser pages
    const { data: fundraisers } = await supabase
        .from('fundraisers')
        .select('slug, updated_at')
        .eq('status', 'active');

    const fundraiserPages = (fundraisers || []).map(f => ({
        url: `${baseUrl}/fundraisers/${f.slug}`,
        lastModified: new Date(f.updated_at || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.85,
    }));

    return [...staticEntries(), ...petPages, ...postPages, ...fundraiserPages];
}
