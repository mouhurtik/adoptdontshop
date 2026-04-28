import { fetchCommunityPostsServer, serverPostsToPostCardData } from '@/lib/supabase/server-queries';
import CommunityFeed from '@/views/CommunityFeed';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
    description: 'Join the AdoptDontShop community. Share stories, discuss pet care, browse rescue animals for adoption, and connect with fellow animal lovers in India.',
    keywords: ['adopt pet', 'rescue animals', 'pet community', 'adopt dog', 'adopt cat', 'pet adoption India', 'adopt dont shop'],
};

export default async function HomePage() {
    const serverPosts = await fetchCommunityPostsServer({ tag: 'all', sort: 'new', limit: 20 });
    const initialPosts = serverPostsToPostCardData(serverPosts);

    // Find the first post with a featured image for LCP preload
    const lcpImageUrl = initialPosts.find(p => p.featured_image_url)?.featured_image_url || null;

    return (
        <>
            {/* Preload the LCP image to eliminate resource discovery delay (~410ms saving) */}
            {lcpImageUrl && (
                <link
                    rel="preload"
                    as="image"
                    href={lcpImageUrl}
                    fetchPriority="high"
                />
            )}
            <CommunityFeed variant="home" initialPosts={initialPosts} />
        </>
    );
}
