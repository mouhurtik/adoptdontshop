import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Top Indian cities for SEO landing pages
const CITY_SLUGS = [
    'kolkata', 'mumbai', 'delhi', 'bangalore', 'pune',
    'hyderabad', 'chennai', 'ahmedabad', 'jaipur', 'lucknow',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createServerSupabaseClient();
    const baseUrl = 'https://adoptdontshop.xyz';

    // Static pages (only include canonical URLs, not redirect sources)
    const staticPages = [
        '', '/browse', '/about', '/explore',
        '/success-stories', '/welcome',
        '/terms', '/privacy-policy',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : route === '/browse' ? 0.95 : route === '/explore' ? 0.9 : 0.8,
    }));

    // City landing pages for local SEO
    const cityPages = CITY_SLUGS.map(city => ({
        url: `${baseUrl}/adopt-pets-in/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Dynamic pet pages
    const { data: pets } = await supabase
        .from('pet_listings')
        .select('slug, updated_at')
        .eq('status', 'available');

    const petPages = (pets || []).map(pet => ({
        url: `${baseUrl}/pet/${pet.slug}`,
        lastModified: new Date(pet.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Dynamic community post pages
    const { data: posts } = await supabase
        .from('community_posts')
        .select('slug, updated_at')
        .eq('status', 'published');

    const postPages = (posts || []).map(post => ({
        url: `${baseUrl}/community/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...cityPages, ...petPages, ...postPages];
}
