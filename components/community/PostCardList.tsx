'use client';

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

    const handleClick = () => router.push(`/community/${post.slug}`);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }
        likePost.mutate({ postId: post.id, liked: !!liked });
    };

    return (
        <article
            onClick={handleClick}
            className="group bg-white rounded-2xl shadow-soft border-2 border-transparent hover:border-playful-coral/20 transition-all duration-300 hover:shadow-md cursor-pointer flex overflow-hidden"
        >
            {/* Thumbnail (if image exists) */}
            {post.featured_image_url && (
                <div className="w-32 md:w-44 flex-shrink-0 overflow-hidden">
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between min-w-0">
                {/* Top: Tags + Title + Preview */}
                <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.tags.slice(0, 2).map(tag => {
                            const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                            return (
                                <span
                                    key={tag}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                                >
                                    {TAG_LABELS[tag] || tag}
                                </span>
                            );
                        })}
                        <span className="text-[10px] text-gray-400">· {timeAgo}</span>
                    </div>

                    <h3 className="text-base md:text-lg font-heading font-bold text-playful-text mb-1 group-hover:text-playful-coral transition-colors line-clamp-1">
                        {post.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 hidden md:block">
                        {preview}
                    </p>
                </div>

                {/* Bottom: Author + Stats */}
                <div className="flex items-center justify-between mt-3">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        {post.author?.avatar_url ? (
                            <img src={post.author.avatar_url} alt={authorName} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-playful-teal text-white flex items-center justify-center text-[9px] font-bold">
                                {authorInitial}
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-500">{authorName}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-400">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 text-xs transition-all duration-200 hover:scale-110 active:scale-95 ${
                                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                            }`}
                        >
                            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{post.like_count}</span>
                        </button>
                        <span className="flex items-center gap-1 text-xs">
                            <MessageCircle className="h-3.5 w-3.5" /> {post.comment_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs hidden md:flex">
                            <Eye className="h-3.5 w-3.5" /> {post.view_count}
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
