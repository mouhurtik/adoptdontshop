'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Flame, Clock, TrendingUp, ChevronDown, LayoutGrid, List, PenSquare } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, Suspense } from 'react';
import PostCard from '@/components/community/PostCard';
import PostCardList from '@/components/community/PostCardList';
import TagFilter from '@/components/community/TagFilter';
import TrendingSidebar from '@/components/community/TrendingSidebar';
import HomeSidebar from '@/components/home/HomeSidebar';
import { useCommunityPosts, SortOption } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'hot', label: 'Hot', icon: <Flame className="h-4 w-4" /> },
    { value: 'new', label: 'New', icon: <Clock className="h-4 w-4" /> },
    { value: 'top', label: 'Top', icon: <TrendingUp className="h-4 w-4" /> },
];

interface CommunityFeedInnerProps {
    variant?: 'home' | 'page';
}

const CommunityFeedInner = ({ variant = 'page' }: CommunityFeedInnerProps) => {
    const searchParams = useSearchParams();
    const initialTag = searchParams.get('tag') || 'all';

    const [activeTag, setActiveTag] = useState(initialTag);
    const [sort, setSort] = useState<SortOption>('new');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

    const isHome = variant === 'home';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: posts, isLoading, error } = useCommunityPosts({
        tag: activeTag,
        sort,
    });

    return (
        <div className={`${isHome ? 'pt-4 lg:pt-6' : 'pt-4 lg:pt-8'} pb-16 bg-playful-cream min-h-screen`}>
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Header — Compact bar for home, full hero for standalone page */}
                {isHome ? (
                    /* Home: no hero, just a subtle heading */
                    null
                ) : (
                    /* Full Hero for standalone /community page (if accessed via other means) */
                    <ScrollReveal
                        mode="fade-up"
                        width="100%"
                        className="text-center mb-10 lg:mb-16 relative"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-coral/20 rounded-full blur-3xl -z-10"></div>
                        <Badge variant="secondary" className="mb-4 bg-playful-yellow text-playful-text hover:bg-playful-yellow/80 hidden md:inline-flex">
                            Community
                        </Badge>
                        <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-4 lg:mb-6 leading-tight">
                            Share Your
                            <span className="relative inline-block ml-3 lg:ml-4 transform -rotate-2">
                                <span className="absolute inset-0 bg-playful-coral rounded-xl lg:rounded-2xl transform rotate-2"></span>
                                <span className="relative text-white px-4 lg:px-6 py-1 lg:py-2">Story</span>
                            </span>
                        </h1>
                        <p className="text-lg md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-4 lg:mt-8 font-heading">
                            Join our community of pet lovers 🐾
                        </p>
                    </ScrollReveal>
                )}

                {/* Controls Bar */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="mb-8">
                    <div className="flex flex-row items-center justify-between gap-3 relative z-40">
                        {/* Tag Filters */}
                        <div className="flex-shrink-0">
                            <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-playful-cream rounded-full text-sm font-bold text-playful-text shadow-sm hover:border-playful-yellow/50 transition-colors"
                                >
                                    {SORT_OPTIONS.find(o => o.value === sort)?.icon}
                                    {SORT_OPTIONS.find(o => o.value === sort)?.label}
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full mt-1.5 right-0 z-50 w-[130px] bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[1.25rem] p-1.5 origin-top-right"
                                        >
                                            {SORT_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { setSort(option.value); setIsSortOpen(false); }}
                                                    className="w-full text-left px-3 py-2.5 rounded-xl transition-colors duration-150 flex items-center justify-between group hover:bg-playful-cream/50"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className={`${sort === option.value ? 'text-playful-text' : 'text-gray-500'}`}>{option.icon}</span>
                                                        <span className={`text-sm font-bold ${sort === option.value ? 'text-playful-coral' : 'text-gray-600 group-hover:text-playful-text'}`}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    {sort === option.value && <div className="w-1.5 h-1.5 rounded-full bg-playful-coral" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden md:flex items-center bg-white border-2 border-playful-cream rounded-full p-0.5 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition-all duration-200 ${viewMode === 'grid' ? 'bg-playful-coral text-white shadow-sm' : 'text-gray-400 hover:text-playful-text'}`}
                                    title="Grid view"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-full transition-all duration-200 ${viewMode === 'list' ? 'bg-playful-coral text-white shadow-sm' : 'text-gray-400 hover:text-playful-text'}`}
                                    title="List view"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Write CTA (only on standalone page or hidden on home since we have the bar) */}
                            {!isHome && isAuthenticated && (
                                <Link href="/community/write" prefetch={false} className="hidden md:block">
                                    <PrimaryButton size="md" className="shadow-lg hover:shadow-xl">
                                        <PenSquare className="h-4 w-4 mr-2" />
                                        Write
                                    </PrimaryButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Posts Grid + Sidebar Layout */}
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
                                {[...Array(viewMode === 'grid' ? 6 : 4)].map((_, i) => (
                                    <div key={i} className={`bg-white animate-pulse shadow-soft ${viewMode === 'grid' ? 'rounded-[2rem] h-80' : 'rounded-2xl h-28'}`} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-xl font-bold text-red-500 mb-2">Something went wrong</p>
                                <p className="text-gray-500">Please try again later.</p>
                            </div>
                        ) : posts && posts.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {posts.map((post, index) => (
                                        <ScrollReveal key={post.id} mode="fade-up" delay={index * 0.05} width="100%">
                                            <PostCard post={post} />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {posts.map((post, index) => (
                                        <ScrollReveal key={post.id} mode="fade-up" delay={index * 0.03} width="100%">
                                            <PostCardList post={post} />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )
                        ) : (
                            <ScrollReveal mode="fade-up" width="100%">
                                <div className="text-center py-20">
                                    <div className="bg-playful-yellow p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full shadow-lg text-white transform -rotate-6">
                                        <PenSquare className="h-12 w-12" />
                                    </div>
                                    <h2 className="text-3xl font-heading font-black text-playful-text mb-4">
                                        No posts yet!
                                    </h2>
                                    <p className="text-xl text-gray-500 font-medium mb-8 max-w-md mx-auto">
                                        Be the first to share something with the community.
                                    </p>
                                    {isAuthenticated ? (
                                        <Link href="/community/write" prefetch={false}>
                                            <PrimaryButton size="lg" className="text-lg px-10">
                                                <PenSquare className="h-5 w-5 mr-2" />
                                                Write the First Post
                                            </PrimaryButton>
                                        </Link>
                                    ) : (
                                        <Link href="/login" prefetch={false}>
                                            <PrimaryButton size="lg" className="text-lg px-10">
                                                Sign In to Post
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            </ScrollReveal>
                        )}
                    </div>

                    {/* Sidebar — HomeSidebar on homepage, TrendingSidebar on standalone */}
                    {isHome ? (
                        <HomeSidebar />
                    ) : (
                        <TrendingSidebar activeTag={activeTag} onTagChange={setActiveTag} />
                    )}

                </div>
            </div>
        </div>
    );
};

interface CommunityFeedProps {
    variant?: 'home' | 'page';
}

const CommunityFeed = ({ variant = 'page' }: CommunityFeedProps) => (
    <Suspense fallback={<div className="min-h-screen pt-4 lg:pt-8 pb-16 bg-playful-cream" />}>
        <CommunityFeedInner variant={variant} />
    </Suspense>
);

export default CommunityFeed;
