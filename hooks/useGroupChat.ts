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
    room_name: string;
    last_message: string | null;
    last_message_at: string | null;
    participant_ids: string[];
    member_count?: number;
}

// ─── Hooks ─────────────────────────────────────────────────

/** Get all chat rooms for a group */
export function useGroupRooms(groupId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['group-rooms', groupId],
        queryFn: async (): Promise<GroupConversation[]> => {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('group_id' as string, groupId!)
                .eq('is_group_chat' as string, true)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data ?? []).map(c => {
                const conv = c as Record<string, unknown>;
                return {
                    id: conv.id as string,
                    group_id: conv.group_id as string,
                    group_name: (conv.group_name as string) || 'Group Chat',
                    group_avatar_url: conv.group_avatar_url as string | null,
                    is_group_chat: true,
                    room_name: (conv.room_name as string) || 'General',
                    last_message: conv.last_message as string | null,
                    last_message_at: conv.last_message_at as string | null,
                    participant_ids: conv.participant_ids as string[],
                };
            });
        },
        enabled: !!groupId && !!user,
    });
}

/** Get a single group conversation (kept for backward compat — returns first room) */
export function useGroupConversation(groupId: string | undefined) {
    const { data: rooms, ...rest } = useGroupRooms(groupId);
    return {
        data: rooms?.[0] ?? null,
        ...rest,
    };
}

/** Create a new chat room in a group */
export function useCreateGroupRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            groupId,
            groupName,
            groupAvatarUrl,
            roomName,
            memberIds,
        }: {
            groupId: string;
            groupName: string;
            groupAvatarUrl?: string | null;
            roomName: string;
            memberIds: string[];
        }) => {
            const insertPayload = {
                group_id: groupId,
                is_group_chat: true,
                group_name: groupName,
                group_avatar_url: groupAvatarUrl || null,
                room_name: roomName,
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
            queryClient.invalidateQueries({ queryKey: ['group-rooms', vars.groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-conversation', vars.groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-conversations'] });
        },
    });
}

/** Create a group chat conversation (backward compat — creates default "General" room) */
export function useCreateGroupConversation() {
    const createRoom = useCreateGroupRoom();
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
            return createRoom.mutateAsync({
                groupId,
                groupName,
                groupAvatarUrl,
                roomName: 'General',
                memberIds,
            });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['group-rooms', vars.groupId] });
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
    const { user, profile } = useAuth();

    return useMutation({
        mutationFn: async ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => {
            if (!user) throw new Error('Must be logged in');

            // Use profile from AuthContext — no extra DB fetch
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
            queryClient.invalidateQueries({ queryKey: ['group-rooms'] });
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
                    room_name: (conv.room_name as string) || 'General',
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
                    queryClient.invalidateQueries({ queryKey: ['group-rooms'] });
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
