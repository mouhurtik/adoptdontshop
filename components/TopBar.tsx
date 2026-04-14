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

    const contextLabel = getContextLabel();

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Left: Logo or context label */}
                <div className="flex items-center gap-2 min-w-0">
                    {contextLabel ? (
                        <span className="text-sm font-bold text-playful-text truncate">{contextLabel}</span>
                    ) : (
                        <Link href="/" className="flex items-center gap-1.5">
                            <div className="bg-playful-coral text-white p-1 rounded-lg">
                                <PawPrint className="h-4 w-4 fill-current" />
                            </div>
                            <span className="text-base font-heading font-black tracking-tight text-playful-text">
                                Adopt<span className="text-playful-coral">Dont</span>Shop
                            </span>
                        </Link>
                    )}
                </div>

                {/* Right: Intentionally empty — search/notification icons hidden until functional */}
                <div className="flex items-center gap-1" />
            </div>
        </header>
    );
}
