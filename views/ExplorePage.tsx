'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Compass, ArrowRight, PawPrint, TrendingUp, X } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useCommunityPosts } from '@/hooks/useCommunity';
import ExploreSidebar from '@/components/home/HomeSidebar';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PostCardList from '@/components/community/PostCardList';

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
    const { data: trendingPosts, isLoading } = useCommunityPosts({ sort: 'hot', limit: 12 });
    const searchRef = useRef<HTMLDivElement>(null);

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

    // Filter trending posts by search query
    const filteredPosts = trendingPosts?.filter(post => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(q) ||
            (post.tags && post.tags.some((t: string) => t.toLowerCase().includes(q)));
    });

    return (
        <>
        <SmoothScroll feel="feed" />
        <div className="pt-4 lg:pt-6 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12">
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <ScrollReveal mode="fade-up" width="100%" className="hidden md:block">
                            <div className="mb-5">
                                <h1 className="text-2xl md:text-3xl font-heading font-black text-playful-text flex items-center gap-2">
                                    <span className="bg-purple-300/80 px-4 py-1.5 rounded-2xl flex items-center gap-2">
                                        <Compass className="w-6 h-6 text-purple-700 hidden md:block" />
                                        Explore
                                    </span>
                                </h1>
                            </div>
                        </ScrollReveal>

                        {/* Search Bar with Dropdown Suggestions */}
                        <ScrollReveal mode="fade-up" delay={0.05} width="100%" className="mb-6">
                            <div ref={searchRef} className="relative group">
                                <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 z-10 ${searchFocused ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search posts, communities, pets..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    className={`w-full pl-16 pr-12 py-3.5 bg-white border-2 text-sm md:text-base font-bold placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:border-purple-400 focus:shadow-md transition-all duration-300 ${
                                        showSuggestions ? 'rounded-t-[2rem] rounded-b-none border-purple-200 shadow-sm' : 'rounded-[2rem] md:rounded-full border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md'
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

                        {/* Trending Posts List View */}
                        <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold text-playful-text flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    {searchQuery ? 'Search Results' : 'Trending Posts'}
                                </h2>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-[1.5rem] h-32 sm:h-40 animate-pulse border border-gray-100 shadow-soft" />
                                    ))}
                                </div>
                            ) : filteredPosts && filteredPosts.length > 0 ? (
                                <div className="flex flex-col gap-4" data-explore-feed>
                                    {filteredPosts.map((post, index) => (
                                        <div key={post.id} className="w-full">
                                            <PostCardList post={post} rank={index + 1} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <div className="bg-orange-50 p-4 rounded-2xl w-fit mx-auto mb-3">
                                        <TrendingUp className="w-8 h-8 text-orange-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {searchQuery ? `No posts found for "${searchQuery}"` : 'No trending posts yet — be the first to share!'}
                                    </p>
                                </div>
                            )}
                        </ScrollReveal>

                        {/* Browse Pets CTA */}
                        <ScrollReveal mode="fade-up" delay={0.15} width="100%" className="mt-8">
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

                    {/* Right Sidebar — Communities, Pets, Trending, Quick Links */}
                    <ExploreSidebar />
                </div>
            </div>
        </div>
        </>
    );
};

export default ExplorePage;
