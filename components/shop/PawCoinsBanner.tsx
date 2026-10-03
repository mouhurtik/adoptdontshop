'use client';

import { Coins, Trophy, Heart } from 'lucide-react';
import { useUserPawCoins } from '@/hooks/useShop';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PawCoinsBanner() {
    const { isAuthenticated } = useAuth();
    const { data: pawcoins } = useUserPawCoins();

    return (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-playful-coral rounded-[2rem] p-5 md:p-6 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                        <Coins className="w-8 h-8 text-white animate-bounce duration-1000" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                                Community Rewards
                            </span>
                            <span className="text-xs font-semibold text-white/90">
                                100% Platform Reputation
                            </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-heading font-black mt-1">
                            {isAuthenticated ? (
                                <>
                                    You have <span className="underline decoration-white/40">{pawcoins?.balance || 0} PawCoins</span>
                                </>
                            ) : (
                                'Earn PawCoins with Every Purchase'
                            )}
                        </h3>
                        <p className="text-xs text-white/85 max-w-xl mt-0.5">
                            Purchases via our verified partner links support stray animal welfare and earn you reputation badges.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                    <Link
                        href="/support-us"
                        className="px-4 py-2 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-white/95 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Support NGO</span>
                    </Link>
                </div>
            </div>

            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <Trophy className="w-48 h-48" />
            </div>
        </div>
    );
}
