'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PawPrint, ChevronLeft, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/listings', label: 'Listings', icon: PawPrint },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-20 left-4 z-40 md:hidden bg-white p-2 rounded-lg shadow-md"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-heading font-bold text-playful-text">Admin Panel</h2>
                    <button onClick={() => setMobileOpen(false)} className="md:hidden">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(href)
                                    ? 'bg-playful-teal/10 text-playful-teal'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-playful-text transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to site
                    </Link>
                </div>
            </aside>
        </>
    );
}
