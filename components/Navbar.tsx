'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, PawPrint, LogIn, LogOut, User, ListChecks, Shield } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, profile, isAdmin, isAuthenticated, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    // Close user menu on outside click
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
        { name: "Essentials", path: "/pet-essentials" },
        { name: "Stories", path: "/success-stories" },
        { name: "Community", path: "/community" },
        { name: "Patrons", path: "/sponsors" },
        { name: "About", path: "/about" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="w-[95%] md:w-[90%] mx-auto">
                {/* Navbar Island */}
                <div className={`rounded-[2rem] px-6 py-4 transition-all duration-300 ${scrolled || isOpen
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
                        <div className="hidden lg:flex items-center justify-center flex-1">
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

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
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
                                                href="/profile"
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

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isOpen
                                ? 'bg-playful-cream text-playful-coral'
                                : scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-700 bg-white/50 hover:bg-white'
                                }`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <nav className="flex flex-col space-y-2 pb-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    prefetch={false}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all duration-300 ${pathname === link.path
                                        ? 'bg-playful-cream text-playful-coral'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile CTA Buttons */}
                            <div className="pt-4 space-y-2">
                                <Link href="/list-pet" prefetch={false}>
                                    <PrimaryButton className="w-full justify-center shadow-md">
                                        List a Pet
                                    </PrimaryButton>
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <Link href="/profile" prefetch={false} className="block">
                                            <PrimaryButton variant="ghost" className="w-full justify-center">
                                                <User className="h-4 w-4 mr-2" />
                                                Profile
                                            </PrimaryButton>
                                        </Link>
                                        <Link href="/profile/my-listings" prefetch={false} className="block">
                                            <PrimaryButton variant="ghost" className="w-full justify-center">
                                                <ListChecks className="h-4 w-4 mr-2" />
                                                My Listings
                                            </PrimaryButton>
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin" prefetch={false} className="block">
                                                <PrimaryButton variant="ghost" className="w-full justify-center text-playful-coral">
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Admin
                                                </PrimaryButton>
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" prefetch={false} className="block">
                                        <PrimaryButton variant="outline" className="w-full justify-center">
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Login
                                        </PrimaryButton>
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
