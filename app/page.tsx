import { fetchCommunityPostsServer, serverPostsToPostCardData } from '@/lib/supabase/server-queries';
import CommunityFeed from '@/views/CommunityFeed';
import type { Metadata } from 'next';
import { PUBLIC_CONTENT_REVIEWED, serializeJsonLd, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'AdoptDontShop — Free Dog & Cat Adoption in India',
    description: SITE_DESCRIPTION,
    alternates: { canonical: '/' },
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
    const modifiedAt = new Date(Math.max(
        Date.parse(PUBLIC_CONTENT_REVIEWED),
        ...serverPosts.map(post => Date.parse(post.updated_at || post.created_at)).filter(Number.isFinite),
    )).toISOString();

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
                '@context': 'https://schema.org', '@type': 'CollectionPage',
                '@id': `${SITE_URL}/`, name: 'AdoptDontShop community',
                description: SITE_DESCRIPTION, dateModified: modifiedAt,
                isPartOf: { '@id': `${SITE_URL}/#website` },
                publisher: { '@id': `${SITE_URL}/#organization` },
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: serverPosts.map((post, index) => ({
                        '@type': 'ListItem', position: index + 1,
                        name: post.title, url: `${SITE_URL}/community/${post.slug}`,
                    })),
                },
            }) }} />
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
