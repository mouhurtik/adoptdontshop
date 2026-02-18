'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PawPrint, Users, FileText, Clock, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalPets: number;
    totalApplications: number;
    totalUsers: number;
    pendingListings: number;
    availableListings: number;
    adoptedListings: number;
}

const statCards = [
    { key: 'totalPets' as const, label: 'Total Listings', icon: PawPrint, color: 'bg-playful-teal/10 text-playful-teal', border: 'border-playful-teal/20' },
    { key: 'totalApplications' as const, label: 'Applications', icon: FileText, color: 'bg-playful-coral/10 text-playful-coral', border: 'border-playful-coral/20' },
    { key: 'totalUsers' as const, label: 'Users', icon: Users, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
    { key: 'pendingListings' as const, label: 'Pending Review', icon: Clock, color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200' },
    { key: 'availableListings' as const, label: 'Active Listings', icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
    { key: 'adoptedListings' as const, label: 'Adopted', icon: TrendingUp, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalPets: 0, totalApplications: 0, totalUsers: 0,
        pendingListings: 0, availableListings: 0, adoptedListings: 0,
    });
    const [recentListings, setRecentListings] = useState<Array<{
        id: string; pet_name: string; status: string; created_at: string;
        caregiver_name: string; animal_type: string | null; slug: string | null;
    }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    { count: totalPets },
                    { count: totalApplications },
                    { count: totalUsers },
                    { count: pendingListings },
                    { count: availableListings },
                    { count: adoptedListings },
                    { data: recent },
                ] = await Promise.all([
                    supabase.from('pet_listings').select('*', { count: 'exact', head: true }),
                    supabase.from('adoption_applications').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('pet_listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('pet_listings').select('*', { count: 'exact', head: true }).eq('status', 'available'),
                    supabase.from('pet_listings').select('*', { count: 'exact', head: true }).eq('status', 'adopted'),
                    supabase.from('pet_listings')
                        .select('id, pet_name, status, created_at, caregiver_name, animal_type, slug')
                        .order('created_at', { ascending: false })
                        .limit(8),
                ]);

                setStats({
                    totalPets: totalPets || 0,
                    totalApplications: totalApplications || 0,
                    totalUsers: totalUsers || 0,
                    pendingListings: pendingListings || 0,
                    availableListings: availableListings || 0,
                    adoptedListings: adoptedListings || 0,
                });
                setRecentListings(recent || []);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            }
            setLoading(false);
        };

        loadDashboard();
    }, []);

    const statusColors: Record<string, string> = {
        available: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        adopted: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-playful-coral border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-playful-text">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your platform activity</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map(({ key, label, icon: Icon, color, border }) => (
                    <div
                        key={key}
                        className={`bg-white rounded-2xl p-5 shadow-soft border ${border} hover:shadow-md transition-shadow`}
                    >
                        <div className={`inline-flex p-2.5 rounded-xl ${color} mb-3`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-playful-text">{stats[key]}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link href="/admin/listings?status=pending" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft border border-yellow-200 hover:shadow-md transition-all group">
                    <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-playful-text text-sm group-hover:text-yellow-700 transition-colors">Review Pending</p>
                        <p className="text-xs text-gray-500">{stats.pendingListings} awaiting review</p>
                    </div>
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft border border-purple-200 hover:shadow-md transition-all group">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-playful-text text-sm group-hover:text-purple-700 transition-colors">Manage Users</p>
                        <p className="text-xs text-gray-500">{stats.totalUsers} registered</p>
                    </div>
                </Link>
                <Link href="/admin/listings" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft border border-playful-teal/20 hover:shadow-md transition-all group">
                    <div className="p-2.5 bg-playful-teal/10 text-playful-teal rounded-xl">
                        <PawPrint className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-playful-text text-sm group-hover:text-playful-teal transition-colors">All Listings</p>
                        <p className="text-xs text-gray-500">{stats.totalPets} total</p>
                    </div>
                </Link>
            </div>

            {/* Recent Listings Table */}
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-heading font-bold text-playful-text">Recent Listings</h2>
                    <Link href="/admin/listings" className="text-sm text-playful-teal font-medium hover:underline">
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Pet</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Listed By</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentListings.map(listing => (
                                <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-6 py-3 font-medium text-playful-text">{listing.pet_name}</td>
                                    <td className="px-6 py-3 text-gray-500 capitalize">{listing.animal_type || '—'}</td>
                                    <td className="px-6 py-3 text-gray-500">{listing.caregiver_name}</td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-lg font-medium capitalize ${statusColors[listing.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-400 text-xs">
                                        {new Date(listing.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {recentListings.length === 0 && (
                    <div className="text-center py-8 text-gray-400">No listings yet</div>
                )}
            </div>
        </div>
    );
}
