'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Eye } from 'lucide-react';

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
    };
}

const PostCard = ({ post }: { post: PostCardData }) => {
    const router = useRouter();

    const preview = post.content_text.length > 140
        ? post.content_text.slice(0, 140) + '...'
        : post.content_text;

    const timeAgo = getTimeAgo(post.created_at);
    const authorName = post.author?.display_name || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();

    const handleCardClick = () => {
        router.push(`/community/${post.slug}`);
    };

    return (
        <article
            onClick={handleCardClick}
            className="group bg-white rounded-[2rem] shadow-soft border-2 border-transparent hover:border-playful-coral/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col cursor-pointer"
        >
            {/* Featured Image */}
            {post.featured_image_url && (
                <div className="aspect-[16/9] overflow-hidden">
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="p-6 flex flex-col flex-1">
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
                <h3 className="text-xl font-heading font-bold text-playful-text mb-2 group-hover:text-playful-coral transition-colors line-clamp-2">
                    {post.title}
                </h3>

                {/* Preview */}
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-4 flex-1">
                    {preview}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Author */}
                    {post.author_id ? (
                        <Link
                            href={`/user/${post.author_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            {post.author?.avatar_url ? (
                                <img
                                    src={post.author.avatar_url}
                                    alt={authorName}
                                    className="w-7 h-7 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-playful-teal text-white flex items-center justify-center text-xs font-bold">
                                    {authorInitial}
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-600 hover:text-playful-coral transition-colors">{authorName}</span>
                            <span className="text-xs text-gray-400">· {timeAgo}</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            {post.author?.avatar_url ? (
                                <img
                                    src={post.author.avatar_url}
                                    alt={authorName}
                                    className="w-7 h-7 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-playful-teal text-white flex items-center justify-center text-xs font-bold">
                                    {authorInitial}
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-600">{authorName}</span>
                            <span className="text-xs text-gray-400">· {timeAgo}</span>
                        </div>
                    )}

                    {/* Stats only — no action buttons on preview */}
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="flex items-center gap-1 text-xs">
                            <Heart className="h-3.5 w-3.5" /> {post.like_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <MessageCircle className="h-3.5 w-3.5" /> {post.comment_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
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

export { TAG_COLORS, TAG_LABELS };
export default PostCard;
