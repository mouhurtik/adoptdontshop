'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PawPrint, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/listings', label: 'Listings', icon: PawPrint },
];

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
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
                className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded-lg shadow-md"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    ${collapsed ? 'w-[68px]' : 'w-64'}
                `}
            >
                {/* Branding + Header */}
                <div className="border-b border-gray-100">
                    {/* Logo */}
                    <div className={`flex items-center ${collapsed ? 'justify-center p-4' : 'gap-2 px-5 pt-5 pb-2'}`}>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-playful-coral text-white p-1.5 rounded-lg rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                                <PawPrint className="h-5 w-5 fill-current" />
                            </div>
                            {!collapsed && (
                                <span className="text-lg font-heading font-black tracking-tight text-playful-text whitespace-nowrap">
                                    Adopt<span className="text-playful-coral">Dont</span>Shop
                                </span>
                            )}
                        </Link>
                        {/* Mobile close */}
                        <button onClick={() => setMobileOpen(false)} className="md:hidden ml-auto">
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Admin Panel label + collapse toggle */}
                    <div className={`flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'justify-between px-5 py-3'}`}>
                        {!collapsed && (
                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Panel</h2>
                        )}
                        <button
                            onClick={onToggle}
                            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-2 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? label : undefined}
                            className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-colors
                                ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                                ${isActive(href)
                                    ? 'bg-playful-teal/10 text-playful-teal'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom: Back to site */}
                <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-100">
                    <Link
                        href="/"
                        title={collapsed ? 'Back to site' : undefined}
                        className={`flex items-center gap-2 py-3 text-sm text-gray-500 hover:text-playful-text transition-colors
                            ${collapsed ? 'justify-center px-2' : 'px-4'}`}
                    >
                        <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && 'Back to site'}
                    </Link>
                </div>
            </aside>
        </>
    );
}
