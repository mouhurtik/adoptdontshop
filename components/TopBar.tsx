'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint } from 'lucide-react';

export default function TopBar() {
    const pathname = usePathname();

    // Page context label
    const getContextLabel = () => {
        if (pathname === '/') return null;
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

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center px-4 h-14">
                {/* Logo — always visible */}
                <Link href="/" className="flex items-center gap-1.5 shrink-0">
                    <div className="bg-playful-coral text-white p-1.5 rounded-lg">
                        <PawPrint className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-lg font-heading font-black tracking-tight text-playful-text">
                        Adopt<span className="text-playful-coral">Dont</span>Shop
                    </span>
                </Link>

                {/* Page badge pill — appears next to logo */}
                {contextLabel && (
                    <div className="flex items-center min-w-0 pr-2">
                        <span className="mx-2 text-gray-300 font-bold shrink-0">|</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full truncate shadow-sm ${getBadgeStyle()}`}>
                            {contextLabel}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}
