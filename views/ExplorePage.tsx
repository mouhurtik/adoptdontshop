'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Compass, Users, ArrowRight, Flame, Heart, MessageCircle, PawPrint } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { supabase } from '@/lib/supabase/client';
import { useCommunityPosts } from '@/hooks/useCommunity';
import ExploreSidebar from '@/components/home/HomeSidebar';

interface MiniGroup {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
    member_count: number;
    category: string;
    description: string | null;
}

const QUICK_TAGS = [
    { label: '🐕 Dogs', query: 'dogs' },
    { label: '🐱 Cats', query: 'cats' },
    { label: '📍 Local', query: 'local' },
    { label: '💡 Tips & Care', query: 'tips' },
    { label: '❤️ Adoption', query: 'adoption' },
    { label: '🔍 Lost & Found', query: 'lost found' },
    { label: '🐾 Breed Specific', query: 'breed' },
    { label: '🤝 Volunteering', query: 'volunteering' },
];

const ExplorePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [groups, setGroups] = useState<MiniGroup[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<MiniGroup[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const { data: trendingPosts } = useCommunityPosts({ sort: 'hot', limit: 6 });

    useEffect(() => {
        supabase
            .from('groups')
            .select('id, name, slug, avatar_url, member_count, category, description')
            .order('member_count', { ascending: false })
            .limit(12)
            .then(({ data }) => {
                if (data) {
                    setGroups(data as MiniGroup[]);
                    setFilteredGroups(data as MiniGroup[]);
                }
                setLoadingGroups(false);
            });
    }, []);

    // Filter groups when search changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredGroups(groups);
            return;
        }
        const q = searchQuery.toLowerCase();
        setFilteredGroups(
            groups.filter(g =>
                g.name.toLowerCase().includes(q) ||
                g.category.toLowerCase().includes(q) ||
                (g.description && g.description.toLowerCase().includes(q))
            )
        );
    }, [searchQuery, groups]);

    const handleTagClick = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="pt-4 lg:pt-6 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Same flex layout as homepage — main content + right sidebar */}
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <ScrollReveal mode="fade-up" width="100%">
                            <div className="mb-5">
                                <h1 className="text-2xl md:text-3xl font-heading font-black text-playful-text flex items-center gap-2">
                                    <Compass className="w-6 h-6 text-playful-coral hidden md:block" />
                                    <span className="bg-playful-coral/10 px-3 py-0.5 rounded-xl">Explore</span>
                                </h1>
                            </div>
                        </ScrollReveal>

                        {/* Search Bar */}
                        <ScrollReveal mode="fade-up" delay={0.05} width="100%" className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search communities, posts, pets..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal shadow-soft transition-all"
                                />
                            </div>
                        </ScrollReveal>

                        {/* Quick Tags */}
                        {!searchQuery && (
                            <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="mb-8">
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_TAGS.map(tag => (
                                        <button
                                            key={tag.query}
                                            onClick={() => handleTagClick(tag.query)}
                                            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-playful-teal/5 hover:border-playful-teal/30 hover:text-playful-teal transition-all shadow-sm"
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Communities Section */}
                        <ScrollReveal mode="fade-up" delay={0.15} width="100%" className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold text-playful-text flex items-center gap-2">
                                    <Users className="w-5 h-5 text-playful-teal" />
                                    Communities
                                </h2>
                                <Link
                                    href="/groups"
                                    className="text-sm font-bold text-playful-teal hover:text-playful-teal/80 flex items-center gap-1 transition-colors"
                                >
                                    See All <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {loadingGroups ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-2xl h-24 animate-pulse shadow-sm" />
                                    ))}
                                </div>
                            ) : filteredGroups.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {filteredGroups.slice(0, 6).map(group => (
                                        <Link
                                            key={group.id}
                                            href={`/groups/${group.slug}`}
                                            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-playful-teal/20 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                {group.avatar_url ? (
                                                    <img src={group.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-bold text-sm">
                                                        {group.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-playful-text truncate group-hover:text-playful-teal transition-colors">
                                                    {group.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {group.member_count} members · {group.category}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                                    <p className="text-sm text-gray-400 font-medium">No communities found for &quot;{searchQuery}&quot;</p>
                                </div>
                            )}
                        </ScrollReveal>

                        {/* Trending Posts Section */}
                        <ScrollReveal mode="fade-up" delay={0.2} width="100%">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold text-playful-text flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    Trending Posts
                                </h2>
                            </div>

                            {trendingPosts && trendingPosts.length > 0 ? (
                                <div className="space-y-3">
                                    {trendingPosts.map((post, index) => (
                                        <Link
                                            key={post.id}
                                            href={`/community/${post.slug}`}
                                            className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-playful-coral/20 transition-all group"
                                        >
                                            <span className="text-lg font-black text-gray-200 group-hover:text-playful-coral transition-colors flex-shrink-0 w-6 text-right mt-0.5">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
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
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                                    <p className="text-sm text-gray-400 font-medium">No trending posts yet — be the first to share!</p>
                                </div>
                            )}
                        </ScrollReveal>

                        {/* Browse Pets CTA */}
                        <ScrollReveal mode="fade-up" delay={0.25} width="100%" className="mt-8">
                            <Link
                                href="/browse"
                                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-playful-coral/20 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-playful-coral/10 p-2.5 rounded-xl">
                                        <PawPrint className="w-5 h-5 text-playful-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-playful-text group-hover:text-playful-coral transition-colors">
                                            Browse Pets for Adoption
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Find your perfect furry companion</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-playful-coral transition-colors" />
                            </Link>
                        </ScrollReveal>
                    </div>

                    {/* Right Sidebar — Explore sidebar (pets, trending, groups, quick links) */}
                    <ExploreSidebar />
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
