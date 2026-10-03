'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminGuard from '../AdminGuard';
import { toast } from 'sonner';
import { Check, X, Eye, RefreshCw, HeartHandshake, IndianRupee } from 'lucide-react';
import Link from 'next/link';

interface AdminFundraiser {
    id: string;
    title: string;
    slug: string;
    category: string;
    target_amount: number;
    raised_amount: number | null;
    payment_upi: string | null;
    city: string | null;
    status: string;
    is_urgent: boolean | null;
    image_url: string | null;
    created_at: string | null;
}

export default function AdminFundraisersPage() {
    const [fundraisers, setFundraisers] = useState<AdminFundraiser[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchFundraisers = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('fundraisers').select('*');
        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
            toast.error('Failed to load fundraisers');
        } else {
            setFundraisers((data || []) as AdminFundraiser[]);
        }
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => {
        fetchFundraisers();
    }, [fetchFundraisers]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('fundraisers')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            toast.error('Failed to update status');
        } else {
            toast.success(`Fundraiser marked as ${newStatus}`);
            fetchFundraisers();
        }
    };

    const updateRaisedAmount = async (id: string, currentAmount: number) => {
        const input = prompt('Enter updated total raised amount in INR:', currentAmount.toString());
        if (input === null) return;
        const newAmount = parseFloat(input);
        if (isNaN(newAmount) || newAmount < 0) {
            toast.error('Invalid amount');
            return;
        }

        const { error } = await supabase
            .from('fundraisers')
            .update({ raised_amount: newAmount, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            toast.error('Failed to update amount');
        } else {
            toast.success('Raised amount updated');
            fetchFundraisers();
        }
    };

    return (
        <AdminGuard>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 flex items-center gap-2">
                            <HeartHandshake className="w-8 h-8 text-playful-coral" />
                            Fundraiser Moderation
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Review and approve user-submitted causes, update amounts, and manage urgency.
                        </p>
                    </div>

                    <button
                        onClick={fetchFundraisers}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {['pending', 'active', 'completed', 'rejected', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                statusFilter === status
                                    ? 'bg-playful-coral text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-xs text-gray-400">Loading fundraisers...</div>
                    ) : fundraisers.length === 0 ? (
                        <div className="p-12 text-center text-xs text-gray-400">No {statusFilter} fundraisers found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Cause</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Target / Raised</th>
                                        <th className="p-4">UPI ID</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {fundraisers.map(f => (
                                        <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {f.image_url ? (
                                                        <img src={f.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">🐾</div>
                                                    )}
                                                    <div>
                                                        <Link href={`/fundraisers/${f.slug}`} target="_blank" className="font-bold text-gray-900 hover:text-playful-coral line-clamp-1">
                                                            {f.title}
                                                        </Link>
                                                        <span className="text-[10px] text-gray-400">
                                                            {f.city || 'India'} · {f.is_urgent ? '🚨 URGENT' : 'Normal'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 capitalize font-semibold text-gray-600">{f.category}</td>
                                            <td className="p-4 font-mono font-medium">
                                                ₹{Number(f.raised_amount || 0).toLocaleString('en-IN')} / ₹{Number(f.target_amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4 font-mono text-gray-600">{f.payment_upi || '—'}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    f.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                                    f.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                    f.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {f.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {f.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(f.id, 'active')}
                                                            title="Approve"
                                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(f.id, 'rejected')}
                                                            title="Reject"
                                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => updateRaisedAmount(f.id, Number(f.raised_amount || 0))}
                                                    title="Update Raised Amount"
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center gap-1 text-[11px] font-bold"
                                                >
                                                    <IndianRupee className="w-3.5 h-3.5" />
                                                    Amount
                                                </button>
                                                <Link
                                                    href={`/fundraisers/${f.slug}`}
                                                    target="_blank"
                                                    title="View Public Page"
                                                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 inline-block"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
