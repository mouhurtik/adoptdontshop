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

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-playful-teal-text focus-visible:ring-offset-2';
const colorTransition = 'transition-colors duration-150 motion-reduce:transition-none';

export default function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
    const pathname = usePathname();
    const { user, profile, isAdmin, isAuthenticated, signOut } = useAuth();
    const { data: unreadCount = 0 } = useUnreadCount();
    const [communities, setCommunities] = useState<Community[]>([]);

    // Fetch user's joined communities
    useEffect(() => {
        // Sidebar is hidden on mobile — skip API call to save bandwidth + main thread
        if (!window.matchMedia('(min-width: 1024px)').matches) return;
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
            id="app-sidebar"
            aria-label="Desktop navigation"
            className={`hidden lg:flex flex-col fixed top-0 left-0 h-dvh overflow-y-auto overflow-x-hidden bg-white border-r border-gray-100 z-40 motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-out ${
                collapsed ? 'w-[72px]' : 'w-[260px]'
            }`}
        >
            {/* Logo */}
            <div className={`pt-4 pb-3 flex shrink-0 items-center ${collapsed ? 'px-3 justify-center' : 'px-4 justify-between'}`}>
                <Link href="/" aria-label="AdoptDontShop home" className={`flex min-h-11 min-w-11 items-center gap-2 rounded-xl group flex-shrink-0 ${collapsed ? 'justify-center' : ''} ${focusRing}`}>
                    <div className="bg-playful-coral text-white p-1.5 rounded-xl rotate-3 motion-safe:group-hover:rotate-6 motion-safe:transition-transform motion-safe:duration-150 shadow-sm">
                        <PawPrint aria-hidden="true" className="h-5 w-5 fill-current" strokeWidth={2} />
                    </div>
                    {!collapsed && (
                        <span className="text-xl leading-tight font-heading font-black tracking-tight text-playful-text whitespace-nowrap">
                            Adopt<span className="text-playful-coral-text">Dont</span>Shop
                        </span>
                    )}
                </Link>
            </div>


            {/* Main Navigation */}
            <nav aria-label="Main navigation" className="shrink-0 px-2 space-y-1">
                {mainNav.map(item => (
                    <Link
                        key={item.name}
                        href={item.path}
                        title={collapsed ? item.name : undefined}
                        aria-label={item.badge > 0 ? `${item.name} ${item.badge} unread messages` : item.name}
                        aria-current={isActive(item.path) ? 'page' : undefined}
                        className={`relative flex min-h-11 items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${colorTransition} ${focusRing} ${
                            isActive(item.path)
                                ? 'bg-playful-coral/10 text-playful-coral-text'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                        }`}
                    >
                        <item.icon aria-hidden="true" className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        <span className={collapsed ? 'sr-only' : ''}>{item.name}</span>
                        {item.badge > 0 && <span className="sr-only">{item.badge} unread messages</span>}
                        {!collapsed && item.badge > 0 && (
                            <span aria-hidden="true" className="ml-auto min-w-6 h-6 flex items-center justify-center bg-playful-coral-text text-white text-xs font-bold rounded-full px-1.5">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                        {collapsed && item.badge > 0 && (
                            <span aria-hidden="true" className="absolute top-2 right-2.5 w-2 h-2 bg-playful-coral-text rounded-full" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 my-3 shrink-0 border-t border-gray-100" />

            {/* Communities Section */}
            <nav aria-label="Community navigation" className={`${collapsed ? 'px-2' : 'px-3'} flex-1 overflow-y-auto min-h-0 py-1`}>
                {!collapsed && (
                    <div className="flex min-h-11 items-center justify-between pl-2.5 mb-1">
                        <span className="text-xs font-bold text-gray-600">Communities</span>
                        {isAuthenticated && (
                            <Link
                                href="/communities/create"
                                aria-current={pathname === '/communities/create' ? 'page' : undefined}
                                aria-label="Create community"
                                className={`flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600 hover:text-playful-teal-text ${colorTransition} ${focusRing}`}
                                title="Create community"
                            >
                                <Plus aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                            </Link>
                        )}
                    </div>
                )}

                {communities.length > 0 ? (
                    <div className="space-y-0.5">
                        {communities.map(community => (
                            <Link
                                key={community.id}
                                href={`/communities/${community.slug}`}
                                title={collapsed ? community.name : undefined}
                                aria-current={pathname === `/communities/${community.slug}` ? 'page' : undefined}
                                className={`flex min-h-11 items-center ${collapsed ? 'justify-center' : ''} gap-2.5 ${collapsed ? 'px-2 py-2' : 'px-2.5 py-2'} rounded-xl text-sm ${colorTransition} ${focusRing} ${
                                    pathname === `/communities/${community.slug}`
                                        ? 'bg-playful-teal/10 text-playful-teal-text font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text'
                                }`}
                            >
                                <div aria-hidden="true" className={`${collapsed ? 'w-8 h-8' : 'w-7 h-7'} rounded-lg overflow-hidden flex-shrink-0`}>
                                    {community.avatar_url ? (
                                        <img src={community.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-playful-teal/10 flex items-center justify-center text-playful-teal-text text-xs font-bold">
                                            {community.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className={collapsed ? 'sr-only' : 'truncate'}>{community.name}</span>
                            </Link>
                        ))}
                    </div>
                ) : !collapsed && isAuthenticated ? (
                    <div className="text-center py-4">
                        <p className="text-xs leading-5 text-gray-600 mb-1">No communities joined yet</p>
                        <Link href="/communities" aria-current={pathname === '/communities' ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-playful-teal-text hover:underline ${focusRing}`}>
                            Explore Communities →
                        </Link>
                    </div>
                ) : !collapsed ? (
                    <div className="text-center py-4">
                        <p className="text-xs leading-5 text-gray-600 mb-2">Sign in to join communities</p>
                    </div>
                ) : null}

                {/* Explore all link */}
                {!collapsed && communities.length > 0 && (
                    <Link
                        href="/communities"
                        aria-current={pathname === '/communities' ? 'page' : undefined}
                        className={`flex min-h-11 items-center gap-2 px-2.5 py-2 mt-1 rounded-xl text-xs font-semibold text-gray-600 hover:text-playful-teal-text hover:bg-gray-50 ${colorTransition} ${focusRing}`}
                    >
                        <Compass aria-hidden="true" className="w-4 h-4 shrink-0" strokeWidth={2} />
                        Explore all communities
                    </Link>
                )}
            </nav>

            {/* Collapse Toggle */}
            <div className="shrink-0 px-3 py-2">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    aria-controls="app-sidebar"
                    className={`flex min-h-11 items-center ${collapsed ? 'justify-center' : ''} gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-playful-text w-full ${colorTransition} ${focusRing}`}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <ChevronsRight aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                    ) : (
                        <>
                            <ChevronsLeft aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                            Collapse
                        </>
                    )}
                </button>
            </div>

            {/* Bottom section: User / Login */}
            <div className="shrink-0 border-t border-gray-100 p-3 mt-auto">
                {isAuthenticated ? (
                    <div className={collapsed ? 'space-y-2' : 'space-y-1'}>
                        <Link
                            href={`/user/${profile?.username || user?.id}`}
                            title={collapsed ? displayName : undefined}
                            aria-label={`View ${displayName}'s profile`}
                            aria-current={pathname === `/user/${profile?.username || user?.id}` ? 'page' : undefined}
                            className={`flex min-h-11 items-center ${collapsed ? 'justify-center px-1' : 'gap-2.5 px-2.5'} py-2 rounded-xl text-sm hover:bg-gray-50 ${colorTransition} ${focusRing}`}
                        >
                            <div aria-hidden="true" className="w-8 h-8 rounded-full bg-playful-coral/15 text-playful-coral-text flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {initials}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-playful-text truncate">{displayName}</p>
                                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                                </div>
                            )}
                        </Link>

                        {!collapsed && (
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`flex-1 flex min-h-11 items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-playful-text ${colorTransition} ${focusRing}`}
                                    >
                                        <Shield aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                                        Admin
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className={`flex-1 flex min-h-11 items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 ${colorTransition} ${focusRing}`}
                                >
                                    <LogOut aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                                    Logout
                                </button>
                            </div>
                        )}

                        {collapsed && (
                            <button
                                type="button"
                                onClick={handleSignOut}
                                title="Logout"
                                aria-label="Logout"
                                className={`flex min-h-11 items-center justify-center w-full p-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-700 ${colorTransition} ${focusRing}`}
                            >
                                <LogOut aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                            </button>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        title={collapsed ? 'Sign In' : undefined}
                        aria-current={pathname === '/login' ? 'page' : undefined}
                        className={`flex min-h-11 items-center justify-center gap-2 w-full px-4 py-2.5 bg-playful-coral-text text-white rounded-xl text-sm font-bold hover:bg-playful-coral-text/90 shadow-sm ${colorTransition} ${focusRing} ${collapsed ? '!px-2' : ''}`}
                    >
                        <LogIn aria-hidden="true" className="w-4 h-4" strokeWidth={2} />
                        <span className={collapsed ? 'sr-only' : ''}>Sign In</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}
