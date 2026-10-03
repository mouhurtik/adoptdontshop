'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, PawPrint, ShoppingBag, MessageCircle } from 'lucide-react';
import { useUnreadCount } from '@/hooks/useMessages';

export default function BottomNav() {
    const pathname = usePathname();
    const { data: unreadCount = 0 } = useUnreadCount();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const tabs = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
            active: isActive('/') && !pathname.startsWith('/browse') && !pathname.startsWith('/map') && !pathname.startsWith('/shop') && !pathname.startsWith('/messages'),
        },
        {
            name: 'Browse',
            href: '/browse',
            icon: PawPrint,
            active: isActive('/browse') || isActive('/pet/'),
        },
        {
            name: 'Paw Map',
            href: '/map',
            icon: MapPin,
            active: isActive('/map'),
        },
        {
            name: 'Shop',
            href: '/shop',
            icon: ShoppingBag,
            active: isActive('/shop') || isActive('/pet-essentials'),
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
                            className={`flex flex-col items-center justify-center flex-1 py-2.5 transition-colors relative ${
                                tab.active ? 'text-playful-coral' : 'text-gray-500 active:text-gray-600'
                            }`}
                        >
                            <div className="relative">
                                <tab.icon
                                    className="h-[22px] w-[22px]"
                                    strokeWidth={tab.active ? 2.4 : 1.8}
                                />
                                {!!tab.badge && tab.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 bg-playful-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {tab.badge > 9 ? '9+' : tab.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] mt-0.5 ${tab.active ? 'font-bold' : 'font-medium'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
