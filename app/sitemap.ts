import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createServerSupabaseClient();
    const baseUrl = 'https://adoptdontshop.xyz';

    // Static pages
    const staticPages = [
        '', '/browse', '/about', '/pet-essentials',
        '/success-stories', '/sponsors', '/list-pet',
        '/community', '/resources',
        '/terms', '/privacy-policy',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : route === '/community' ? 0.9 : 0.8,
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

    return [...staticPages, ...petPages, ...postPages];
}
