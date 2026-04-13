'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PawPrint, Flame, Heart, MessageCircle, Users, ArrowRight, BookOpen, PenSquare, Award, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCommunityPosts } from '@/hooks/useCommunity';


interface MiniPet {
    id: string;
    pet_name: string;
    image_url: string | null;
    breed: string;
    location: string;
    animal_type: string | null;
}

interface MiniGroup {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
    member_count: number;
    category: string;
}

const ExploreSidebar = () => {
    const [pets, setPets] = useState<MiniPet[]>([]);
    const [groups, setGroups] = useState<MiniGroup[]>([]);
    const { data: trendingPosts } = useCommunityPosts({ sort: 'hot', limit: 5 });

    useEffect(() => {
        // Fetch latest available pets
        supabase
            .from('pet_listings')
            .select('id, pet_name, image_url, breed, location, animal_type')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data }) => { if (data) setPets(data); });

        // Fetch top groups by member count
        supabase
            .from('groups')
            .select('id, name, slug, avatar_url, member_count, category')
            .order('member_count', { ascending: false })
            .limit(5)
            .then(({ data }) => { if (data) setGroups(data as MiniGroup[]); });
    }, []);

    return (
        <aside className="hidden xl:block w-[300px] flex-shrink-0 space-y-5 sticky top-8 self-start">
            {/* Pets Needing Homes */}
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
                    <div className="px-5 py-6 text-center text-sm text-gray-400">No pets listed yet</div>
                )}
                <Link
                    href="/browse"
                    className="flex items-center justify-center gap-1.5 px-5 py-3 border-t border-gray-100 text-xs font-bold text-playful-teal hover:bg-playful-teal/5 transition-colors"
                >
                    View All Pets <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Trending Posts */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-500/5 to-transparent">
                    <div className="bg-orange-50 p-1.5 rounded-lg">
                        <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Trending</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {trendingPosts && trendingPosts.length > 0 ? (
                        trendingPosts.slice(0, 5).map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.slug}`}
                                className="flex items-start gap-3 px-5 py-3 hover:bg-playful-cream/30 transition-colors group"
                            >
                                <span className="text-lg font-black text-gray-200 group-hover:text-playful-coral transition-colors flex-shrink-0 w-6 text-right">
                                    {index + 1}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-playful-text line-clamp-2 group-hover:text-playful-coral transition-colors leading-snug">
                                        {post.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.like_count}</span>
                                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comment_count}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="px-5 py-6 text-center text-sm text-gray-400">No trending posts yet</div>
                    )}
                </div>
            </div>

            {/* Active Groups */}
            {groups.length > 0 && (
                <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-teal/5 to-transparent">
                        <div className="bg-playful-teal/10 p-1.5 rounded-lg">
                            <Users className="w-4 h-4 text-playful-teal" />
                        </div>
                        <h3 className="font-heading font-bold text-playful-text text-sm">Active Groups</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {groups.map(group => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.slug}`}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-playful-cream/30 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {group.avatar_url ? (
                                        <img src={group.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-bold text-xs">
                                            {group.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-playful-text truncate">{group.name}</p>
                                    <p className="text-xs text-gray-400">{group.member_count} members</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link
                        href="/communities"
                        className="flex items-center justify-center gap-1.5 px-5 py-3 border-t border-gray-100 text-xs font-bold text-playful-teal hover:bg-playful-teal/5 transition-colors"
                    >
                        Explore Groups <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-playful-yellow/10 to-transparent">
                    <div className="bg-playful-yellow/20 p-1.5 rounded-lg">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Quick Links</h3>
                </div>
                <div className="p-2">
                    {[
                        { href: '/list-pet', label: 'List a Pet', icon: PenSquare, color: 'text-playful-coral' },
                        { href: '/success-stories', label: 'Success Stories', icon: Award, color: 'text-green-500' },
                        { href: '/welcome', label: 'About AdoptDontShop', icon: BookOpen, color: 'text-playful-teal' },
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

export default ExploreSidebar;
