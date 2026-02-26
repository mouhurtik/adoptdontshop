'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Heart, Share2, MessageCircle, Send, Loader2, Mail, Bookmark } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
const TiptapRenderer = dynamic(() => import('@/components/community/TiptapRenderer'), { ssr: false });
import { TAG_LABELS, TAG_COLORS } from '@/components/community/PostCard';
import { useCommunityPost, usePostComments, useLikePost, useUserLiked, useAddComment, useSavePost, useUserSavedPost, useRelatedPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPostDetailProps {
    slug: string;
}

const CommunityPostDetail = ({ slug }: CommunityPostDetailProps) => {
    const { isAuthenticated, user } = useAuth();
    const { data: post, isLoading, error } = useCommunityPost(slug);
    const { data: comments = [] } = usePostComments(post?.id);
    const { data: userHasLiked = false } = useUserLiked(post?.id);
    const { data: userHasSaved = false } = useUserSavedPost(post?.id);
    const likePost = useLikePost();
    const savePost = useSavePost();
    const addComment = useAddComment();
    const { data: relatedPosts = [] } = useRelatedPosts(post?.id, post?.tags as string[] | undefined);

    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleLike = () => {
        if (!isAuthenticated || !post) return;
        likePost.mutate({ postId: post.id, liked: userHasLiked });
    };

    const handleSave = () => {
        if (!isAuthenticated || !post) return;
        savePost.mutate({ postId: post.id, saved: userHasSaved });
    };

    const handleComment = async () => {
        if (!commentText.trim() || !post) return;
        try {
            await addComment.mutateAsync({
                postId: post.id,
                content: commentText.trim(),
            });
            setCommentText('');
        } catch (err) {
            console.error('Comment error:', err);
        }
    };

    const handleReply = async (parentId: string) => {
        if (!replyText.trim() || !post) return;
        try {
            await addComment.mutateAsync({
                postId: post.id,
                content: replyText.trim(),
                parentId,
            });
            setReplyText('');
            setReplyingTo(null);
        } catch (err) {
            console.error('Reply error:', err);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: post?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded-full" />
                        <div className="h-12 w-3/4 bg-gray-200 rounded-2xl" />
                        <div className="h-64 bg-gray-200 rounded-[2rem]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
                <div className="container mx-auto px-6 text-center">
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

    // Separate top-level and reply comments
    const topLevel = comments.filter((c: Record<string, unknown>) => !c.parent_comment_id);
    const replies = comments.filter((c: Record<string, unknown>) => c.parent_comment_id);

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            {/* BlogPosting structured data for Google rich results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
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
            <div className="container mx-auto px-6 max-w-4xl">
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
                                        <p className="text-sm text-gray-400">{postDate}</p>
                                    </div>
                                </Link>
                                {isAuthenticated && post.author_id !== user?.id && (
                                    <button
                                        onClick={() => {
                                            window.dispatchEvent(
                                                new CustomEvent('open-floating-chat', {
                                                    detail: { recipientId: post.author_id },
                                                })
                                            );
                                        }}
                                        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-playful-coral/10 text-playful-coral font-bold text-sm hover:bg-playful-coral/20 transition-colors"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Message
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mb-8">
                                <TiptapRenderer content={post.content as Record<string, unknown>} />
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

                {/* Comments Section */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="mt-10">
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft">
                        <h2 className="text-2xl font-heading font-bold text-playful-text mb-6">
                            Comments ({comments.length})
                        </h2>

                        {/* Add Comment */}
                        {isAuthenticated ? (
                            <div className="flex gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        className="w-full bg-playful-cream/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral/50 transition-all"
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <PrimaryButton
                                            size="sm"
                                            onClick={handleComment}
                                            disabled={!commentText.trim() || addComment.isPending}
                                        >
                                            {addComment.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-1" />
                                                    Comment
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 mb-6 bg-playful-cream/50 rounded-xl">
                                <Link href="/login" prefetch={false} className="text-playful-coral font-bold hover:underline">
                                    Sign in
                                </Link>
                                <span className="text-gray-500"> to join the conversation</span>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {topLevel.length === 0 ? (
                                <p className="text-center text-gray-400 font-medium py-8">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            ) : (
                                topLevel.map((comment: Record<string, unknown>) => {
                                    const cAuthor = comment.profiles as Record<string, unknown> | null;
                                    const cName = (cAuthor?.display_name as string) || 'Anonymous';
                                    const cInitial = cName.charAt(0).toUpperCase();
                                    const cReplies = replies.filter(
                                        (r: Record<string, unknown>) => r.parent_comment_id === comment.id
                                    );
                                    const commentTime = new Date(comment.created_at as string).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric',
                                    });

                                    return (
                                        <div key={comment.id as string} className="group">
                                            <div className="flex gap-3">
                                                {cAuthor?.avatar_url ? (
                                                    <img
                                                        src={cAuthor.avatar_url as string}
                                                        alt={cName}
                                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-playful-mint text-green-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                        {cInitial}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-sm text-playful-text">{cName}</span>
                                                        <span className="text-xs text-gray-400">{commentTime}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {comment.content as string}
                                                    </p>
                                                    {isAuthenticated && (
                                                        <button
                                                            onClick={() => setReplyingTo(
                                                                replyingTo === (comment.id as string) ? null : comment.id as string
                                                            )}
                                                            className="text-xs font-bold text-gray-400 hover:text-playful-coral mt-1 transition-colors"
                                                        >
                                                            Reply
                                                        </button>
                                                    )}

                                                    {/* Reply form */}
                                                    {replyingTo === (comment.id as string) && (
                                                        <div className="flex gap-2 mt-3">
                                                            <input
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                placeholder="Write a reply..."
                                                                className="flex-1 bg-playful-cream/50 border border-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30"
                                                            />
                                                            <button
                                                                onClick={() => handleReply(comment.id as string)}
                                                                disabled={!replyText.trim()}
                                                                className="px-3 py-2 bg-playful-coral text-white rounded-lg text-sm font-bold hover:bg-coral-600 transition-colors disabled:opacity-50"
                                                            >
                                                                <Send className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Replies */}
                                                    {cReplies.length > 0 && (
                                                        <div className="mt-4 ml-2 pl-4 border-l-2 border-gray-100 space-y-4">
                                                            {cReplies.map((reply: Record<string, unknown>) => {
                                                                const rAuthor = reply.profiles as Record<string, unknown> | null;
                                                                const rName = (rAuthor?.display_name as string) || 'Anonymous';
                                                                const rInitial = rName.charAt(0).toUpperCase();
                                                                const replyTime = new Date(reply.created_at as string).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric',
                                                                });
                                                                return (
                                                                    <div key={reply.id as string} className="flex gap-2">
                                                                        <div className="w-7 h-7 rounded-full bg-playful-lavender text-purple-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                                                            {rInitial}
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                                <span className="font-bold text-xs text-playful-text">{rName}</span>
                                                                                <span className="text-[10px] text-gray-400">{replyTime}</span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-600">{reply.content as string}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </ScrollReveal>

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
