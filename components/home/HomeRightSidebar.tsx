'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenSquare, Bell, Clock, Heart, MessageCircle, UserPlus, BookOpen, Award, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { supabase } from '@/lib/supabase/client';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow';
    message: string;
    created_at: string;
    read: boolean;
}

interface RecentPost {
    id: string;
    title: string;
    slug: string;
    created_at: string;
}

const NOTIF_ICON = {
    like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-50' },
    comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-50' },
    follow: { icon: UserPlus, color: 'text-green-400', bg: 'bg-green-50' },
};

const HomeRightSidebar = () => {
    const { isAuthenticated, user, profile } = useAuth();
    const { openLogin } = useAuthModal();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        // Fetch recent notifications
        supabase
            .from('notifications')
            .select('id, type, message, created_at, read')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
            .then(({ data }) => {
                if (data) setNotifications(data as Notification[]);
            });

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

            {/* Notifications */}
            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                        <Bell className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="font-heading font-bold text-playful-text text-sm">Notifications</h3>
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="ml-auto bg-playful-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    )}
                </div>
                {isAuthenticated ? (
                    notifications.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {notifications.slice(0, 4).map(notif => {
                                const config = NOTIF_ICON[notif.type] || NOTIF_ICON.like;
                                const Icon = config.icon;
                                return (
                                    <div
                                        key={notif.id}
                                        className={`flex items-start gap-3 px-5 py-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className={`${config.bg} p-1.5 rounded-lg flex-shrink-0 mt-0.5`}>
                                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-5 py-6 text-center">
                            <p className="text-xs text-gray-400">No notifications yet</p>
                            <p className="text-[10px] text-gray-300 mt-1">Engage with posts to get notified!</p>
                        </div>
                    )
                ) : (
                    <div className="px-5 py-6 text-center">
                        <p className="text-xs text-gray-400">Sign in to see notifications</p>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
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

export default HomeRightSidebar;
