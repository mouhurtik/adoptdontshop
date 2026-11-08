'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PawPrint, MessageCircle, ShoppingBag, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const tabClasses = 'flex h-14 min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-playful-teal-text';

export default function BottomNav() {
    const pathname = usePathname();
    const { isAuthenticated, profile, user } = useAuth();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const meActive = pathname.startsWith('/user') || pathname.startsWith('/profile') || pathname === '/login';
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
            name: 'Browse',
            href: '/browse',
            icon: PawPrint,
            active: isActive('/browse') || isActive('/pet/'),
        },
        { name: 'Store', href: '/store', icon: ShoppingBag, active: isActive('/store') },
        {
            name: 'Chat',
            href: '/messages',
            icon: MessageCircle,
            active: isActive('/messages'),
        },
    ];

    return (
        <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex h-16 items-center gap-1 px-2">
                    {tabs.map(tab => (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            prefetch={false}
                            aria-current={tab.active ? 'page' : undefined}
                            className={`${tabClasses} ${
                                tab.active ? 'bg-playful-coral/10 text-playful-coral-text' : 'text-gray-600 hover:bg-playful-cream active:bg-playful-coral/5'
                            }`}
                        >
                            <tab.icon
                                aria-hidden="true"
                                className="h-[22px] w-[22px]"
                                strokeWidth={2}
                            />
                            <span className={`text-xs leading-4 ${tab.active ? 'font-semibold' : 'font-medium'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    ))}

                    {/* Me / Login */}
                    <Link
                        href={isAuthenticated ? `/user/${profile?.username || user?.id}` : '/login'}
                        prefetch={false}
                        aria-current={meActive ? 'page' : undefined}
                        className={`${tabClasses} ${
                            meActive ? 'bg-playful-coral/10 text-playful-coral-text' : 'text-gray-600 hover:bg-playful-cream active:bg-playful-coral/5'
                        }`}
                    >
                        {isAuthenticated ? (
                            <div aria-hidden="true" className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold ${
                                meActive ? 'bg-playful-coral/15 text-playful-coral-text' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {displayInitial}
                            </div>
                        ) : (
                            <LogIn aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={2} />
                        )}
                        <span className={`text-xs leading-4 ${meActive ? 'font-semibold' : 'font-medium'}`}>
                            {isAuthenticated ? 'Me' : 'Login'}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
