'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Shield, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface AdminGroup {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    avatar_url: string | null;
    is_private: boolean;
    member_count: number;
    post_count: number;
    created_at: string;
    created_by: string;
    creator_name?: string;
}

export default function AdminGroupsPage() {
    const [groups, setGroups] = useState<AdminGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [members, setMembers] = useState<Record<string, { id: string; user_id: string; role: string; display_name: string | null; email?: string }[]>>({});

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        const { data, error } = await supabase
            // @ts-expect-error — groups table exists but types need regenerating
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) { console.error(error); setLoading(false); return; }

        // Fetch creator profiles
        const creatorIds = [...new Set((data || []).map(g => g.created_by))];
        const { data: profiles } = creatorIds.length > 0
            ? await supabase.from('profiles').select('id, display_name').in('id', creatorIds)
            : { data: [] };

        const profileMap = new Map((profiles || []).map(p => [p.id, p.display_name || 'Unknown']));

        setGroups((data || []).map(g => ({
            ...g,
            creator_name: profileMap.get(g.created_by) || 'Unknown',
        })) as unknown as AdminGroup[]);
        setLoading(false);
    };

    const fetchMembers = async (groupId: string) => {
        if (members[groupId]) return;

        const { data: memberData } = await supabase
            .from('group_members')
            .select('id, user_id, role')
            .eq('group_id', groupId);

        if (!memberData) return;

        const userIds = memberData.map(m => m.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', userIds);

        const profileMap = new Map((profiles || []).map(p => [p.id, p.display_name]));

        setMembers(prev => ({
            ...prev,
            [groupId]: memberData.map(m => ({
                ...m,
                display_name: profileMap.get(m.user_id) || 'Unknown',
            })),
        }));
    };

    const handleToggleExpand = (groupId: string) => {
        if (expandedGroup === groupId) {
            setExpandedGroup(null);
        } else {
            setExpandedGroup(groupId);
            fetchMembers(groupId);
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        if (!confirm('Are you sure you want to delete this group? All members and group posts will be affected.')) return;

        const { error } = await supabase.from('groups').delete().eq('id', groupId);
        if (error) {
            alert('Failed to delete group: ' + error.message);
        } else {
            setGroups(prev => prev.filter(g => g.id !== groupId));
        }
    };

    const handleRemoveMember = async (groupId: string, userId: string) => {
        if (!confirm('Remove this member from the group?')) return;

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId);

        if (error) {
            alert('Failed: ' + error.message);
        } else {
            setMembers(prev => ({
                ...prev,
                [groupId]: (prev[groupId] || []).filter(m => m.user_id !== userId),
            }));
        }
    };

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.slug.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all community groups, view members, and moderate.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-playful-teal" />
                    <span><strong>{groups.length}</strong> total groups</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search groups by name, slug, or category..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal"
                />
            </div>

            {/* Groups Table */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No groups found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredGroups.map(group => (
                        <div key={group.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                            {/* Group Row */}
                            <div className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    {group.avatar_url ? (
                                        <img src={group.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-bold text-sm">
                                            {group.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-gray-800 truncate">{group.name}</h3>
                                        {group.is_private && (
                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">Private</span>
                                        )}
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium capitalize">{group.category}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        by {group.creator_name} · Created {new Date(group.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {group.member_count}</span>
                                    <span>{group.post_count} posts</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <a
                                        href={`/groups/${group.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="View group"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleToggleExpand(group.id)}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="View members"
                                    >
                                        {expandedGroup === group.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete group"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded: Members */}
                            {expandedGroup === group.id && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Members ({members[group.id]?.length || 0})</h4>
                                    {members[group.id]?.length ? (
                                        <div className="space-y-2">
                                            {members[group.id].map(m => (
                                                <div key={m.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                                                    <div className="w-7 h-7 rounded-full bg-playful-teal text-white flex items-center justify-center text-xs font-bold">
                                                        {(m.display_name || 'U').charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 flex-1">{m.display_name || 'Unknown'}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{m.role}</span>
                                                    {m.role !== 'owner' && (
                                                        <button
                                                            onClick={() => handleRemoveMember(group.id, m.user_id)}
                                                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Remove member"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400">Loading members...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
