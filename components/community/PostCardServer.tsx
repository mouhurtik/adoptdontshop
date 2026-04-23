import Link from 'next/link';

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

export interface ServerPostCardData {
    id: string;
    title: string;
    slug: string;
    content_text: string | null;
    featured_image_url: string | null;
    tags: string[] | null;
    like_count: number;
    comment_count: number;
    view_count: number;
    created_at: string;
    author_name: string | null;
    author_avatar: string | null;
    author_username: string | null;
}

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

export default function PostCardServer({ post }: { post: ServerPostCardData }) {
    const preview = post.content_text && post.content_text.length > 140
        ? post.content_text.slice(0, 140) + '...'
        : (post.content_text || '');

    const timeAgo = getTimeAgo(post.created_at);
    const authorName = post.author_name || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();

    return (
        <article className="group bg-white rounded-[2rem] shadow-soft border-2 border-transparent hover:border-playful-coral/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
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
                    {(post.tags || []).map((tag) => {
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
                <Link href={`/community/${post.slug}`} className="block">
                    <h3 className="text-xl font-heading font-bold text-playful-text mb-2 group-hover:text-playful-coral transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                {/* Preview */}
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-4 flex-1">
                    {preview}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        {post.author_avatar ? (
                            <img
                                src={post.author_avatar}
                                alt={authorName}
                                className="w-7 h-7 rounded-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-playful-teal text-white flex items-center justify-center text-xs font-bold">
                                {authorInitial}
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-600">{authorName}</span>
                        <span className="text-xs text-gray-400">· {timeAgo}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            {post.like_count}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                            {post.comment_count}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            {post.view_count}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}
