'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Shield, ShieldOff, Search } from 'lucide-react';

interface UserWithRole {
    id: string;
    display_name: string | null;
    account_type: string | null;
    organization_name: string | null;
    location: string | null;
    created_at: string | null;
    roles: string[];
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserWithRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);

        // Get all profiles
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, account_type, organization_name, location, created_at')
            .order('created_at', { ascending: false });

        // Get all roles
        const { data: roles } = await supabase
            .from('user_roles')
            .select('user_id, role');

        const roleMap = new Map<string, string[]>();
        (roles || []).forEach(r => {
            const existing = roleMap.get(r.user_id) || [];
            if (r.role) existing.push(r.role);
            roleMap.set(r.user_id, existing);
        });

        const usersWithRoles: UserWithRole[] = (profiles || []).map(p => ({
            ...p,
            roles: roleMap.get(p.id) || ['user'],
        }));

        setUsers(usersWithRoles);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const toggleAdmin = async (userId: string, isAdmin: boolean) => {
        setUpdating(userId);
        try {
            if (isAdmin) {
                // Remove admin role
                await supabase
                    .from('user_roles')
                    .delete()
                    .eq('user_id', userId)
                    .eq('role', 'admin');
            } else {
                // Add admin role
                await supabase
                    .from('user_roles')
                    .insert({ user_id: userId, role: 'admin' });
            }
            await loadUsers();
        } catch (err) {
            console.error('Failed to toggle role:', err);
        }
        setUpdating(null);
    };

    const filteredUsers = users.filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.display_name?.toLowerCase().includes(q) ||
            u.organization_name?.toLowerCase().includes(q) ||
            u.id.toLowerCase().includes(q)
        );
    });

    return (
        <div>
            <h1 className="text-3xl font-heading font-bold text-playful-text mb-6">User Management</h1>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal"
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading users...</div>
            ) : (
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">User</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Type</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Location</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Roles</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-500">Joined</th>
                                    <th className="text-right px-6 py-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => {
                                    const isAdmin = user.roles.includes('admin');
                                    return (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-playful-text">
                                                    {user.display_name || 'Unnamed User'}
                                                </p>
                                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                    {user.id.slice(0, 8)}...
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg capitalize">
                                                    {user.account_type || 'individual'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {user.location || '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles.map(role => (
                                                        <span
                                                            key={role}
                                                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-lg ${role === 'admin'
                                                                    ? 'bg-playful-coral/10 text-playful-coral'
                                                                    : 'bg-playful-teal/10 text-playful-teal'
                                                                }`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {user.created_at
                                                    ? new Date(user.created_at).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => toggleAdmin(user.id, isAdmin)}
                                                    disabled={updating === user.id}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${isAdmin
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-playful-teal/10 text-playful-teal hover:bg-playful-teal/20'
                                                        }`}
                                                >
                                                    {isAdmin ? (
                                                        <>
                                                            <ShieldOff className="w-3.5 h-3.5" />
                                                            Remove Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="w-3.5 h-3.5" />
                                                            Make Admin
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {search ? 'No users match your search.' : 'No users found.'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
