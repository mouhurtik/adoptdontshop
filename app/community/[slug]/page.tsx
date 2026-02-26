import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import CommunityPostDetail from '@/views/CommunityPostDetail';

export const revalidate = 3600; // Regenerate every hour

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const supabase = await createServerSupabaseClient();
        const { data: post } = await supabase
            .from('community_posts')
            .select('title, content_text, featured_image_url, tags, created_at')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (post) {
            const title = `${post.title} | AdoptDontShop Community`;
            const description = post.content_text
                ? post.content_text.replace(/[#*_[\]]/g, '').substring(0, 155).trim() + '…'
                : 'Read this post on the AdoptDontShop community.';

            return {
                title,
                description,
                keywords: Array.isArray(post.tags) ? (post.tags as string[]) : [],
                openGraph: {
                    title,
                    description,
                    type: 'article',
                    publishedTime: post.created_at,
                    images: post.featured_image_url ? [post.featured_image_url] : [],
                    siteName: 'AdoptDontShop',
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: post.featured_image_url ? [post.featured_image_url] : [],
                },
                alternates: {
                    canonical: `/community/${slug}`,
                },
            };
        }
    } catch {
        // Fallback metadata if fetch fails
    }

    return {
        title: 'Community Post | AdoptDontShop',
        description: 'Read community posts about pet adoption, care tips, and rescue stories.',
    };
}

export default async function CommunityPostPage({ params }: Props) {
    const { slug } = await params;
    return <CommunityPostDetail slug={slug} />;
}
