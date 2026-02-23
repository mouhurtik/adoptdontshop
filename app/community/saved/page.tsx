'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Bookmark, PawPrint, ArrowLeft } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PawprintLoader from '@/components/ui/PawprintLoader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { format } from 'date-fns';

interface SavedPost {
    id: string;
    created_at: string;
    community_posts: {
        id: string;
        title: string;
        slug: string;
        tags: string[];
        like_count: number;
        comment_count: number;
        created_at: string;
        featured_image_url: string | null;
    };
}

export default function SavedPostsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchSavedPosts = async () => {
            const { data } = await supabase
                .from('saved_posts')
                .select('id, created_at, community_posts:post_id(id, title, slug, tags, like_count, comment_count, created_at, featured_image_url)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }) as { data: SavedPost[] | null };

            if (data) setSavedPosts(data);
            setLoading(false);
        };

        fetchSavedPosts();
    }, [user]);

    const handleUnsave = async (savedPostId: string) => {
        await supabase.from('saved_posts').delete().eq('id', savedPostId);
        setSavedPosts(prev => prev.filter(sp => sp.id !== savedPostId));
    };

    if (authLoading || loading) {
        return <PawprintLoader fullScreen size="lg" message="Loading saved posts..." />;
    }

    if (!user) {
        return (
            <div className="pt-32 pb-16 min-h-screen bg-playful-cream flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Please sign in to see your saved posts.</p>
                    <Link href="/login?redirect=/community/saved">
                        <PrimaryButton>Sign In</PrimaryButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-4 max-w-3xl">
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="flex items-center gap-3 mb-8">
                        <Link href="/profile" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-heading font-black text-playful-text flex items-center gap-2">
                            <Bookmark className="w-7 h-7 text-purple-500" />
                            Saved Posts
                        </h1>
                    </div>
                </ScrollReveal>

                {savedPosts.length === 0 ? (
                    <ScrollReveal mode="fade-up" width="100%">
                        <div className="bg-white rounded-[2rem] p-12 shadow-soft text-center">
                            <PawPrint className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold">No saved posts yet</p>
                            <p className="text-gray-400 text-sm mt-1">Bookmark posts from the community feed to save them here.</p>
                            <Link href="/community" className="mt-4 inline-block">
                                <PrimaryButton size="sm">Browse Community</PrimaryButton>
                            </Link>
                        </div>
                    </ScrollReveal>
                ) : (
                    <div className="space-y-4">
                        {savedPosts.map((sp, i) => (
                            <ScrollReveal key={sp.id} mode="fade-up" delay={i * 0.05} width="100%">
                                <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex gap-5 items-center group">
                                    <Link href={`/community/${sp.community_posts.slug}`} className="flex-1 flex gap-5 items-center min-w-0">
                                        {sp.community_posts.featured_image_url && (
                                            <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                                                <img
                                                    src={sp.community_posts.featured_image_url}
                                                    alt={sp.community_posts.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading font-bold text-lg text-playful-text truncate">
                                                {sp.community_posts.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                                                {sp.community_posts.tags?.[0] && (
                                                    <span className="bg-playful-teal/10 text-playful-teal px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                                                        {sp.community_posts.tags[0].replace('_', ' ')}
                                                    </span>
                                                )}
                                                <span>❤️ {sp.community_posts.like_count}</span>
                                                <span>💬 {sp.community_posts.comment_count}</span>
                                                <span className="hidden sm:inline">
                                                    {format(new Date(sp.community_posts.created_at), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleUnsave(sp.id)}
                                        className="shrink-0 p-2 text-purple-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove from saved"
                                    >
                                        <Bookmark className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
