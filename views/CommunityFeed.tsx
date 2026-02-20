'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PenSquare, Flame, Clock, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PostCard from '@/components/community/PostCard';
import TagFilter from '@/components/community/TagFilter';
import { useCommunityPosts, SortOption } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'hot', label: 'Hot', icon: <Flame className="h-4 w-4" /> },
    { value: 'new', label: 'New', icon: <Clock className="h-4 w-4" /> },
    { value: 'top', label: 'Top', icon: <TrendingUp className="h-4 w-4" /> },
];

const CommunityFeed = () => {
    const searchParams = useSearchParams();
    const initialTag = searchParams.get('tag') || 'all';

    const [activeTag, setActiveTag] = useState(initialTag);
    const [sort, setSort] = useState<SortOption>('new');
    const { isAuthenticated } = useAuth();

    const { data: posts, isLoading, error } = useCommunityPosts({
        tag: activeTag,
        sort,
    });

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-6">
                {/* Hero */}
                <ScrollReveal
                    mode="fade-up"
                    width="100%"
                    className="text-center mb-16 relative"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-coral/20 rounded-full blur-3xl -z-10"></div>
                    <Badge variant="secondary" className="mb-4 bg-playful-yellow text-playful-text hover:bg-playful-yellow/80">
                        Community
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-6 leading-tight">
                        Share Your
                        <span className="relative inline-block ml-4 transform -rotate-2">
                            <span className="absolute inset-0 bg-playful-coral rounded-2xl transform rotate-2"></span>
                            <span className="relative text-white px-6 py-2">Story</span>
                        </span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
                        Join our community of pet lovers 🐾
                    </p>
                </ScrollReveal>

                {/* Controls Bar */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Tag Filters */}
                        <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />

                        <div className="flex items-center gap-3">
                            {/* Sort */}
                            <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-100 p-1">
                                {SORT_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSort(option.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${sort === option.value
                                            ? 'bg-playful-text text-white shadow-sm'
                                            : 'text-gray-500 hover:text-playful-text'
                                            }`}
                                    >
                                        {option.icon}
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {/* Write CTA */}
                            {isAuthenticated && (
                                <Link href="/community/write" prefetch={false}>
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

export default CommunityFeed;
