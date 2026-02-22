import type { Metadata } from 'next';
import AdminGuard from './AdminGuard';

 
export const metadata: Metadata = {
    title: 'Admin Dashboard | AdoptDontShop',
    description: 'Admin dashboard for managing users, listings, and applications.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminGuard>{children}</AdminGuard>;
}
