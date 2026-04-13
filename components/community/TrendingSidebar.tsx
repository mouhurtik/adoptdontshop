'use client';

import Link from 'next/link';
import { Flame, TrendingUp, Hash, Heart, MessageCircle, Users } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { TAG_LABELS, TAG_COLORS } from './PostCard';

const POPULAR_TAGS = ['success_story', 'tips', 'discussion', 'fundraiser', 'lost_found'];

interface TrendingSidebarProps {
    activeTag: string;
    onTagChange: (tag: string) => void;
}

const TrendingSidebar = ({ activeTag, onTagChange }: TrendingSidebarProps) => {
    const { data: trendingPosts } = useCommunityPosts({ sort: 'hot', limit: 5 });

    return (
        <aside className="hidden xl:block w-[300px] flex-shrink-0 space-y-6 sticky top-8 self-start">
            {/* Trending Posts */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-coral/5 to-transparent">
                    <div className="bg-playful-coral/10 p-1.5 rounded-lg">
                        <Flame className="w-4 h-4 text-playful-coral" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Trending Posts</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {trendingPosts && trendingPosts.length > 0 ? (
                        trendingPosts.slice(0, 5).map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.slug}`}
                                className="flex items-start gap-3 px-5 py-3.5 hover:bg-playful-cream/30 transition-colors group"
                            >
                                <span className="text-lg font-black text-gray-200 group-hover:text-playful-coral transition-colors flex-shrink-0 w-6 text-right">
                                    {index + 1}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-playful-text line-clamp-2 group-hover:text-playful-coral transition-colors leading-snug">
                                        {post.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" /> {post.like_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" /> {post.comment_count}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="px-5 py-6 text-center text-sm text-gray-400">
                            No trending posts yet
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-teal/5 to-transparent">
                    <div className="bg-playful-teal/10 p-1.5 rounded-lg">
                        <Hash className="w-4 h-4 text-playful-teal" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Popular Topics</h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                    {POPULAR_TAGS.map(tag => {
                        const isActive = activeTag === tag;
                        const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                        return (
                            <button
                                key={tag}
                                onClick={() => onTagChange(tag)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${
                                    isActive
                                        ? `${color.bg} ${color.text} ring-2 ring-offset-1 ring-current scale-105`
                                        : `bg-gray-50 text-gray-500 hover:${color.bg} hover:${color.text}`
                                }`}
                            >
                                {TAG_LABELS[tag] || tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="bg-purple-50 p-1.5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Community</h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" /> Pet Lovers
                        </span>
                        <span className="text-sm font-bold text-playful-text">Growing 🌱</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-gray-400" /> Status
                        </span>
                        <span className="text-xs font-bold bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full">Active</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default TrendingSidebar;
