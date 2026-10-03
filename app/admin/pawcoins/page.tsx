'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminGuard from '../AdminGuard';
import { toast } from 'sonner';
import { Coins, Trophy, Award, RefreshCw, Send } from 'lucide-react';
import { formatTimeAgo } from '@/lib/formatTimeAgo';

interface PawCoinUser {
    id: string;
    user_id: string;
    balance: number | null;
    total_earned: number | null;
    profile?: {
        display_name: string | null;
        username: string | null;
        avatar_url: string | null;
    };
}

interface Transaction {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    reason: string;
    reference_id: string | null;
    created_at: string | null;
    profile?: {
        display_name: string | null;
    };
}

export default function AdminPawCoinsPage() {
    const [leaderboard, setLeaderboard] = useState<PawCoinUser[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [targetUserId, setTargetUserId] = useState('');
    const [amountToAward, setAmountToAward] = useState(10);
    const [awardReason, setAwardReason] = useState('community_grant');
    const [isAwarding, setIsAwarding] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        // Fetch top holders
        const { data: holders, error: holdersError } = await supabase
            .from('user_pawcoins')
            .select('*')
            .order('balance', { ascending: false })
            .limit(20);

        if (!holdersError && holders && holders.length > 0) {
            const userIds = holders.map(h => h.user_id);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, display_name, username, avatar_url')
                .in('id', userIds);

            const pMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));
            setLeaderboard(holders.map(h => ({
                ...h,
                profile: pMap[h.user_id],
            })));
        }

        // Fetch recent transactions
        const { data: txs, error: txsError } = await supabase
            .from('pawcoin_transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);

        if (!txsError && txs && txs.length > 0) {
            const txUserIds = Array.from(new Set(txs.map(t => t.user_id)));
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, display_name')
                .in('id', txUserIds);

            const pMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));
            setTransactions(txs.map(t => ({
                ...t,
                profile: pMap[t.user_id],
            })));
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAwardCoins = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUserId.trim()) {
            toast.error('Please enter a user ID');
            return;
        }

        setIsAwarding(true);
        try {
            const { error } = await supabase.rpc('award_pawcoins', {
                p_user_id: targetUserId.trim(),
                p_amount: amountToAward,
                p_reason: awardReason.trim(),
            });

            if (error) throw error;
            toast.success(`Successfully awarded ${amountToAward} PawCoins!`);
            setTargetUserId('');
            fetchData();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to award coins';
            toast.error(msg);
        } finally {
            setIsAwarding(false);
        }
    };

    return (
        <AdminGuard>
            <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 flex items-center gap-2">
                            <Coins className="w-8 h-8 text-amber-500" />
                            PawCoins Reputation Management
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Review community leaderboard, audit transaction logs, and grant reputation bounties.
                        </p>
                    </div>

                    <button
                        onClick={fetchData}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>

                {/* Quick Award Tool Card */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        Manual Coin Grant / Reward Adjustment
                    </h3>
                    <form onSubmit={handleAwardCoins} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div className="sm:col-span-2">
                            <label className="block text-gray-500 mb-1 font-semibold">User UUID</label>
                            <input
                                type="text"
                                required
                                value={targetUserId}
                                onChange={e => setTargetUserId(e.target.value)}
                                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1 font-semibold">Amount</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={amountToAward}
                                onChange={e => setAmountToAward(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1 font-semibold">Reason</label>
                            <input
                                type="text"
                                required
                                value={awardReason}
                                onChange={e => setAwardReason(e.target.value)}
                                placeholder="community_grant"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div className="sm:col-span-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isAwarding}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {isAwarding ? 'Awarding...' : 'Award PawCoins'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Leaderboard */}
                    <div className="lg:col-span-5 bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h2 className="text-base font-bold text-gray-900">Community Leaderboard</h2>
                        </div>

                        {loading ? (
                            <p className="text-xs text-gray-400 py-6 text-center">Loading leaderboard...</p>
                        ) : leaderboard.length === 0 ? (
                            <p className="text-xs text-gray-400 py-6 text-center">No holders yet.</p>
                        ) : (
                            <div className="divide-y divide-gray-100 text-xs">
                                {leaderboard.map((item, index) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 text-center font-black ${index === 0 ? 'text-amber-500 text-sm' : index === 1 ? 'text-gray-400 text-sm' : index === 2 ? 'text-amber-700 text-sm' : 'text-gray-300'}`}>
                                                #{index + 1}
                                            </span>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {item.profile?.display_name || 'Anonymous User'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-mono">
                                                    {item.user_id.substring(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-amber-600 text-sm block">
                                                {item.balance} 🪙
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {item.total_earned} earned
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="lg:col-span-7 bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Coins className="w-5 h-5 text-playful-coral" />
                            <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
                        </div>

                        {loading ? (
                            <p className="text-xs text-gray-400 py-6 text-center">Loading transactions...</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-xs text-gray-400 py-6 text-center">No transactions recorded.</p>
                        ) : (
                            <div className="divide-y divide-gray-100 text-xs">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="py-2.5 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800">
                                                    {tx.profile?.display_name || 'User'}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-500 font-medium">
                                                    {tx.reason}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">
                                                {tx.created_at ? formatTimeAgo(tx.created_at) : 'recently'}
                                            </span>
                                        </div>
                                        <span className="font-bold text-emerald-600 font-mono">
                                            +{tx.amount} 🪙
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
