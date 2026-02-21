'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PawPrint, LogIn, LogOut, User, ListChecks, Shield, MessageCircle, FileText, Plus } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useAuth } from "@/contexts/AuthContext";

const NavbarInner = () => {
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, profile, isAdmin, isAuthenticated, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setUserMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    const displayName = profile?.display_name || user?.displayName || user?.email?.split('@')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Browse Pets", path: "/browse" },
        { name: "Community", path: "/community" },
        { name: "About", path: "/about" },
    ];

    // Page title for mobile app bar
    const getPageTitle = () => {
        if (pathname === '/') return null; // show logo on home
        if (pathname.startsWith('/browse')) return 'Browse Pets';
        if (pathname.startsWith('/community')) return 'Community';
        if (pathname.startsWith('/resources') || pathname.startsWith('/pet-essentials')) return 'Store';
        if (pathname.startsWith('/messages')) return 'Messages';
        if (pathname.startsWith('/user') || pathname.startsWith('/profile')) return 'Profile';
        if (pathname.startsWith('/list-pet')) return 'List a Pet';
        if (pathname.startsWith('/about')) {
            return searchParams.get('tab') === 'store' ? 'Store' : 'About';
        }
        if (pathname.startsWith('/login')) return 'Login';
        if (pathname.startsWith('/signup')) return 'Sign Up';
        return null;
    };

    const mobileTitle = getPageTitle();

    return (
        <>
            {/* ===== MOBILE APP BAR (< lg) ===== */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center px-4 h-14">
                    {/* Logo & page title */}
                    <Link href="/" prefetch={false} className="flex items-center gap-1.5 shrink-0">
                        <div className="bg-playful-coral text-white p-1.5 rounded-lg">
                            <PawPrint className="h-4 w-4 fill-current" />
                        </div>
                        <span className="text-lg font-heading font-black tracking-tight text-playful-text">
                            Adopt<span className="text-playful-coral">Dont</span>Shop
                        </span>
                    </Link>
                    {mobileTitle && (
                        <div className="flex items-center min-w-0 pr-2">
                            <span className="mx-2 text-gray-300 font-bold shrink-0">|</span>
                            <span className="text-xs font-bold text-playful-text bg-playful-yellow px-2.5 py-0.5 rounded-full truncate shadow-sm">
                                {mobileTitle}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* ===== DESKTOP NAVBAR (≥ lg) ===== */}
            <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 p-4">
                <div className="w-[90%] mx-auto">
                    <div className={`rounded-[2rem] px-6 py-4 transition-all duration-300 ${scrolled
                        ? 'bg-white/90 backdrop-blur-md border border-white/50 shadow-soft'
                        : 'bg-transparent'
                        }`}>
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" prefetch={false} className="flex items-center gap-2 group">
                                <div className="bg-playful-coral text-white p-2 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                                    <PawPrint className="h-6 w-6 fill-current" />
                                </div>
                                <span className="text-2xl font-heading font-black tracking-tight text-playful-text">
                                    Adopt<span className="text-playful-coral">Dont</span>Shop
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="flex items-center justify-center flex-1">
                                <nav className="flex items-center space-x-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.path}
                                            prefetch={false}
                                            className={`relative font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full hover:shadow-sm ${pathname === link.path
                                                ? 'bg-playful-yellow text-playful-text shadow-sm'
                                                : scrolled
                                                    ? 'text-gray-600 hover:bg-playful-cream hover:text-playful-coral'
                                                    : 'text-gray-700 hover:bg-white/80 hover:text-playful-coral'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Desktop CTA Buttons */}
                            <div className="flex items-center space-x-3">
                                <Link href="/list-pet" prefetch={false}>
                                    <PrimaryButton size="md" className="shadow-lg hover:shadow-xl">
                                        List a Pet
                                    </PrimaryButton>
                                </Link>

                                {isAuthenticated ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-playful-cream transition-colors"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                {initials}
                                            </div>
                                        </button>

                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="font-bold text-playful-text text-sm truncate">{displayName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                                </div>
                                                <Link
                                                    href={`/user/${profile?.username || user?.id}`}
                                                    prefetch={false}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-playful-cream transition-colors"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/profile/my-listings"
                                                    prefetch={false}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-playful-cream transition-colors"
                                                >
                                                    <ListChecks className="h-4 w-4" />
                                                    My Listings
                                                </Link>
                                                <Link
                                                    href="/messages"
                                                    prefetch={false}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-playful-cream transition-colors"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    Messages
                                                </Link>
                                                <Link
                                                    href="/community/my-posts"
                                                    prefetch={false}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-playful-cream transition-colors"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    My Posts
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        prefetch={false}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-playful-coral hover:bg-playful-cream transition-colors"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                        Admin
                                                    </Link>
                                                )}
                                                <div className="border-t border-gray-100 mt-1 pt-1">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/login" prefetch={false}>
                                        <PrimaryButton size="md" variant="outline" className="shadow-sm">
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Login
                                        </PrimaryButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

const Navbar = () => (
    <Suspense fallback={<div className="h-14 bg-white border-b border-gray-100" />}>
        <NavbarInner />
    </Suspense>
);

export default Navbar;
