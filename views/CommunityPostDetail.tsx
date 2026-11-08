'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Share2, MessageCircle, Mail, Bookmark } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PostComments from '@/components/community/PostComments';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TiptapRenderer from '@/components/community/TiptapRenderer';
import type { fetchCommunityPostBySlugServer } from '@/lib/supabase/server-queries';
import { serializeJsonLd } from '@/lib/site';
import { TAG_LABELS, TAG_COLORS } from '@/components/community/PostCard';
import { useCommunityPost, useLikePost, useUserLiked, useSavePost, useUserSavedPost, useRelatedPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPostDetailProps {
    slug: string;
    initialPost?: Awaited<ReturnType<typeof fetchCommunityPostBySlugServer>>;
}

const CommunityPostDetail = ({ slug, initialPost }: CommunityPostDetailProps) => {
    const { isAuthenticated, user } = useAuth();
    const { data: fetchedPost, isLoading } = useCommunityPost(slug);
    const post = fetchedPost || initialPost;
    const { data: userHasLiked = false } = useUserLiked(post?.id);
    const { data: userHasSaved = false } = useUserSavedPost(post?.id);
    const likePost = useLikePost();
    const savePost = useSavePost();
    const { data: relatedPosts = [] } = useRelatedPosts(post?.id, post?.tags as string[] | undefined);

    const handleLike = () => {
        if (!isAuthenticated || !post) return;
        likePost.mutate({ postId: post.id, liked: userHasLiked });
    };

    const handleSave = () => {
        if (!isAuthenticated || !post) return;
        savePost.mutate({ postId: post.id, saved: userHasSaved });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: post?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading && !post) {
        return (
            <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 max-w-4xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded-full" />
                        <div className="h-12 w-3/4 bg-gray-200 rounded-2xl" />
                        <div className="h-64 bg-gray-200 rounded-[2rem]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
                    <h1 className="text-3xl font-heading font-black text-playful-text mb-4">Post not found</h1>
                    <Link href="/community" prefetch={false}>
                        <PrimaryButton>Back to Community</PrimaryButton>
                    </Link>
                </div>
            </div>
        );
    }

    const authorName = post.profiles?.display_name || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();
    const postDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
            {/* BlogPosting structured data for Google rich results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.title,
                        description: post.content_text?.substring(0, 160),
                        image: post.featured_image_url || undefined,
                        datePublished: post.created_at,
                        dateModified: post.updated_at || post.created_at,
                        author: {
                            '@type': 'Person',
                            name: authorName,
                            url: `https://adoptdontshop.xyz/user/${post.profiles?.username || post.author_id}`,
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'AdoptDontShop',
                            url: 'https://adoptdontshop.xyz',
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://adoptdontshop.xyz/community/${slug}`,
                        },
                    }),
                }}
            />
            {/* BreadcrumbList structured data for search navigation */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://adoptdontshop.xyz' },
                            { '@type': 'ListItem', position: 2, name: 'Community', item: 'https://adoptdontshop.xyz/community' },
                            { '@type': 'ListItem', position: 3, name: post.title },
                        ],
                    }),
                }}
            />
            <div className="max-w-7xl mx-auto px-4 lg:px-6 max-w-4xl">
                {/* Back */}
                <ScrollReveal mode="fade-up" width="100%">
                    <Link
                        href="/community"
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-playful-coral font-bold mb-8 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Community
                    </Link>
                </ScrollReveal>

                {/* Post */}
                <ScrollReveal mode="fade-up" delay={0.05} width="100%">
                    <article className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
                        {/* Featured Image */}
                        {post.featured_image_url && (
                            <div className="w-full max-h-[500px] bg-gray-50/50 flex justify-center border-b border-gray-100">
                                <img
                                    src={post.featured_image_url}
                                    alt={post.title}
                                    className="w-full h-auto max-h-[500px] object-contain"
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-10">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(post.tags || []).map((tag: string) => {
                                    const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                                    return (
                                        <span
                                            key={tag}
                                            className={`text-xs font-bold px-3 py-1 rounded-full ${color.bg} ${color.text}`}
                                        >
                                            {TAG_LABELS[tag] || tag}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-heading font-black text-playful-text mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Author & Date */}
                            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                                <Link
                                    href={`/user/${post.profiles?.username || post.author_id}`}
                                    rel="author"
                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                    {post.profiles?.avatar_url ? (
                                        <img
                                            src={post.profiles.avatar_url}
                                            alt={authorName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-lg">
                                            {authorInitial}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-playful-text hover:text-playful-coral transition-colors">{authorName}</p>
                                        <p className="text-sm text-gray-500"><time dateTime={post.created_at}>{postDate}</time></p>
                                        {post.updated_at && new Date(post.updated_at).getTime() > new Date(post.created_at).getTime() && (
                                            <p className="text-xs text-gray-500">Updated <time dateTime={post.updated_at}>{new Date(post.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</time></p>
                                        )}
                                    </div>
                                </Link>
                                {isAuthenticated && post.author_id !== user?.id && (
                                    <Link href={`/messages?to=${encodeURIComponent(post.author_id)}`} className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-playful-coral/10 px-4 py-2 text-sm font-semibold text-playful-coral-text hover:bg-playful-coral/20">
                                        <Mail aria-hidden="true" className="h-4 w-4" />Message
                                    </Link>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mb-8">
                                {post.content && typeof post.content === 'object'
                                    ? <TiptapRenderer content={post.content as Record<string, unknown>} />
                                    : <p className="whitespace-pre-wrap leading-relaxed">{post.content_text}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                {/* Left: Like + Comment count */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleLike}
                                        disabled={!isAuthenticated}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-200 ${userHasLiked
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'
                                            } ${!isAuthenticated ? 'opacity-50 cursor-default' : 'hover:scale-105'}`}
                                    >
                                        <Heart className={`h-5 w-5 ${userHasLiked ? 'fill-current' : ''}`} />
                                        {post.like_count || 0}
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold bg-gray-50 text-gray-500"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        {post.comment_count || 0}
                                    </button>
                                </div>

                                {/* Right: Save + Share */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={!isAuthenticated}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-200 ${userHasSaved
                                            ? 'bg-playful-coral/10 text-playful-coral'
                                            : 'bg-gray-50 text-gray-500 hover:bg-playful-coral/10 hover:text-playful-coral'
                                            } ${!isAuthenticated ? 'opacity-50 cursor-default' : 'hover:scale-105'}`}
                                    >
                                        <Bookmark className={`h-5 w-5 ${userHasSaved ? 'fill-current' : ''}`} />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold bg-gray-50 text-gray-500 hover:bg-playful-cream hover:text-playful-teal transition-all hover:scale-105"
                                    >
                                        <Share2 className="h-5 w-5" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </ScrollReveal>

                <PostComments postId={post.id} />

                {/* Related Posts — Internal Linking for SEO */}
                {relatedPosts.length > 0 && (
                    <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                        <div className="mt-12">
                            <h2 className="text-2xl font-heading font-black text-playful-text mb-6">Related Posts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedPosts.map((rp) => (
                                    <Link
                                        key={rp.id}
                                        href={`/community/${rp.slug}`}
                                        prefetch={false}
                                        className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {rp.featured_image_url && (
                                            <img
                                                src={rp.featured_image_url}
                                                alt={rp.title}
                                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-bold text-sm text-playful-text line-clamp-2 group-hover:text-playful-coral transition-colors">
                                                {rp.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div >
    );
};

export default CommunityPostDetail;
