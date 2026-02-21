'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User, MapPin, Building2, Calendar, PawPrint, FileText, ArrowLeft } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { format } from 'date-fns';

interface UserProfile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    account_type: string | null;
    organization_name: string | null;
    created_at: string | null;
    username: string | null;
}

interface PetListing {
    id: string;
    pet_name: string;
    animal_type: string | null;
    breed: string | null;
    image_url: string | null;
    status: string;
    created_at: string;
}

interface CommunityPost {
    id: string;
    title: string;
    slug: string;
    tags: string[] | null;
    like_count: number;
    comment_count: number;
    created_at: string;
    featured_image_url: string | null;
}

export default function PublicProfilePage() {
    const params = useParams();
    const userId = params.id as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [pets, setPets] = useState<PetListing[]>([]);
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pets' | 'posts'>('pets');

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);

            // Try looking up by username first, then by UUID
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

            let profileData = null;
            if (!isUUID) {
                // Look up by username
                const { data } = await supabase
                    .from('profiles')
                    .select('id, display_name, avatar_url, bio, location, account_type, organization_name, created_at, username')
                    .eq('username', userId)
                    .single();
                profileData = data;
            } else {
                // Fall back to UUID
                const { data } = await supabase
                    .from('profiles')
                    .select('id, display_name, avatar_url, bio, location, account_type, organization_name, created_at, username')
                    .eq('id', userId)
                    .single();
                profileData = data;
            }

            if (profileData) {
                setProfile(profileData);
                const uid = profileData.id;

                // Fetch pet listings
                const { data: petsData } = await supabase
                    .from('pet_listings')
                    .select('id, pet_name, animal_type, breed, image_url, status, created_at')
                    .eq('user_id', uid)
                    .order('created_at', { ascending: false });

                if (petsData) setPets(petsData);

                // Fetch community posts
                const { data: postsData } = await supabase
                    .from('community_posts')
                    .select('id, title, slug, tags, like_count, comment_count, created_at, featured_image_url')
                    .eq('author_id', uid)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false }) as { data: CommunityPost[] | null };

                if (postsData) setPosts(postsData);
            }

            setLoading(false);
        };

        fetchProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center bg-playful-cream">
                <div className="w-16 h-16 border-4 border-playful-coral border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="pt-32 pb-16 min-h-screen bg-playful-cream">
                <div className="container mx-auto px-4 text-center">
                    <ScrollReveal mode="fade-up" width="100%">
                        <div className="max-w-md mx-auto bg-white rounded-[2rem] p-12 shadow-soft">
                            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h1 className="text-2xl font-heading font-black text-playful-text mb-2">User Not Found</h1>
                            <p className="text-gray-500 mb-6">This profile doesn&apos;t exist or has been removed.</p>
                            <Link href="/browse">
                                <PrimaryButton>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Browse Pets
                                </PrimaryButton>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        );
    }

    const displayName = profile.display_name || 'User';
    const initials = displayName.charAt(0).toUpperCase();
    const joinDate = profile.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : null;

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Profile Header */}
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-soft border-2 border-gray-100 mb-8 relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-playful-teal to-playful-coral opacity-10 rounded-t-[2.5rem]" />

                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="w-28 h-28 rounded-full bg-playful-teal text-white flex items-center justify-center text-5xl font-bold shadow-lg border-4 border-white">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={displayName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-3xl font-heading font-black text-playful-text mb-0.5">
                                    {displayName}
                                </h1>
                                {(profile as UserProfile).username && (
                                    <p className="text-gray-400 font-bold text-sm mb-1">@{(profile as UserProfile).username}</p>
                                )}
                                {profile.account_type === 'organization' && profile.organization_name && (
                                    <p className="text-playful-teal font-bold flex items-center justify-center sm:justify-start gap-1 mb-1">
                                        <Building2 className="h-4 w-4" />
                                        {profile.organization_name}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 font-medium">
                                    {profile.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {profile.location}
                                        </span>
                                    )}
                                    {joinDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Joined {joinDate}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <PawPrint className="h-3.5 w-3.5" />
                                        {pets.length} pet{pets.length !== 1 ? 's' : ''} listed
                                    </span>
                                </div>
                            </div>
                        </div>

                        {profile.bio && (
                            <p className="mt-6 pt-6 border-t border-gray-100 text-gray-600 font-medium leading-relaxed">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </ScrollReveal>

                {/* Tab Switcher */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-full p-1.5 shadow-soft border border-gray-100">
                        <button
                            onClick={() => setActiveTab('pets')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                                activeTab === 'pets'
                                    ? 'bg-playful-coral text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <PawPrint className="w-4 h-4" />
                            Pets ({pets.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                                activeTab === 'posts'
                                    ? 'bg-playful-coral text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            Posts ({posts.length})
                        </button>
                    </div>
                </ScrollReveal>

                {/* Tab Content */}
                {activeTab === 'pets' ? (
                    <PetsGrid pets={pets} />
                ) : (
                    <PostsList posts={posts} />
                )}
            </div>
        </div>
    );
}

// ─── Pet Listings Grid ────────────────────────────────────
function PetsGrid({ pets }: { pets: PetListing[] }) {
    if (pets.length === 0) {
        return (
            <ScrollReveal mode="fade-up" width="100%">
                <div className="bg-white rounded-[2rem] p-12 shadow-soft text-center">
                    <PawPrint className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">No pets listed yet</p>
                </div>
            </ScrollReveal>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, i) => (
                <ScrollReveal key={pet.id} mode="fade-up" delay={i * 0.05} width="100%">
                    <Link href={`/pet/${pet.id}`}>
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-soft border-2 border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                            <div className="aspect-[4/3] bg-playful-cream overflow-hidden">
                                {pet.image_url ? (
                                    <img
                                        src={pet.image_url}
                                        alt={pet.pet_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PawPrint className="h-12 w-12 text-gray-200" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-heading font-bold text-lg text-playful-text">{pet.pet_name}</h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    {pet.breed ? `${pet.breed} · ` : ''}{pet.animal_type || 'Pet'}
                                </p>
                                <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                                    pet.status === 'adopted'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-playful-yellow/20 text-yellow-700'
                                }`}>
                                    {pet.status === 'adopted' ? '🏠 Adopted' : '🔍 Available'}
                                </span>
                            </div>
                        </div>
                    </Link>
                </ScrollReveal>
            ))}
        </div>
    );
}

// ─── Community Posts List ─────────────────────────────────
function PostsList({ posts }: { posts: CommunityPost[] }) {
    if (posts.length === 0) {
        return (
            <ScrollReveal mode="fade-up" width="100%">
                <div className="bg-white rounded-[2rem] p-12 shadow-soft text-center">
                    <FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">No posts yet</p>
                </div>
            </ScrollReveal>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post, i) => (
                <ScrollReveal key={post.id} mode="fade-up" delay={i * 0.05} width="100%">
                    <Link href={`/community/${post.slug}`}>
                        <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex gap-5 items-center">
                            {post.featured_image_url && (
                                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                                    <img
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-heading font-bold text-lg text-playful-text truncate">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                                    {post.tags && post.tags[0] && (
                                        <span className="bg-playful-teal/10 text-playful-teal px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                                            {post.tags[0].replace('_', ' ')}
                                        </span>
                                    )}
                                    <span>❤️ {post.like_count}</span>
                                    <span>💬 {post.comment_count}</span>
                                    <span className="hidden sm:inline">
                                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </ScrollReveal>
            ))}
        </div>
    );
}
