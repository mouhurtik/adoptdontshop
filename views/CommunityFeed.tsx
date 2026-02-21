'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PenSquare, Flame, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, Suspense } from 'react';
import PostCard from '@/components/community/PostCard';
import TagFilter from '@/components/community/TagFilter';
import { useCommunityPosts, SortOption } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'hot', label: 'Hot', icon: <Flame className="h-4 w-4" /> },
    { value: 'new', label: 'New', icon: <Clock className="h-4 w-4" /> },
    { value: 'top', label: 'Top', icon: <TrendingUp className="h-4 w-4" /> },
];

const CommunityFeedInner = () => {
    const searchParams = useSearchParams();
    const initialTag = searchParams.get('tag') || 'all';

    const [activeTag, setActiveTag] = useState(initialTag);
    const [sort, setSort] = useState<SortOption>('new');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

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
        <div className="pt-6 lg:pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-6">
                {/* Hero */}
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

                            {/* Write CTA */}
                            {isAuthenticated && (
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

                {/* Posts Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse shadow-soft" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-xl font-bold text-red-500 mb-2">Something went wrong</p>
                        <p className="text-gray-500">Please try again later.</p>
                    </div>
                ) : posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <ScrollReveal key={post.id} mode="fade-up" delay={index * 0.05} width="100%">
                                <PostCard post={post} />
                            </ScrollReveal>
                        ))}
                    </div>
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
        </div>
    );
};

const CommunityFeed = () => (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-16 bg-playful-cream" />}>
        <CommunityFeedInner />
    </Suspense>
);

export default CommunityFeed;
