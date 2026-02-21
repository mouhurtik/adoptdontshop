'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Users, ShoppingBag, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const tabs = [
    { name: 'Browse', icon: PawPrint, path: '/browse' },
    { name: 'Community', icon: Users, path: '/community' },
    { name: 'Store', icon: ShoppingBag, path: '/resources' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { isAuthenticated, profile, user } = useAuth();

    const isActive = (path: string) => pathname.startsWith(path);

    const meActive = pathname.startsWith('/user') || pathname.startsWith('/profile') || pathname === '/login';
    const displayInitial = (profile?.display_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)]">
                    {tabs.map((tab) => {
                        const active = isActive(tab.path);
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.path}
                                prefetch={false}
                                className={`
                                    flex flex-col items-center justify-center flex-1
                                    py-2.5
                                    transition-colors duration-150
                                    ${active
                                        ? 'text-playful-coral'
                                        : 'text-gray-400 active:text-gray-500'
                                    }
                                `}
                            >
                                <Icon
                                    className="h-[22px] w-[22px]"
                                    strokeWidth={active ? 2.4 : 1.8}
                                />
                                <span className={`text-[10px] mt-0.5 leading-tight ${
                                    active ? 'font-bold' : 'font-medium'
                                }`}>
                                    {tab.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Me / Login tab */}
                    <Link
                        href={isAuthenticated ? `/user/${profile?.username || user?.id}` : '/login'}
                        prefetch={false}
                        className={`
                            flex flex-col items-center justify-center flex-1
                            py-2.5
                            transition-colors duration-150
                            ${meActive
                                ? 'text-playful-coral'
                                : 'text-gray-400 active:text-gray-500'
                            }
                        `}
                    >
                        {isAuthenticated ? (
                            <div className={`
                                w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold
                                ${meActive
                                    ? 'bg-playful-coral text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }
                            `}>
                                {displayInitial}
                            </div>
                        ) : (
                            <LogIn
                                className="h-[22px] w-[22px]"
                                strokeWidth={meActive ? 2.4 : 1.8}
                            />
                        )}
                        <span className={`text-[10px] mt-0.5 leading-tight ${
                            meActive ? 'font-bold' : 'font-medium'
                        }`}>
                            {isAuthenticated ? 'Me' : 'Login'}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
