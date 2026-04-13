'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Compass, PawPrint, MessageCircle,
    Plus, LogIn, LogOut, Shield, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadCount } from '@/hooks/useMessages';
import { supabase } from '@/lib/supabase/client';

interface Community {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
}

interface AppSidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
    const pathname = usePathname();
    const { user, profile, isAdmin, isAuthenticated, signOut } = useAuth();
    const { data: unreadCount = 0 } = useUnreadCount();
    const [communities, setCommunities] = useState<Community[]>([]);

    // Fetch user's joined communities
    useEffect(() => {
        if (!user?.id) return;
        const fetchCommunities = async () => {
            const { data: memberships } = await supabase
                .from('group_members')
                .select('group_id')
                .eq('user_id', user.id)
                .limit(15);

            if (memberships && memberships.length > 0) {
                const groupIds = memberships.map(m => m.group_id);
                const { data: groups } = await supabase
                    .from('groups')
                    .select('id, name, slug, avatar_url')
                    .in('id', groupIds)
                    .order('name');

                if (groups) setCommunities(groups);
            }
        };
        fetchCommunities();
    }, [user?.id]);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();

    const mainNav = [
        { name: 'Home', icon: Home, path: '/', badge: 0 },
        { name: 'Explore', icon: Compass, path: '/explore', badge: 0 },
        { name: 'Browse Pets', icon: PawPrint, path: '/browse', badge: 0 },
        { name: 'Messages', icon: MessageCircle, path: '/messages', badge: unreadCount },
    ];

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside
            className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-40 transition-all duration-300 ${
                collapsed ? 'w-[72px]' : 'w-[260px]'
            }`}
        >
            {/* Logo */}
            <div className={`pt-5 pb-3 flex items-center ${collapsed ? 'px-3 justify-center' : 'px-4 justify-between'}`}>
                <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="bg-playful-coral text-white p-1.5 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                        <PawPrint className="h-5 w-5 fill-current" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-heading font-black tracking-tight text-playful-text whitespace-nowrap">
                            Adopt<span className="text-playful-coral">Dont</span>Shop
                        </span>
                    )}
                </Link>
            </div>


            {/* Main Navigation */}
            <nav className="px-2 space-y-0.5">
                {mainNav.map(item => (
                    <Link
                        key={item.name}
                        href={item.path}
                        title={collapsed ? item.name : undefined}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                            isActive(item.path)
                                ? 'bg-playful-coral/10 text-playful-coral'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                        }`}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                            isActive(item.path) ? 'text-playful-coral' : 'text-gray-400'
                        }`} />
                        {!collapsed && item.name}
                        {!collapsed && item.badge > 0 && (
                            <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-playful-coral text-white text-[10px] font-bold rounded-full px-1.5">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                        {collapsed && item.badge > 0 && (
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-playful-coral rounded-full" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 my-3 border-t border-gray-100" />

            {/* Communities Section */}
            <div className={`${collapsed ? 'px-2' : 'px-3'} flex-1 overflow-y-auto min-h-0`}>
                {!collapsed && (
                    <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Communities</span>
                        {isAuthenticated && (
                            <Link
                                href="/groups/create"
                                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-playful-teal transition-colors"
                                title="Create community"
                            >
                                <Plus className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}

                {communities.length > 0 ? (
                    <div className="space-y-0.5">
                        {communities.map(community => (
                            <Link
                                key={community.id}
                                href={`/groups/${community.slug}`}
                                title={collapsed ? community.name : undefined}
                                className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-2.5 ${collapsed ? 'px-2 py-2' : 'px-2.5 py-2'} rounded-xl text-sm transition-all duration-200 ${
                                    pathname === `/groups/${community.slug}`
                                        ? 'bg-playful-teal/10 text-playful-teal font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                                }`}
                            >
                                <div className={`${collapsed ? 'w-8 h-8' : 'w-7 h-7'} rounded-lg overflow-hidden flex-shrink-0`}>
                                    {community.avatar_url ? (
                                        <img src={community.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white text-[10px] font-bold">
                                            {community.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {!collapsed && <span className="truncate">{community.name}</span>}
                            </Link>
                        ))}
                    </div>
                ) : !collapsed && isAuthenticated ? (
                    <div className="text-center py-4">
                        <p className="text-xs text-gray-400 mb-2">No communities joined yet</p>
                        <Link href="/groups" className="text-xs font-bold text-playful-teal hover:underline">
                            Explore Communities →
                        </Link>
                    </div>
                ) : !collapsed ? (
                    <div className="text-center py-4">
                        <p className="text-xs text-gray-400 mb-2">Sign in to join communities</p>
                    </div>
                ) : null}

                {/* Explore all link */}
                {!collapsed && communities.length > 0 && (
                    <Link
                        href="/groups"
                        className="flex items-center gap-2 px-2.5 py-2 mt-1 rounded-xl text-xs font-semibold text-gray-400 hover:text-playful-teal hover:bg-gray-50 transition-colors"
                    >
                        <Compass className="w-4 h-4" />
                        Explore all communities
                    </Link>
                )}
            </div>

            {/* Collapse Toggle */}
            <div className="px-3 py-2">
                <button
                    onClick={onToggleCollapse}
                    className={`flex items-center ${collapsed ? 'justify-center w-full' : ''} gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors w-full`}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <ChevronsRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronsLeft className="w-4 h-4" />
                            Collapse
                        </>
                    )}
                </button>
            </div>

            {/* Bottom section: User / Login */}
            <div className="border-t border-gray-100 p-3 mt-auto">
                {isAuthenticated ? (
                    <div className={collapsed ? 'space-y-2' : 'space-y-1'}>
                        <Link
                            href={`/user/${profile?.username || user?.id}`}
                            title={collapsed ? displayName : undefined}
                            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-2.5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors`}
                        >
                            <div className="w-8 h-8 rounded-full bg-playful-coral text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {initials}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-playful-text truncate">{displayName}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                                </div>
                            )}
                        </Link>

                        {!collapsed && (
                            <div className="flex items-center gap-1">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-playful-text transition-colors"
                                    >
                                        <Shield className="w-3.5 h-3.5" />
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Logout
                                </button>
                            </div>
                        )}

                        {collapsed && (
                            <button
                                onClick={handleSignOut}
                                title="Logout"
                                className="flex items-center justify-center w-full p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        title={collapsed ? 'Sign In' : undefined}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-playful-coral text-white rounded-xl text-sm font-bold hover:bg-playful-coral/90 transition-colors shadow-sm ${collapsed ? '!px-2' : ''}`}
                    >
                        <LogIn className="w-4 h-4" />
                        {!collapsed && 'Sign In'}
                    </Link>
                )}
            </div>
        </aside>
    );
}
