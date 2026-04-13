'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PenSquare, MessageCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadCount } from '@/hooks/useMessages';

export default function BottomNav() {
    const pathname = usePathname();
    const { isAuthenticated, profile, user } = useAuth();
    const { data: unreadCount = 0 } = useUnreadCount();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const meActive = pathname.startsWith('/user') || pathname.startsWith('/profile') || pathname === '/login';
    const postActive = pathname.startsWith('/community/write') || pathname.startsWith('/list-pet');
    const displayInitial = (profile?.display_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase();

    const tabs = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
            active: isActive('/'),
        },
        {
            name: 'Explore',
            href: '/explore',
            icon: Compass,
            active: isActive('/communities') || isActive('/explore'),
        },
        {
            name: 'Post',
            href: isAuthenticated ? '/community/write' : '/login',
            icon: PenSquare,
            active: postActive,
        },
        {
            name: 'Chat',
            href: '/messages',
            icon: MessageCircle,
            active: isActive('/messages'),
            badge: unreadCount,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)]">
                    {tabs.map(tab => (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            prefetch={false}
                            className={`flex flex-col items-center justify-center flex-1 py-2.5 transition-colors ${
                                tab.active ? 'text-playful-coral' : 'text-gray-500 active:text-gray-600'
                            }`}
                        >
                            <div className="relative">
                                <tab.icon
                                    className="h-[22px] w-[22px]"
                                    strokeWidth={tab.active ? 2.4 : 1.8}
                                />
                                {tab.badge && tab.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-playful-coral text-white text-[9px] font-bold rounded-full px-1">
                                        {tab.badge > 99 ? '99+' : tab.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] mt-0.5 ${tab.active ? 'font-bold' : 'font-medium'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    ))}

                    {/* Me / Login */}
                    <Link
                        href={isAuthenticated ? `/user/${profile?.username || user?.id}` : '/login'}
                        prefetch={false}
                        className={`flex flex-col items-center justify-center flex-1 py-2.5 transition-colors ${
                            meActive ? 'text-playful-coral' : 'text-gray-500 active:text-gray-600'
                        }`}
                    >
                        {isAuthenticated ? (
                            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold ${
                                meActive ? 'bg-playful-coral text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {displayInitial}
                            </div>
                        ) : (
                            <LogIn className="h-[22px] w-[22px]" strokeWidth={meActive ? 2.4 : 1.8} />
                        )}
                        <span className={`text-[10px] mt-0.5 ${meActive ? 'font-bold' : 'font-medium'}`}>
                            {isAuthenticated ? 'Me' : 'Login'}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
