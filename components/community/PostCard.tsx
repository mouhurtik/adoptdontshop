'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useLikePost, useUserLiked } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
    success_story: { bg: 'bg-green-100', text: 'text-green-700' },
    fundraiser: { bg: 'bg-purple-100', text: 'text-purple-700' },
    virtual_adoption: { bg: 'bg-blue-100', text: 'text-blue-700' },
    tips: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    discussion: { bg: 'bg-orange-100', text: 'text-orange-700' },
    lost_found: { bg: 'bg-red-100', text: 'text-red-700' },
};

const TAG_LABELS: Record<string, string> = {
    success_story: 'Success Story',
    fundraiser: 'Fundraiser',
    virtual_adoption: 'Virtual Adoption',
    tips: 'Tips & Advice',
    discussion: 'Discussion',
    lost_found: 'Lost & Found',
};

export interface PostCardData {
    id: string;
    title: string;
    slug: string;
    content_text: string;
    featured_image_url?: string | null;
    tags: string[];
    like_count: number;
    comment_count: number;
    view_count: number;
    created_at: string;
    author_id?: string;
    author?: {
        display_name: string | null;
        avatar_url: string | null;
        username?: string | null;
    };
}

const PostCard = ({ post, priority = false }: { post: PostCardData; priority?: boolean }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { data: liked } = useUserLiked(post.id);
    const likePost = useLikePost();

    const preview = post.content_text.length > 140
        ? post.content_text.slice(0, 140) + '...'
        : post.content_text;

    const timeAgo = getTimeAgo(post.created_at);
    const authorName = post.author?.display_name || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();
    const authorDetails = (
        <>
            {post.author?.avatar_url ? (
                <img
                    src={post.author.avatar_url}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
            ) : (
                <span aria-hidden="true" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-playful-teal/10 text-xs font-bold text-playful-teal-text">
                    {authorInitial}
                </span>
            )}
            <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-700">{authorName}</span>
                <time dateTime={post.created_at} className="block text-xs font-medium text-gray-600">{timeAgo}</time>
            </span>
        </>
    );

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            router.push('/login');
            return;
        }
        likePost.mutate({ postId: post.id, liked: !!liked });
    };

    return (
        <article
            className="group/post flex h-full flex-col rounded-[2rem] border border-playful-text/10 bg-white p-2 shadow-soft transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-playful-coral/30 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
        >
            {/* Featured Image */}
            {post.featured_image_url && (
                <Link
                    href={`/community/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="block aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-playful-cream outline outline-1 -outline-offset-1 outline-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text"
                >
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover/post:scale-[1.02]"
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        {...(priority ? { fetchPriority: "high" as const } : {})}
                        width={658}
                        height={370}
                    />
                </Link>
            )}

            <div className="flex flex-1 flex-col px-4 pb-3 pt-4 sm:px-5 sm:pb-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => {
                        const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                        return (
                            <span
                                key={tag}
                                className={`text-xs font-bold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}
                            >
                                {TAG_LABELS[tag] || tag}
                            </span>
                        );
                    })}
                </div>

                {/* Title */}
                <h3 className="mb-2 font-heading text-xl font-extrabold leading-snug text-playful-text">
                    <Link
                        href={`/community/${post.slug}`}
                        className="block min-h-11 rounded-lg py-1 transition-colors duration-150 hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none"
                    >
                        <span className="line-clamp-2 break-words">{post.title}</span>
                    </Link>
                </h3>

                {/* Preview */}
                <p className="mb-5 flex-1 break-words text-sm font-medium leading-relaxed text-gray-600">
                    {preview}
                </p>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-playful-text/10 pt-3">
                    {/* Author */}
                    {post.author_id ? (
                        <Link
                            href={`/user/${post.author?.username || post.author_id}`}
                            className="flex min-h-11 min-w-0 max-w-full items-center gap-2 rounded-lg transition-colors duration-150 hover:bg-playful-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none"
                        >
                            {authorDetails}
                        </Link>
                    ) : (
                        <div className="flex min-h-11 min-w-0 max-w-full items-center gap-2">
                            {authorDetails}
                        </div>
                    )}

                    {/* Stats with interactive like */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <button
                            type="button"
                            onClick={handleLike}
                            aria-label={`${liked ? 'Unlike' : 'Like'} ${post.title}`}
                            aria-pressed={!!liked}
                            className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-xs transition-colors duration-150 hover:bg-playful-cream hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none ${
                                liked ? 'text-playful-coral-text' : 'text-gray-600'
                            }`}
                            title={liked ? 'Unlike' : 'Like'}
                        >
                            <Heart aria-hidden="true" className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                            <span className="font-semibold tabular-nums">{post.like_count}</span>
                        </button>
                        <span aria-label={`${post.comment_count} comments`} className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                            <MessageCircle aria-hidden="true" className="h-4 w-4" /> {post.comment_count}
                        </span>
                        <span aria-label={`${post.view_count} views`} className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                            <Eye aria-hidden="true" className="h-4 w-4" /> {post.view_count}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

function getTimeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export { TAG_COLORS, TAG_LABELS };
export default PostCard;
