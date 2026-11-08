'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

export interface MessageMember {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
}

const publicFields = 'id, display_name, username, avatar_url';
export const isMemberId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// Keep PostgREST filter syntax and wildcard characters out of user input.
export function normalizeMemberSearch(value: string) {
    return value.trim().replace(/^@/, '').replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 64);
}

export function useMessageMember(id: string, enabled: boolean) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['message-member', user?.id, id],
        enabled: enabled && !!user && isMemberId(id) && id !== user.id,
        queryFn: async (): Promise<MessageMember | null> => {
            const { data, error } = await supabase.from('profiles').select(publicFields).eq('id', id).maybeSingle();
            if (error) throw error;
            return data;
        },
    });
}

export function useMessageMemberSearch(search: string) {
    const { user } = useAuth();
    const needle = normalizeMemberSearch(search);
    return useQuery({
        queryKey: ['message-member-search', user?.id, needle],
        enabled: !!user && needle.length >= 2,
        staleTime: 30_000,
        queryFn: async (): Promise<MessageMember[]> => {
            const literal = needle.replace(/_/g, '\\_');
            const { data, error } = await supabase.from('profiles').select(publicFields)
                .neq('id', user!.id)
                .or(`display_name.ilike.%${literal}%,username.ilike.%${literal}%`)
                .order('display_name', { ascending: true }).limit(12);
            if (error) throw error;
            return data ?? [];
        },
    });
}
