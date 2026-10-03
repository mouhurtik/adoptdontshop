'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Flame, Clock, TrendingUp, ChevronDown, LayoutGrid, List, PenSquare } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useEffect, useRef, Suspense } from 'react';
import PostCard from '@/components/community/PostCard';
import TagFilter from '@/components/community/TagFilter';
import { useCommunityPosts, SortOption } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

// Lazy-load components not needed for initial LCP
const PostCardList = dynamic(() => import('@/components/community/PostCardList'), { ssr: false });
const TrendingSidebar = dynamic(() => import('@/components/community/TrendingSidebar'), { ssr: false });
const HomeRightSidebar = dynamic(() => import('@/components/home/HomeRightSidebar'), { ssr: false });
const Badge = dynamic(() => import('@/components/ui/badge').then(m => ({ default: m.Badge })), { ssr: false });

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'hot', label: 'Hot', icon: <Flame className="h-4 w-4" /> },
    { value: 'new', label: 'New', icon: <Clock className="h-4 w-4" /> },
    { value: 'top', label: 'Top', icon: <TrendingUp className="h-4 w-4" /> },
];

interface CommunityFeedInnerProps {
    variant?: 'home' | 'page';
    initialPosts?: import('@/components/community/PostCard').PostCardData[];
}

const CommunityFeedInner = ({ variant = 'page', initialPosts: initialPostsProp }: CommunityFeedInnerProps) => {
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
        initialData: initialPostsProp,
    });

    return (
        <div className={`${isHome ? 'pt-4 lg:pt-6' : 'pt-4 lg:pt-8'} pb-16 bg-playful-cream min-h-screen`}>
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12">
                {/* Header — Compact bar for home, full hero for standalone page */}
                {isHome ? (
                    <h1 className="sr-only">The AdoptDontShop Community — Free Rescue Pet Adoption & Animal Care India</h1>
                ) : (
                    <div className="text-center mb-10 lg:mb-16 relative">
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
                    </div>
                )}

                {/* Controls Bar */}
                        <div className="mb-8">
                            <div className="flex flex-row items-center justify-between gap-3 relative z-40">
                                <div className="flex-shrink-0">
                                    <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                    {/* Sort Dropdown */}
                                    <div className="relative" ref={sortDropdownRef}>
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-xl md:rounded-2xl border border-gray-200 text-xs md:text-sm font-bold text-playful-text hover:border-playful-coral transition-colors shadow-soft"
                                        >
                                            {SORT_OPTIONS.find(o => o.value === sort)?.icon}
                                            <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isSortOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                                {SORT_OPTIONS.map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setSort(option.value);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs md:text-sm font-bold transition-colors ${
                                                            sort === option.value
                                                                ? 'text-playful-coral bg-playful-cream/50'
                                                                : 'text-gray-600 hover:text-playful-text hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {option.icon}
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* View Mode Toggle */}
                                    <div className="hidden sm:flex items-center bg-white rounded-2xl border border-gray-200 p-1 shadow-soft">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-xl transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-playful-coral text-white'
                                                    : 'text-gray-400 hover:text-playful-text'
                                            }`}
                                            title="Grid View"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-xl transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-playful-coral text-white'
                                                    : 'text-gray-400 hover:text-playful-text'
                                            }`}
                                            title="List View"
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Write CTA on standalone page */}
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
                        </div>

                        {/* Posts Grid + Sidebar Layout */}
                        <div className="flex gap-8">
                            <div className="flex-1 min-w-0">
                                {isLoading ? (
                                    <div className="flex flex-col gap-5">
                                        {[...Array(4)].map((_, i) => (
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
                                        <div className="flex flex-col gap-5">
                                            {posts.map((post, index) => (
                                                <div key={post.id} className="w-full">
                                                    <PostCard post={post} priority={index === 0 && !!post.featured_image_url} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {posts.map((post) => (
                                                <div key={post.id} className="w-full">
                                                    <PostCardList post={post} />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
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
                                )}
                            </div>

                            {/* Sidebar */}
                            {isHome ? (
                                <HomeRightSidebar />
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
    initialPosts?: import('@/components/community/PostCard').PostCardData[];
}

const CommunityFeed = ({ variant = 'page', initialPosts }: CommunityFeedProps) => (
    <Suspense fallback={<div className="min-h-screen pt-4 lg:pt-8 pb-16 bg-playful-cream" />}>
        <CommunityFeedInner variant={variant} initialPosts={initialPosts} />
    </Suspense>
);

export default CommunityFeed;
