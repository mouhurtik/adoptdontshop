import type { Metadata } from 'next';
import { cache } from 'react';
import { fetchCommunityPostBySlugServer } from '@/lib/supabase/server-queries';
import CommunityPostDetail from '@/views/CommunityPostDetail';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };
const getPost = cache(fetchCommunityPostBySlugServer);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await getPost(slug);
        if (post) {
            const description = post.content_text
                ? post.content_text.replace(/[#*_[\]]/g, '').slice(0, 155).trim() + (post.content_text.length > 155 ? '…' : '')
                : 'Read this member post on the AdoptDontShop community.';
            const authorUrl = `${SITE_URL}/user/${post.author_username || post.author_id}`;
            return {
                title: post.title, description,
                authors: post.author_name ? [{ name: post.author_name, url: authorUrl }] : undefined,
                keywords: post.tags || [],
                openGraph: {
                    title: post.title, description, type: 'article',
                    url: `${SITE_URL}/community/${slug}`,
                    publishedTime: post.created_at,
                    modifiedTime: post.updated_at || post.created_at,
                    images: post.featured_image_url ? [post.featured_image_url] : [],
                    siteName: 'AdoptDontShop',
                },
                twitter: { card: 'summary_large_image', title: post.title, description, images: post.featured_image_url ? [post.featured_image_url] : [] },
                alternates: { canonical: `/community/${slug}` },
            };
        }
    } catch { /* Let the client retain its existing fetch/error experience. */ }
    return { title: 'Community Post', description: 'Member stories and questions about pet adoption, care and rescue.', alternates: { canonical: `/community/${slug}` } };
}

export default async function CommunityPostPage({ params }: Props) {
    const { slug } = await params;
    let post: Awaited<ReturnType<typeof getPost>> = null;
    try { post = await getPost(slug); } catch { /* Existing client fetch can retry. */ }
    return <CommunityPostDetail slug={slug} initialPost={post} />;
}
