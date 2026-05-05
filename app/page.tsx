import { fetchCommunityPostsServer, serverPostsToPostCardData } from '@/lib/supabase/server-queries';
import { getOptimizedImageUrl } from '@/lib/imageLoader';
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

    // Find the first post with a featured image for LCP preload (use optimized mobile size)
    const lcpImageUrl = initialPosts.find(p => p.featured_image_url)?.featured_image_url || null;
    const lcpPreloadUrl = lcpImageUrl ? getOptimizedImageUrl(lcpImageUrl, 800) : null;

    return (
        <>
            {/* Preload the optimized LCP image to eliminate resource discovery delay */}
            {lcpPreloadUrl && (
                <link
                    rel="preload"
                    as="image"
                    href={lcpPreloadUrl}
                    imageSrcSet={lcpImageUrl ? `${getOptimizedImageUrl(lcpImageUrl, 480)} 480w, ${getOptimizedImageUrl(lcpImageUrl, 800)} 800w, ${getOptimizedImageUrl(lcpImageUrl, 1200)} 1200w` : undefined}
                    imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 658px"
                    fetchPriority="high"
                />
            )}
            <CommunityFeed variant="home" initialPosts={initialPosts} />
        </>
    );
}
