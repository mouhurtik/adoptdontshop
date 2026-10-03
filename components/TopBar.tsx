'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Bell, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadCount } from '@/hooks/useMessages';

export default function TopBar() {
    const pathname = usePathname();
    const { isAuthenticated, user, profile } = useAuth();
    const { data: unreadCount = 0 } = useUnreadCount();

    // Page context label
    const getContextLabel = () => {
        if (pathname === '/') return null;
        if (pathname.startsWith('/map')) return 'Paw Map';
        if (pathname.startsWith('/fundraisers')) return 'Fundraisers';
        if (pathname.startsWith('/shop')) return 'Pet Shop';
        if (pathname.startsWith('/support-us')) return 'Support Us';
        if (pathname.startsWith('/browse')) return 'Browse Pets';
        if (pathname.startsWith('/explore') || pathname.startsWith('/communities')) return 'Explore';
        if (pathname.startsWith('/community/write')) return 'Create Post';
        if (pathname.startsWith('/community')) return 'Community';
        if (pathname.startsWith('/messages')) return 'Messages';
        if (pathname.startsWith('/welcome')) return 'Welcome';
        if (pathname.startsWith('/user') || pathname.startsWith('/profile')) return 'Profile';
        if (pathname.startsWith('/list-pet')) return 'List a Pet';
        if (pathname.startsWith('/about')) return 'About';
        if (pathname.startsWith('/pet/')) {
            const slug = pathname.split('/').pop() || '';
            const name = slug.split('-')[0];
            return name ? `Meet ${name.charAt(0).toUpperCase() + name.slice(1)}` : 'Pet Details';
        }
        if (pathname.startsWith('/login')) return 'Login';
        if (pathname.startsWith('/signup')) return 'Sign Up';
        return null;
    };

    // Badge color based on route
    const getBadgeStyle = () => {
        if (pathname.startsWith('/map')) return 'bg-teal-100 text-teal-800';
        if (pathname.startsWith('/fundraisers')) return 'bg-rose-100 text-rose-800';
        if (pathname.startsWith('/shop')) return 'bg-amber-100 text-amber-800';
        if (pathname.startsWith('/support-us')) return 'bg-emerald-100 text-emerald-800';
        if (pathname.startsWith('/browse')) return 'bg-amber-200 text-amber-800';
        if (pathname.startsWith('/explore') || pathname.startsWith('/communities')) return 'bg-purple-200 text-purple-800';
        if (pathname.startsWith('/community')) return 'bg-teal-200 text-teal-800';
        if (pathname.startsWith('/messages')) return 'bg-blue-100 text-blue-700';
        if (pathname.startsWith('/user') || pathname.startsWith('/profile')) return 'bg-playful-coral/15 text-playful-coral';
        if (pathname.startsWith('/list-pet')) return 'bg-green-100 text-green-700';
        if (pathname.startsWith('/about') || pathname.startsWith('/welcome')) return 'bg-teal-100 text-teal-700';
        if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return 'bg-playful-coral/15 text-playful-coral';
        if (pathname.startsWith('/pet/')) return 'bg-playful-coral text-white';
        return 'bg-playful-yellow text-playful-text';
    };

    const contextLabel = getContextLabel();
    const displayInitial = (profile?.display_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase();

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Left side: Logo + Page badge pill */}
                <div className="flex items-center min-w-0">
                    <Link href="/" className="flex items-center gap-1.5 shrink-0">
                        <div className="bg-playful-coral text-white p-1.5 rounded-lg">
                            <PawPrint className="h-4 w-4 fill-current" />
                        </div>
                        <span className="text-lg font-heading font-bold tracking-tight text-playful-text">
                            Adopt<span className="text-playful-coral">Dont</span>Shop
                        </span>
                    </Link>

                    {contextLabel && (
                        <div className="flex items-center min-w-0 pr-2">
                            <span className="mx-2 text-gray-300 font-bold shrink-0">|</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full truncate shadow-sm ${getBadgeStyle()}`}>
                                {contextLabel}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right side: Notifications bell + Profile Avatar (Instagram/X style) */}
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/messages"
                                className="relative p-1.5 text-gray-600 hover:text-playful-coral transition-colors"
                                aria-label="Messages and notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-playful-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href={`/user/${profile?.username || user?.id}`}
                                className="flex items-center focus:outline-none focus:ring-2 focus:ring-playful-coral/40 rounded-full"
                                aria-label="Your Profile"
                            >
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.display_name || 'Profile'}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-playful-coral/20"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-playful-coral text-white text-xs font-bold flex items-center justify-center shadow-xs">
                                        {displayInitial}
                                    </div>
                                )}
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-playful-coral/10 text-playful-coral font-bold text-xs hover:bg-playful-coral hover:text-white transition-colors"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
