'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { useLikePost, useUserLiked } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { TAG_COLORS, TAG_LABELS, type PostCardData } from './PostCard';

interface PostCardListProps {
    post: PostCardData;
    rank?: number;
}

/** List-view card — Reddit-style horizontal layout */
const PostCardList = ({ post, rank }: PostCardListProps) => {
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
    const authorHref = post.author?.username
        ? `/user/${post.author.username}`
        : post.author_id
            ? `/user/${post.author_id}`
            : null;

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }
        likePost.mutate({ postId: post.id, liked: !!liked });
    };

    const authorContent = (
        <>
            {post.author?.avatar_url ? (
                <img
                    src={post.author.avatar_url}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
            ) : (
                <span aria-hidden="true" className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-playful-teal/10 text-xs font-bold text-playful-teal-text">
                    {authorInitial}
                </span>
            )}
            <span className="truncate text-xs sm:text-sm font-semibold text-gray-700">{authorName}</span>
        </>
    );

    return (
        <article
            className="group/post flex gap-3 sm:gap-4 rounded-[1.5rem] border border-playful-text/10 bg-white p-3 sm:p-4 shadow-soft transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-playful-coral/30 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
        >
            {/* Thumbnail (if image exists) */}
            {post.featured_image_url && (
                <Link
                    href={`/community/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="block aspect-[4/5] w-28 sm:aspect-square sm:w-36 md:w-44 lg:w-48 flex-shrink-0 self-start overflow-hidden rounded-[1.2rem] bg-playful-cream outline outline-1 -outline-offset-1 outline-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text"
                >
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover/post:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                        width={192}
                        height={192}
                    />
                </Link>
            )}

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 sm:py-1">
                {/* Top: Rank + Tags + Time + Title + Preview */}
                <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {rank !== undefined && (
                            <span
                                aria-label={`Rank ${rank}`}
                                className="flex-shrink-0 rounded-lg bg-orange-100 px-2 py-0.5 text-xs font-black text-orange-600"
                            >
                                #{rank}
                            </span>
                        )}
                        {post.tags.slice(0, 2).map(tag => {
                            const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                            return (
                                <span
                                    key={tag}
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color.bg} ${color.text}`}
                                >
                                    {TAG_LABELS[tag] || tag}
                                </span>
                            );
                        })}
                        <time dateTime={post.created_at} className="text-xs font-medium text-gray-500">{timeAgo}</time>
                    </div>

                    <h3 className="mb-1.5 font-heading text-base font-extrabold leading-snug text-playful-text sm:text-lg md:text-xl">
                        <Link
                            href={`/community/${post.slug}`}
                            className="block rounded-lg py-0.5 transition-colors duration-150 hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none"
                        >
                            <span className="line-clamp-2 break-words">{post.title}</span>
                        </Link>
                    </h3>
                    <p className="mt-1 line-clamp-1 break-words text-xs font-medium leading-relaxed text-gray-600 sm:line-clamp-2 sm:text-sm">
                        {preview}
                    </p>
                </div>

                {/* Bottom: Author + Stats */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-2 border-t border-gray-100/80">
                    {/* Author */}
                    <div className="flex min-h-11 min-w-0 max-w-full items-center gap-2">
                        {authorHref ? (
                            <Link
                                href={authorHref}
                                className="flex items-center gap-2 rounded-full transition-colors hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text"
                            >
                                {authorContent}
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                {authorContent}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <button
                            type="button"
                            onClick={handleLike}
                            aria-label={`${liked ? 'Unlike' : 'Like'} ${post.title}`}
                            aria-pressed={!!liked}
                            className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors duration-150 hover:bg-playful-cream hover:text-playful-coral-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none ${
                                liked ? 'text-playful-coral-text' : 'text-gray-600'
                            }`}
                            title={liked ? 'Unlike' : 'Like'}
                        >
                            <Heart aria-hidden="true" className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                            <span className="tabular-nums">{post.like_count}</span>
                        </button>
                        <span aria-label={`${post.comment_count} comments`} className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                            <MessageCircle aria-hidden="true" className="h-4 w-4" /> {post.comment_count}
                        </span>
                        <span aria-label={`${post.view_count} views`} className="hidden items-center gap-1.5 text-xs font-medium tabular-nums sm:flex">
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
