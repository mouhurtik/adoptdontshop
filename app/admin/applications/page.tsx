'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    ClipboardList, Eye, CheckCircle, XCircle, Clock,
    ChevronDown, ChevronUp, User, Phone, Briefcase, Heart,
    PawPrint, AlertCircle, Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdoptionApplication {
    id: string;
    created_at: string;
    pet_listing_id: string | null;
    full_name: string;
    mobile_number: string | null;
    gender: string | null;
    age: string | null;
    occupation: string | null;
    financial_status: string | null;
    pet_experience: string | null;
    family_approval: string | null;
    adoption_reason: string | null;
    agreed_responsibility: boolean;
    agreed_terms: boolean;
    status: string;
    pet_name?: string;
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<AdoptionApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const { data, error } = await supabase
            .from('adoption_applications')
            .select('*, pet_listings(pet_name)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
            return;
        }

        const mapped = (data ?? []).map((app: Record<string, unknown>) => ({
            ...app,
            pet_name: (app.pet_listings as Record<string, string> | null)?.pet_name || 'Unknown Pet',
        })) as AdoptionApplication[];

        setApplications(mapped);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        const { error } = await supabase
            .from('adoption_applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status } : app)
            );
        }
        setUpdatingId(null);
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        reviewed: 'bg-blue-100 text-blue-700',
    };

    const statusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            case 'reviewed': return <Eye className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const pendingCount = applications.filter(a => a.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-playful-coral" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-playful-text flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-playful-coral" />
                        Adoption Applications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {applications.length} total · {pendingCount} pending review
                    </p>
                </div>
                <button
                    onClick={fetchApplications}
                    className="text-sm text-playful-teal hover:text-playful-teal/80 font-medium"
                >
                    Refresh
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-100">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No adoption applications yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all"
                        >
                            {/* Summary row */}
                            <button
                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-playful-coral/10 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-playful-coral" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-playful-text truncate">{app.full_name}</span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {statusIcon(app.status)}
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <PawPrint className="w-3 h-3" /> {app.pet_name}
                                        </span>
                                        <span>
                                            {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                                {expandedId === app.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            {/* Expanded details */}
                            {expandedId === app.id && (
                                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/30">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{app.mobile_number || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{app.gender || 'N/A'} · Age: {app.age || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{app.occupation || 'N/A'} · {app.financial_status || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PawPrint className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Experience: {app.pet_experience || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Family: {app.family_approval || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                Terms: {app.agreed_terms ? '✅' : '❌'} · Responsibility: {app.agreed_responsibility ? '✅' : '❌'}
                                            </span>
                                        </div>
                                    </div>

                                    {app.adoption_reason && (
                                        <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 mb-1">Reason for Adoption</p>
                                            <p className="text-sm text-gray-700">{app.adoption_reason}</p>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 mt-4">
                                        {app.status !== 'approved' && (
                                            <button
                                                onClick={() => updateStatus(app.id, 'approved')}
                                                disabled={updatingId === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-full text-xs font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                                            </button>
                                        )}
                                        {app.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                disabled={updatingId === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Reject
                                            </button>
                                        )}
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(app.id, 'reviewed')}
                                                disabled={updatingId === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Mark Reviewed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
