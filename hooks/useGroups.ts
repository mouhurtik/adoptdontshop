'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ─── Types ─────────────────────────────────────────────────
export interface Group {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    avatar_url: string | null;
    cover_image_url: string | null;
    created_by: string;
    is_private: boolean;
    member_count: number;
    post_count: number;
    created_at: string;
    updated_at: string;
}

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'moderator' | 'member';
    joined_at: string;
    profile?: {
        display_name: string | null;
        avatar_url: string | null;
        username: string | null;
    };
}

export type GroupCategory = 'all' | 'general' | 'city' | 'breed' | 'adoption' | 'volunteering' | 'tips' | 'lost_found';

export const GROUP_CATEGORIES: { value: GroupCategory; label: string; emoji: string }[] = [
    { value: 'all', label: 'All Groups', emoji: '🌐' },
    { value: 'general', label: 'General', emoji: '💬' },
    { value: 'city', label: 'City / Local', emoji: '🏙️' },
    { value: 'breed', label: 'Breed Specific', emoji: '🐕' },
    { value: 'adoption', label: 'Adoption', emoji: '🏠' },
    { value: 'volunteering', label: 'Volunteering', emoji: '🤝' },
    { value: 'tips', label: 'Tips & Care', emoji: '💡' },
    { value: 'lost_found', label: 'Lost & Found', emoji: '🔍' },
];

// ─── Hooks ─────────────────────────────────────────────────

/** Fetch all groups with optional filtering */
export function useGroups(category?: string, search?: string) {
    return useQuery({
        queryKey: ['groups', category, search],
        queryFn: async (): Promise<Group[]> => {
            let query = supabase
                .from('groups')
                .select('*')
                .order('member_count', { ascending: false });

            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            if (search && search.trim()) {
                query = query.ilike('name', `%${search.trim()}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as unknown as Group[];
        },
    });
}

/** Fetch a single group by slug */
export function useGroupDetail(slug: string | undefined) {
    return useQuery({
        queryKey: ['group-detail', slug],
        queryFn: async (): Promise<Group | null> => {
            const { data, error } = await supabase
                .from('groups')
                .select('*')
                .eq('slug', slug!)
                .single();
            if (error) throw error;
            return data as unknown as Group;
        },
        enabled: !!slug,
    });
}

/** Fetch all members of a group with profiles */
export function useGroupMembers(groupId: string | undefined) {
    return useQuery({
        queryKey: ['group-members', groupId],
        queryFn: async (): Promise<GroupMember[]> => {
            const { data: members, error } = await supabase
                .from('group_members')
                .select('*')
                .eq('group_id', groupId!)
                .order('joined_at', { ascending: true });

            if (error) throw error;
            if (!members || members.length === 0) return [];

            // Batch-fetch profiles
            const userIds = [...new Set(members.map(m => m.user_id))];
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, display_name, avatar_url, username')
                .in('id', userIds);

            const profileMap = new Map((profiles || []).map(p => [p.id, p]));

            return members.map(m => ({
                ...m,
                role: m.role as GroupMember['role'],
                profile: profileMap.get(m.user_id) || undefined,
            }));
        },
        enabled: !!groupId,
    });
}

/** Fetch groups the current user has joined */
export function useMyGroups() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['my-groups', user?.id],
        queryFn: async (): Promise<Group[]> => {
            // Get group IDs user is member of
            const { data: memberships, error: memberError } = await supabase
                .from('group_members')
                .select('group_id')
                .eq('user_id', user!.id);

            if (memberError) throw memberError;
            if (!memberships || memberships.length === 0) return [];

            const groupIds = memberships.map(m => m.group_id);
            const { data: groups, error: groupError } = await supabase
                .from('groups')
                .select('*')
                .in('id', groupIds)
                .order('updated_at', { ascending: false });

            if (groupError) throw groupError;
            return (groups || []) as unknown as Group[];
        },
        enabled: !!user?.id,
    });
}

/** Check if user is a member of a group */
export function useIsMember(groupId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['is-member', groupId, user?.id],
        queryFn: async () => {
            if (!user) return null;
            const { data } = await supabase
                .from('group_members')
                .select('id, role')
                .eq('group_id', groupId!)
                .eq('user_id', user.id)
                .maybeSingle();
            return data as { id: string; role: string } | null;
        },
        enabled: !!groupId && !!user,
    });
}

/** Create a new group */
export function useCreateGroup() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (group: {
            name: string;
            slug: string;
            description?: string;
            category: string;
            is_private: boolean;
            avatar_url?: string;
            cover_image_url?: string;
        }) => {
            if (!user) throw new Error('Must be logged in');

            // Create the group
            const { data: newGroup, error: groupError } = await supabase
                .from('groups')
                .insert({
                    name: group.name,
                    slug: group.slug,
                    description: group.description || null,
                    category: group.category,
                    is_private: group.is_private,
                    avatar_url: group.avatar_url || null,
                    cover_image_url: group.cover_image_url || null,
                    created_by: user.id,
                } as Record<string, unknown>)
                .select()
                .single();

            if (groupError) throw groupError;

            // Auto-join as owner
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: (newGroup as unknown as Group).id,
                    user_id: user.id,
                    role: 'owner',
                } as Record<string, unknown>);

            if (memberError) throw memberError;

            return newGroup as unknown as Group;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['my-groups'] });
        },
    });
}

/** Join a group */
export function useJoinGroup() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (groupId: string) => {
            if (!user) throw new Error('Must be logged in');
            const { error } = await supabase
                .from('group_members')
                .insert({
                    group_id: groupId,
                    user_id: user.id,
                    role: 'member',
                } as Record<string, unknown>);
            if (error) throw error;
        },
        onSuccess: (_, groupId) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['my-groups'] });
            queryClient.invalidateQueries({ queryKey: ['is-member', groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-detail'] });
            queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
        },
    });
}

/** Leave a group */
export function useLeaveGroup() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (groupId: string) => {
            if (!user) throw new Error('Must be logged in');
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('user_id', user.id);
            if (error) throw error;
        },
        onSuccess: (_, groupId) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['my-groups'] });
            queryClient.invalidateQueries({ queryKey: ['is-member', groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-detail'] });
            queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
        },
    });
}

/** Fetch posts scoped to a group */
export function useGroupPosts(groupId: string | undefined) {
    return useQuery({
        queryKey: ['group-posts', groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('community_posts')
                .select('id, title, slug, content_text, featured_image_url, tags, like_count, comment_count, view_count, created_at, author_id')
                .eq('group_id', groupId!)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Batch-fetch author profiles
            const authorIds = [...new Set((data || []).map(p => p.author_id))];
            const { data: profiles } = authorIds.length > 0
                ? await supabase.from('profiles').select('id, display_name, avatar_url, username').in('id', authorIds)
                : { data: [] };

            const profileMap = new Map((profiles || []).map(p => [p.id, p]));

            return (data || []).map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                content_text: post.content_text || '',
                featured_image_url: post.featured_image_url,
                tags: post.tags || [],
                like_count: post.like_count || 0,
                comment_count: post.comment_count || 0,
                view_count: post.view_count || 0,
                created_at: post.created_at,
                author_id: post.author_id,
                author: profileMap.get(post.author_id) ? {
                    display_name: profileMap.get(post.author_id)!.display_name,
                    avatar_url: profileMap.get(post.author_id)!.avatar_url,
                    username: profileMap.get(post.author_id)!.username,
                } : undefined,
            }));
        },
        enabled: !!groupId,
    });
}
