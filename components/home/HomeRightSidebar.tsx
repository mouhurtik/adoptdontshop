'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenSquare, Clock, Heart, BookOpen, Award, Sparkles, PawPrint, ArrowRight, MapPin, HeartHandshake, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { supabase } from '@/lib/supabase/client';

interface MiniPet {
    id: string;
    pet_name: string;
    image_url: string | null;
    breed: string;
    location: string;
}

interface MiniFundraiser {
    id: string;
    title: string;
    slug: string;
    raised_amount: number | null;
    target_amount: number;
    category: string;
}

interface RecentPost {
    id: string;
    title: string;
    slug: string;
    created_at: string;
}

const HomeRightSidebar = () => {
    const { isAuthenticated, user, profile } = useAuth();
    const { openLogin } = useAuthModal();
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [pets, setPets] = useState<MiniPet[]>([]);
    const [featuredFundraiser, setFeaturedFundraiser] = useState<MiniFundraiser | null>(null);

    useEffect(() => {
        if (!window.matchMedia('(min-width: 1280px)').matches) return;

        // Fetch latest pets needing homes
        supabase
            .from('pet_listings')
            .select('id, pet_name, image_url, breed, location')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data }) => {
                if (data) setPets(data);
            });

        // Fetch urgent/featured fundraiser
        supabase
            .from('fundraisers')
            .select('id, title, slug, raised_amount, target_amount, category')
            .eq('status', 'active')
            .order('is_urgent', { ascending: false })
            .limit(1)
            .maybeSingle()
            .then(({ data }) => {
                if (data) setFeaturedFundraiser(data as MiniFundraiser);
            });

        if (!user?.id) return;

        // Fetch user's recent posts
        supabase
            .from('community_posts')
            .select('id, title, slug, created_at')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data }) => {
                if (data) setRecentPosts(data);
            });
    }, [user?.id]);

    const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';

    return (
        <aside className="hidden xl:block w-[300px] flex-shrink-0 space-y-5 sticky top-8 self-start">
            {/* Create Post Card */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="p-5">
                    {isAuthenticated ? (
                        <>
                            <p className="text-sm font-medium text-gray-500 mb-3">
                                Hey <span className="font-bold text-playful-text">{displayName}</span>, what&apos;s on your mind?
                            </p>
                            <Link
                                href="/community/write"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-playful-coral text-white rounded-xl font-bold text-sm hover:bg-playful-coral/90 transition-colors shadow-sm"
                            >
                                <PenSquare className="w-4 h-4" />
                                Write a Post
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-gray-500 mb-3">
                                Join the community to share stories and connect with pet lovers!
                            </p>
                            <button
                                onClick={openLogin}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-playful-coral text-white rounded-xl font-bold text-sm hover:bg-playful-coral/90 transition-colors shadow-sm"
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Pets Needing Homes (absorbed from former Explore/HomeSidebar) */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-coral/5 to-transparent">
                    <div className="bg-playful-coral/10 p-1.5 rounded-lg">
                        <PawPrint className="w-4 h-4 text-playful-coral" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Pets Needing Homes</h3>
                </div>
                {pets.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {pets.map(pet => (
                            <Link
                                key={pet.id}
                                href={`/pet/${pet.id}`}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-playful-cream/30 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {pet.image_url ? (
                                        <img src={pet.image_url} alt={pet.pet_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg">🐾</div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-playful-text truncate group-hover:text-playful-coral transition-colors">
                                        {pet.pet_name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{pet.breed} · {pet.location}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="px-5 py-6 text-center text-xs text-gray-400">Loading adorable pets...</div>
                )}
                <Link
                    href="/browse"
                    className="flex items-center justify-center gap-1.5 px-5 py-3 border-t border-gray-100 text-xs font-bold text-playful-teal hover:bg-playful-teal/5 transition-colors"
                >
                    View All Pets <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Featured / Urgent Cause */}
            {featuredFundraiser && (
                <div className="bg-white rounded-[1.5rem] shadow-soft border border-rose-100 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-rose-100 bg-rose-50/50">
                        <div className="bg-rose-100 p-1.5 rounded-lg">
                            <HeartHandshake className="w-4 h-4 text-rose-600" />
                        </div>
                        <h3 className="font-heading font-bold text-rose-900 text-sm">Urgent Animal Cause</h3>
                    </div>
                    <div className="p-4 space-y-2">
                        <p className="text-xs font-bold text-playful-text line-clamp-2">
                            {featuredFundraiser.title}
                        </p>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-playful-coral h-full rounded-full transition-all"
                                style={{
                                    width: `${Math.min(100, Math.round(((featuredFundraiser.raised_amount || 0) / featuredFundraiser.target_amount) * 100))}%`
                                }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500">
                            <span>₹{Number(featuredFundraiser.raised_amount || 0).toLocaleString('en-IN')} raised</span>
                            <span className="text-playful-coral">Goal: ₹{Number(featuredFundraiser.target_amount).toLocaleString('en-IN')}</span>
                        </div>
                        <Link
                            href={`/fundraisers/${featuredFundraiser.slug}`}
                            className="block text-center w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors mt-2"
                        >
                            Support This Cause
                        </Link>
                    </div>
                </div>
            )}

            {/* Your Posts */}
            {isAuthenticated && recentPosts.length > 0 && (
                <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-500/5 to-transparent">
                        <div className="bg-purple-50 p-1.5 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-500" />
                        </div>
                        <h3 className="font-heading font-bold text-playful-text text-sm">Your Posts</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentPosts.map(post => (
                            <Link
                                key={post.id}
                                href={`/community/${post.slug}`}
                                className="flex items-start gap-3 px-5 py-3 hover:bg-playful-cream/30 transition-colors group"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-playful-text line-clamp-1 group-hover:text-playful-coral transition-colors">
                                        {post.title}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Links & Explore features */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-yellow/10 to-transparent">
                    <div className="bg-playful-yellow/20 p-1.5 rounded-lg">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Explore & Resources</h3>
                </div>
                <div className="p-2 space-y-0.5">
                    {[
                        { href: '/map', label: 'Paw Map (Community Animals)', icon: MapPin, color: 'text-playful-teal' },
                        { href: '/shop', label: 'Pet Essentials Shop', icon: ShoppingBag, color: 'text-amber-600' },
                        { href: '/list-pet', label: 'List a Pet for Adoption', icon: PenSquare, color: 'text-playful-coral' },
                        { href: '/success-stories', label: 'Success Stories', icon: Award, color: 'text-green-500' },
                        { href: '/support-us', label: 'Support AdoptDontShop', icon: Heart, color: 'text-rose-500' },
                        { href: '/welcome', label: 'About Our Mission', icon: BookOpen, color: 'text-gray-500' },
                    ].map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-playful-cream/30 transition-colors text-sm font-medium text-gray-600 hover:text-playful-text"
                        >
                            <link.icon className={`w-4 h-4 ${link.color}`} />
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default HomeRightSidebar;
