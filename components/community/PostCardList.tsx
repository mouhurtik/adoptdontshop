'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useLikePost, useUserLiked } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { TAG_COLORS, TAG_LABELS, type PostCardData } from './PostCard';

/** Compact list-view card — Reddit-style horizontal layout */
const PostCardList = ({ post }: { post: PostCardData }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { data: liked } = useUserLiked(post.id);
    const likePost = useLikePost();

    const preview = post.content_text.length > 200
        ? post.content_text.slice(0, 200) + '...'
        : post.content_text;

    const timeAgo = getTimeAgo(post.created_at);
    const authorName = post.author?.display_name || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }
        likePost.mutate({ postId: post.id, liked: !!liked });
    };

    return (
        <article
            className="group/post flex gap-1 rounded-[1.5rem] border border-playful-text/10 bg-white p-2 shadow-soft transition-[border-color,box-shadow] duration-200 ease-out hover:border-playful-coral/30 hover:shadow-md motion-reduce:transition-none"
        >
            {/* Thumbnail (if image exists) */}
            {post.featured_image_url && (
                <Link
                    href={`/community/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="block aspect-[4/5] w-24 flex-shrink-0 self-start overflow-hidden rounded-[1rem] bg-playful-cream outline outline-1 -outline-offset-1 outline-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text sm:aspect-square sm:w-32 md:w-40"
                >
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover/post:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        width={176}
                        height={176}
                    />
                </Link>
            )}

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between px-2 py-1 sm:px-3 sm:py-2">
                {/* Top: Tags + Title + Preview */}
                <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.tags.slice(0, 2).map(tag => {
                            const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                            return (
                                <span
                                    key={tag}
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color.bg} ${color.text}`}
                                >
                                    {TAG_LABELS[tag] || tag}
                                </span>
                            );
                        })}
                        <time dateTime={post.created_at} className="text-xs font-medium text-gray-600">{timeAgo}</time>
                    </div>

                    <h3 className="mb-1 font-heading text-base font-extrabold leading-snug text-playful-text md:text-lg">
                        <Link
                            href={`/community/${post.slug}`}
                            className="block min-h-11 rounded-lg py-1 transition-colors duration-150 hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none"
                        >
                            <span className="line-clamp-2 break-words">{post.title}</span>
                        </Link>
                    </h3>
                    <p className="hidden break-words text-sm font-medium leading-relaxed text-gray-600 md:line-clamp-2">
                        {preview}
                    </p>
                </div>

                {/* Bottom: Author + Stats */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    {/* Author */}
                    <div className="flex min-h-11 min-w-0 max-w-full items-center gap-2">
                        {post.author?.avatar_url ? (
                            <img src={post.author.avatar_url} alt="" width={24} height={24} className="h-6 w-6 flex-shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10" />
                        ) : (
                            <span aria-hidden="true" className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-playful-teal/10 text-xs font-bold text-playful-teal-text">
                                {authorInitial}
                            </span>
                        )}
                        <span className="truncate text-xs font-semibold text-gray-700">{authorName}</span>
                    </div>

                    {/* Stats */}
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
                        <span aria-label={`${post.view_count} views`} className="hidden items-center gap-1.5 text-xs font-medium tabular-nums md:flex">
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

export default PostCardList;
