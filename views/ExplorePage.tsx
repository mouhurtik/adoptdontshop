'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Compass, Users, ArrowRight, Heart, MessageCircle, PawPrint, TrendingUp, X } from 'lucide-react';
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

const SEARCH_SUGGESTIONS = [
    { emoji: '🐕', label: 'Dogs', query: 'dogs' },
    { emoji: '🐱', label: 'Cats', query: 'cats' },
    { emoji: '❤️', label: 'Adoption Stories', query: 'adoption' },
    { emoji: '💡', label: 'Pet Care Tips', query: 'tips' },
    { emoji: '🔍', label: 'Lost & Found', query: 'lost found' },
    { emoji: '🤝', label: 'Volunteering', query: 'volunteering' },
];

const ExplorePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [groups, setGroups] = useState<MiniGroup[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<MiniGroup[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const { data: trendingPosts } = useCommunityPosts({ sort: 'hot', limit: 6 });
    const searchRef = useRef<HTMLDivElement>(null);

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

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSuggestionClick = useCallback((query: string) => {
        setSearchQuery(query);
        setSearchFocused(false);
    }, []);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchFocused(true);
    };

    const showSuggestions = searchFocused && !searchQuery;

    return (
        <div className="pt-4 lg:pt-6 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <ScrollReveal mode="fade-up" width="100%">
                            <div className="mb-5">
                                <h1 className="text-2xl md:text-3xl font-heading font-black text-playful-text flex items-center gap-2">
                                    <Compass className="w-6 h-6 text-purple-500 hidden md:block" />
                                    <span className="bg-purple-100 px-3 py-1 rounded-xl">Explore</span>
                                </h1>
                            </div>
                        </ScrollReveal>

                        {/* Search Bar with Dropdown Suggestions */}
                        <ScrollReveal mode="fade-up" delay={0.05} width="100%" className="mb-6">
                            <div ref={searchRef} className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                <input
                                    type="text"
                                    placeholder="Search communities, posts, pets..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    className={`w-full pl-12 pr-10 py-3.5 bg-white border text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-soft transition-all ${
                                        showSuggestions ? 'rounded-t-2xl rounded-b-none border-purple-200' : 'rounded-2xl border-gray-200'
                                    }`}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Suggestions dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-full left-0 right-0 z-30 bg-white border border-t-0 border-purple-200 rounded-b-2xl shadow-lg overflow-hidden">
                                        <div className="px-4 py-2.5 border-b border-gray-50">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Popular Searches</p>
                                        </div>
                                        {SEARCH_SUGGESTIONS.map(s => (
                                            <button
                                                key={s.query}
                                                onClick={() => handleSuggestionClick(s.query)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-purple-50/50 transition-colors"
                                            >
                                                <span className="text-base">{s.emoji}</span>
                                                <span className="text-sm font-medium text-gray-700">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Active search indicator */}
                        {searchQuery && (
                            <div className="mb-5 flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-medium">Showing results for:</span>
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                    {searchQuery}
                                    <button onClick={clearSearch} className="hover:text-purple-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            </div>
                        )}

                        {/* Communities Section */}
                        <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold text-playful-text flex items-center gap-2">
                                    <Users className="w-5 h-5 text-playful-teal" />
                                    {searchQuery ? 'Matching Communities' : 'Popular Communities'}
                                </h2>
                                <Link
                                    href="/communities"
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
                                            href={`/communities/${group.slug}`}
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
                        <ScrollReveal mode="fade-up" delay={0.15} width="100%">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold text-playful-text flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
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
                        <ScrollReveal mode="fade-up" delay={0.2} width="100%" className="mt-8">
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

                    {/* Right Sidebar */}
                    <ExploreSidebar />
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
