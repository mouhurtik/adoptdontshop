import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PawPrint, Users, FileText, Clock } from 'lucide-react';

async function getStats() {
    const supabase = await createServerSupabaseClient();

    const [
        { count: totalPets },
        { count: totalApplications },
        { count: totalUsers },
        { count: pendingListings },
    ] = await Promise.all([
        supabase.from('pet_listings').select('*', { count: 'exact', head: true }),
        supabase.from('adoption_applications').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('pet_listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
        totalPets: totalPets || 0,
        totalApplications: totalApplications || 0,
        totalUsers: totalUsers || 0,
        pendingListings: pendingListings || 0,
    };
}

const statCards = [
    { key: 'totalPets', label: 'Total Pet Listings', icon: PawPrint, color: 'bg-playful-teal/10 text-playful-teal' },
    { key: 'totalApplications', label: 'Adoption Applications', icon: FileText, color: 'bg-playful-coral/10 text-playful-coral' },
    { key: 'totalUsers', label: 'Registered Users', icon: Users, color: 'bg-playful-lavender text-purple-600' },
    { key: 'pendingListings', label: 'Pending Listings', icon: Clock, color: 'bg-playful-yellow/30 text-yellow-700' },
] as const;

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-heading font-bold text-playful-text mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(({ key, label, icon: Icon, color }) => (
                    <div
                        key={key}
                        className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100"
                    >
                        <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-playful-text">{stats[key]}</p>
                        <p className="text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
