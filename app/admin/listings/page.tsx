'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { Check, X as XIcon, Trash2, Search, Eye, Archive, CheckCheck, UserPlus, Heart } from 'lucide-react';
import Link from 'next/link';
import { generatePetSlug } from '@/utils/slugUtils';

interface Listing {
    id: string;
    pet_name: string;
    breed: string;
    animal_type: string | null;
    location: string;
    status: string;
    image_url: string | null;
    caregiver_name: string;
    created_at: string;
    slug: string | null;
    user_id: string | null;
}

interface UserProfile {
    id: string;
    display_name: string | null;
    location: string | null;
}

const statusColors: Record<string, string> = {
    available: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    adopted: 'bg-blue-50 text-blue-700',
    rejected: 'bg-red-50 text-red-700',
    archived: 'bg-gray-100 text-gray-600',
};

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updating, setUpdating] = useState<string | null>(null);
    const [bulkUpdating, setBulkUpdating] = useState(false);

    // Assign modal state
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState<UserProfile[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const loadListings = useCallback(async () => {
        setLoading(true);

        let query = supabase
            .from('pet_listings')
            .select('id, pet_name, breed, animal_type, location, status, image_url, caregiver_name, created_at, slug, user_id')
            .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data } = await query;
        setListings(data || []);
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => {
        loadListings();
    }, [loadListings]);

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        await supabase
            .from('pet_listings')
            .update({ status })
            .eq('id', id);
        await loadListings();
        setUpdating(null);
    };

    const approveAllPending = async () => {
        if (!confirm(`Approve all ${pendingCount} pending listings?`)) return;
        setBulkUpdating(true);
        await supabase
            .from('pet_listings')
            .update({ status: 'available' })
            .eq('status', 'pending');
        await loadListings();
        setBulkUpdating(false);
    };

    const deleteListing = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
        setUpdating(id);
        await supabase.from('pet_listings').delete().eq('id', id);
        await loadListings();
        setUpdating(null);
    };

    // --- Assign user ---
    const searchUsers = async (query: string) => {
        if (query.length < 2) { setUserResults([]); return; }
        setSearchingUsers(true);
        const { data } = await supabase
            .from('profiles')
            .select('id, display_name, location')
            .ilike('display_name', `%${query}%`)
            .limit(8);
        setUserResults(data || []);
        setSearchingUsers(false);
    };

    const assignUser = async (listingId: string, userId: string) => {
        setUpdating(listingId);
        await supabase
            .from('pet_listings')
            .update({ user_id: userId })
            .eq('id', listingId);
        setAssigningId(null);
        setUserSearch('');
        setUserResults([]);
        await loadListings();
        setUpdating(null);
    };

    const filteredListings = listings.filter(l => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            l.pet_name.toLowerCase().includes(q) ||
            l.breed.toLowerCase().includes(q) ||
            l.caregiver_name.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q)
        );
    });

    const pendingCount = listings.filter(l => l.status === 'pending').length;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-heading font-bold text-playful-text">Listing Moderation</h1>

                {/* Approve All button */}
                {pendingCount > 0 && (
                    <button
                        onClick={approveAllPending}
                        disabled={bulkUpdating}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        <CheckCheck className="w-4 h-4" />
                        {bulkUpdating ? 'Approving...' : `Approve All Pending (${pendingCount})`}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, breed, location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['all', 'available', 'pending', 'adopted', 'rejected', 'archived'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${statusFilter === s
                                    ? 'bg-playful-teal text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading listings...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredListings.map(listing => (
                        <div
                            key={listing.id}
                            className="bg-white rounded-2xl shadow-soft border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start"
                        >
                            {/* Image */}
                            <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {listing.image_url ? (
                                    <Image
                                        src={listing.image_url}
                                        alt={listing.pet_name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                        🐾
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-playful-text">{listing.pet_name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium capitalize ${statusColors[listing.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {listing.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {listing.breed} · {listing.animal_type || 'Unknown'} · {listing.location}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Listed by {listing.caregiver_name}
                                    {' · '}{new Date(listing.created_at).toLocaleDateString()}
                                    {!listing.user_id && (
                                        <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium">Unassigned</span>
                                    )}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                <Link
                                    href={`/pet/${listing.slug || generatePetSlug(listing.pet_name, listing.id)}`}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    title="View listing"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>

                                {listing.status !== 'available' && listing.status !== 'archived' && listing.status !== 'adopted' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'available')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}

                                {listing.status === 'available' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'adopted')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                        title="Mark as Adopted"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </button>
                                )}

                                {listing.status !== 'rejected' && listing.status !== 'archived' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'rejected')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                                        title="Reject"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}

                                {listing.status !== 'archived' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'archived')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        title="Archive (hide from public)"
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                )}

                                {listing.status === 'archived' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'available')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                        title="Unarchive"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Assign user */}
                                {!listing.user_id && (
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setAssigningId(assigningId === listing.id ? null : listing.id);
                                                setUserSearch('');
                                                setUserResults([]);
                                            }}
                                            disabled={updating === listing.id}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                            title="Assign to user"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                        </button>

                                        {/* Assign dropdown */}
                                        {assigningId === listing.id && (
                                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-3">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign to User</p>
                                                <input
                                                    type="text"
                                                    placeholder="Search by email or name..."
                                                    value={userSearch}
                                                    onChange={e => {
                                                        setUserSearch(e.target.value);
                                                        searchUsers(e.target.value);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    autoFocus
                                                />
                                                <div className="mt-2 max-h-40 overflow-y-auto">
                                                    {searchingUsers && (
                                                        <p className="text-xs text-gray-400 py-2 text-center">Searching...</p>
                                                    )}
                                                    {userResults.map(u => (
                                                        <button
                                                            key={u.id}
                                                            onClick={() => assignUser(listing.id, u.id)}
                                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                        >
                                                            <p className="text-sm font-medium text-gray-700">{u.display_name || 'Unnamed'}</p>
                                                            <p className="text-xs text-gray-400">{u.location || 'No location'}</p>
                                                        </button>
                                                    ))}
                                                    {userSearch.length >= 2 && !searchingUsers && userResults.length === 0 && (
                                                        <p className="text-xs text-gray-400 py-2 text-center">No users found</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => deleteListing(listing.id)}
                                    disabled={updating === listing.id}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Delete permanently"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredListings.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-soft">
                            {search || statusFilter !== 'all'
                                ? 'No listings match your filters.'
                                : 'No listings found.'}
                        </div>
                    )}
                </div>
            )}

            {/* Close assign dropdown on outside click */}
            {assigningId && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => { setAssigningId(null); setUserSearch(''); setUserResults([]); }}
                />
            )}
        </div>
    );
}
