import { fetchCommunityPostsServer, serverPostsToPostCardData } from '@/lib/supabase/server-queries';
import CommunityFeed from '@/views/CommunityFeed';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'AdoptDontShop — Free Dog & Cat Adoption in India',
    description: 'Adopt rescue dogs and cats for free across India. Join the AdoptDontShop community — share pet care tips, find adoption events, and connect with animal lovers in Mumbai, Delhi, Kolkata & more.',
    keywords: [
        'pet adoption India', 'adopt dog India', 'adopt cat India',
        'rescue animals', 'pet community India', 'adopt dont shop',
        'indie dog adoption', 'free pet adoption',
    ],
};

export default async function HomePage() {
    const serverPosts = await fetchCommunityPostsServer({ tag: 'all', sort: 'new', limit: 20 });
    const initialPosts = serverPostsToPostCardData(serverPosts);

    // Find the first post with a featured image for LCP preload
    const lcpImageUrl = initialPosts.find(p => p.featured_image_url)?.featured_image_url || null;

    return (
        <>
            {/* Preload the LCP image to eliminate resource discovery delay */}
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
