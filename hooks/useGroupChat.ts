'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Message } from '@/hooks/useMessages';

// ─── Types ─────────────────────────────────────────────────

export interface GroupConversation {
    id: string;
    group_id: string;
    group_name: string;
    group_avatar_url: string | null;
    is_group_chat: boolean;
    last_message: string | null;
    last_message_at: string | null;
    participant_ids: string[];
    member_count?: number;
}

// ─── Hooks ─────────────────────────────────────────────────

/** Get or create a group chat conversation for a group */
export function useGroupConversation(groupId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['group-conversation', groupId],
        queryFn: async (): Promise<GroupConversation | null> => {
            // Cast to any because group_id/is_group_chat columns are added by migration
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('group_id' as string, groupId!)
                .eq('is_group_chat' as string, true)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                const conv = data as Record<string, unknown>;
                return {
                    id: conv.id as string,
                    group_id: conv.group_id as string,
                    group_name: (conv.group_name as string) || 'Group Chat',
                    group_avatar_url: conv.group_avatar_url as string | null,
                    is_group_chat: true,
                    last_message: conv.last_message as string | null,
                    last_message_at: conv.last_message_at as string | null,
                    participant_ids: conv.participant_ids as string[],
                };
            }
            return null;
        },
        enabled: !!groupId && !!user,
    });
}

/** Create a group chat conversation (called when first message is sent) */
export function useCreateGroupConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            groupName,
            groupAvatarUrl,
            memberIds,
        }: {
            groupId: string;
            groupName: string;
            groupAvatarUrl?: string | null;
            memberIds: string[];
        }) => {
            // Use RPC or raw insert with cast — columns added by migration
            const insertPayload = {
                group_id: groupId,
                is_group_chat: true,
                group_name: groupName,
                group_avatar_url: groupAvatarUrl || null,
                participant_ids: memberIds,
                last_message: null,
                last_message_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('conversations')
                .insert(insertPayload as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['group-conversation', vars.groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-conversations'] });
        },
    });
}

/** Fetch group chat messages */
export function useGroupMessages(conversationId: string | null) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['group-messages', conversationId],
        queryFn: async (): Promise<Message[]> => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId!)
                .eq('is_deleted', false)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data ?? []).map(m => ({
                ...m,
                is_mine: m.sender_id === user!.id,
                read_by: (m.read_by as unknown as string[]) || null,
            }));
        },
        enabled: !!conversationId && !!user?.id,
    });
}

/** Send a message in a group chat */
export function useSendGroupMessage() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => {
            if (!user) throw new Error('Must be logged in');

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();

            const senderName = profile?.display_name || user.email || 'User';

            const { error: msgError } = await supabase.from('messages').insert({
                conversation_id: conversationId,
                sender_id: user.id,
                sender_name: senderName,
                content,
                message_type: 'text',
                participants: [],
                read_by: [user.id],
            });

            if (msgError) throw msgError;

            await supabase
                .from('conversations')
                .update({
                    last_message: content.substring(0, 100),
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', conversationId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['group-messages', variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ['group-conversations'] });
            queryClient.invalidateQueries({ queryKey: ['group-conversation'] });
        },
    });
}

/** List all group conversations user is part of */
export function useGroupConversations() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['group-conversations', user?.id],
        queryFn: async (): Promise<GroupConversation[]> => {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('is_group_chat' as string, true)
                .contains('participant_ids', [user!.id])
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            return (data ?? []).map(c => {
                const conv = c as Record<string, unknown>;
                return {
                    id: conv.id as string,
                    group_id: conv.group_id as string,
                    group_name: (conv.group_name as string) || 'Group Chat',
                    group_avatar_url: conv.group_avatar_url as string | null,
                    is_group_chat: true,
                    last_message: conv.last_message as string | null,
                    last_message_at: conv.last_message_at as string | null,
                    participant_ids: conv.participant_ids as string[],
                };
            });
        },
        enabled: !!user?.id,
    });
}

/** Realtime subscription for group chat messages */
export function useGroupMessageRealtime(conversationId: string | null) {
    const queryClient = useQueryClient();
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    const subscribe = useCallback(() => {
        if (!conversationId) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        const channel = supabase
            .channel(`group-messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['group-messages', conversationId] });
                    queryClient.invalidateQueries({ queryKey: ['group-conversations'] });
                }
            )
            .subscribe();

        channelRef.current = channel;
    }, [conversationId, queryClient]);

    useEffect(() => {
        subscribe();
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [subscribe]);
}
