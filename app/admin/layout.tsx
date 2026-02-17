import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminSidebar from './AdminSidebar';

export const metadata: Metadata = {
    title: 'Admin Dashboard | AdoptDontShop',
    description: 'Admin dashboard for managing users, listings, and applications.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check admin role
    const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

    if (!role) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 md:p-8 md:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
