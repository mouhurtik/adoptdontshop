'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { Check, X, Trash2, Search, Eye } from 'lucide-react';
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

const statusColors: Record<string, string> = {
    available: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    adopted: 'bg-blue-50 text-blue-700',
    rejected: 'bg-red-50 text-red-700',
};

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updating, setUpdating] = useState<string | null>(null);

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

    const deleteListing = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
        setUpdating(id);
        await supabase.from('pet_listings').delete().eq('id', id);
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

    return (
        <div>
            <h1 className="text-3xl font-heading font-bold text-playful-text mb-6">Listing Moderation</h1>

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

                <div className="flex gap-2">
                    {['all', 'available', 'pending', 'adopted', 'rejected'].map(s => (
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
                            <div className="flex gap-2 flex-shrink-0">
                                <Link
                                    href={`/pet/${listing.slug || generatePetSlug(listing.pet_name, listing.id)}`}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    title="View listing"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>

                                {listing.status !== 'available' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'available')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}

                                {listing.status !== 'rejected' && (
                                    <button
                                        onClick={() => updateStatus(listing.id, 'rejected')}
                                        disabled={updating === listing.id}
                                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteListing(listing.id)}
                                    disabled={updating === listing.id}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Delete"
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
        </div>
    );
}
