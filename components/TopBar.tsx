'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const CORAL_BADGE_CLASSES = 'bg-playful-coral/10 text-playful-coral-text';
const TEAL_BADGE_CLASSES = 'bg-playful-teal/10 text-playful-teal-text';

export default function TopBar() {
    const pathname = usePathname();

    const matchesRoute = (route: string) => pathname === route || pathname?.startsWith(`${route}/`);

    const getContextBadge = () => {
        if (!pathname || pathname === '/') return null;
        if (matchesRoute('/explore')) return { label: 'Explore', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/browse')) return { label: 'Browse Pets', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/messages')) return { label: 'Messages', className: CORAL_BADGE_CLASSES };
        if (matchesRoute('/user') || matchesRoute('/profile')) return { label: 'Profile', className: CORAL_BADGE_CLASSES };
        if (pathname.startsWith('/pet/')) {
            const slug = pathname.split('/').pop() || '';
            const name = slug.split('-')[0];
            const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Pet';
            return { label: `Meet ${formattedName}`, className: CORAL_BADGE_CLASSES };
        }
        if (matchesRoute('/login')) return { label: 'Login', className: CORAL_BADGE_CLASSES };
        if (matchesRoute('/community')) return { label: 'Community', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/communities')) return { label: 'Explore', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/store')) return { label: 'Store', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/about')) return { label: 'About', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/welcome')) return { label: 'Welcome', className: TEAL_BADGE_CLASSES };
        if (matchesRoute('/list-pet')) return { label: 'List a Pet', className: CORAL_BADGE_CLASSES };
        if (matchesRoute('/signup')) return { label: 'Sign Up', className: CORAL_BADGE_CLASSES };
        return null;
    };

    const contextBadge = getContextBadge();

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="flex min-w-0 items-center gap-1 px-3 h-14">
                {/* Logo — always visible */}
                <Link href="/" aria-label="AdoptDontShop home" className="flex min-h-11 min-w-11 items-center gap-1.5 shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-playful-teal-text focus-visible:ring-offset-2">
                    <div className="bg-playful-coral text-white p-1.5 rounded-lg">
                        <PawPrint aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={2} />
                    </div>
                    <span className="text-lg leading-tight font-heading font-bold tracking-tight text-playful-text">
                        Adopt<span className="text-playful-coral-text">Dont</span>Shop
                    </span>
                </Link>
                {contextBadge && (
                    <div className="flex items-center min-w-0 pr-2">
                        <span aria-hidden="true" className="mx-2 text-gray-300 font-bold shrink-0">|</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full truncate shadow-sm ${contextBadge.className}`}>
                            {contextBadge.label}
                        </span>
                    </div>
                )}
                <div className="ml-auto"><ThemeToggle compact /></div>
            </div>
        </header>
    );
}
