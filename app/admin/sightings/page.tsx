'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminGuard from '../AdminGuard';
import { toast } from 'sonner';
import { Check, X, Trash2, RefreshCw, MapPin, Syringe, Scissors } from 'lucide-react';

interface AdminSighting {
    id: string;
    user_id: string | null;
    animal_type: string;
    name: string | null;
    description: string | null;
    location_name: string | null;
    city: string | null;
    latitude: number;
    longitude: number;
    image_url: string | null;
    is_vaccinated: boolean | null;
    is_sterilized: boolean | null;
    status: string;
    created_at: string | null;
}

export default function AdminSightingsPage() {
    const [sightings, setSightings] = useState<AdminSighting[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchSightings = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('street_animal_sightings').select('*');
        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
            toast.error('Failed to load animal sightings');
        } else {
            setSightings((data || []) as AdminSighting[]);
        }
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => {
        fetchSightings();
    }, [fetchSightings]);

    const updateStatus = async (sighting: AdminSighting, newStatus: string) => {
        const { error } = await supabase
            .from('street_animal_sightings')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', sighting.id);

        if (error) {
            toast.error('Failed to update status');
            return;
        }

        // If approved to active, award 10 PawCoins to the submitter!
        if (newStatus === 'active' && sighting.user_id) {
            await supabase.rpc('award_pawcoins', {
                p_user_id: sighting.user_id,
                p_amount: 10,
                p_reason: 'sighting_approved',
                p_reference_id: sighting.id,
            });
        }

        toast.success(`Spot marked as ${newStatus}`);
        fetchSightings();
    };

    const deleteSighting = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sighting permanently?')) return;
        const { error } = await supabase
            .from('street_animal_sightings')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete sighting');
        } else {
            toast.success('Sighting deleted');
            fetchSightings();
        }
    };

    return (
        <AdminGuard>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 flex items-center gap-2">
                            <MapPin className="w-8 h-8 text-playful-coral" />
                            MapCat Sightings Moderation
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Review and approve community-submitted street animal spots.
                        </p>
                    </div>

                    <button
                        onClick={fetchSightings}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {['pending', 'active', 'removed', 'all'].map(status => (
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

                {/* Sightings Grid/Table */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-xs text-gray-400">Loading spots...</div>
                    ) : sightings.length === 0 ? (
                        <div className="p-12 text-center text-xs text-gray-400">No {statusFilter} animal spots found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Animal</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Health</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sightings.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {s.image_url ? (
                                                        <img src={s.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                                            {s.animal_type === 'cat' ? '🐱' : '🐕'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-gray-900">{s.name || 'Unnamed Spot'}</p>
                                                        <p className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{s.description || 'No description'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 capitalize font-semibold text-gray-600">{s.animal_type}</td>
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-800">{s.location_name || '—'}</p>
                                                <span className="text-[10px] text-gray-400">{s.city || 'India'} (Lat: {s.latitude.toFixed(3)}, Lng: {s.longitude.toFixed(3)})</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    {s.is_vaccinated && (
                                                        <span className="p-1 rounded-md bg-emerald-50 text-emerald-600" title="Vaccinated">
                                                            <Syringe className="w-3.5 h-3.5" />
                                                        </span>
                                                    )}
                                                    {s.is_sterilized && (
                                                        <span className="p-1 rounded-md bg-teal-50 text-teal-600" title="Sterilized">
                                                            <Scissors className="w-3.5 h-3.5" />
                                                        </span>
                                                    )}
                                                    {!s.is_vaccinated && !s.is_sterilized && (
                                                        <span className="text-[10px] text-gray-400">—</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    s.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                                    s.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {s.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(s, 'active')}
                                                            title="Approve (+10 PawCoins)"
                                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(s, 'removed')}
                                                            title="Reject"
                                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteSighting(s.id)}
                                                    title="Delete"
                                                    className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-gray-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
