'use client';
/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase generated types lag behind new RPCs; casts are narrow and temporary */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/lib/supabase/types';

// ─── Types ─────────────────────────────────────────────────
type MessageRow = Tables<'messages'>;
type ConversationRow = Tables<'conversations'>;

export interface Conversation extends ConversationRow {
    other_participant_name?: string;
    other_participant_avatar?: string;
    unread_count: number;
}

export interface Message extends MessageRow {
    is_mine: boolean;
    read_by: string[] | null;
}

// ─── Fetch Helpers ─────────────────────────────────────────

async function fetchConversations(userId: string): Promise<Conversation[]> {
    // Fetch conversations — bounded to prevent unbounded payload growth (PERF-1)
    const { data: convos, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    if (!convos || convos.length === 0) return [];

    // Collect other user IDs for batch profile lookup
    const otherUserIds = convos
        .flatMap(c => (c.participant_ids as string[]).filter(id => id !== userId));



    // Batch fetch profile names
    let profileMap: Record<string, { name: string; avatar: string | null }> = {};
    if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .in('id', [...new Set(otherUserIds)]);
        if (profiles) {
            profileMap = Object.fromEntries(
                profiles.map(p => [p.id, { name: p.display_name || 'User', avatar: p.avatar_url }])
            );
        }
    }

    // Count real unread messages per conversation: messages sent by someone
    // else whose `read_by` array does not include me. (`conversations` has no
    // read-tracking column — the previous cast read a non-existent field and
    // always produced 0.)
    const unreadMap: Record<string, number> = {};
    const { data: msgRows } = await supabase        .from('messages')
        .select('conversation_id, sender_id, read_by')
        .in('conversation_id', convos.map(c => c.id))
        .limit(2000);
    for (const m of msgRows || []) {
        if (m.sender_id === userId) continue;
        const readBy = Array.isArray(m.read_by) ? (m.read_by as string[]) : [];
        if (!readBy.includes(userId)) {
            unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
        }
    }

    return convos.map(c => {
        const otherId = (c.participant_ids as string[]).find(id => id !== userId);
        const otherProfile = otherId ? profileMap[otherId] : undefined;

        return {
            ...c,
            participant_ids: c.participant_ids as string[],
            other_participant_name: otherProfile?.name || 'User',
            other_participant_avatar: otherProfile?.avatar ?? undefined,
            unread_count: unreadMap[c.id] || 0,
        };
    });
}

async function fetchMessages(conversationId: string, userId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(100);

    if (error) throw error;
    return (data ?? []).map(m => ({
        ...m,
        is_mine: m.sender_id === userId,
        read_by: (m.read_by as unknown as string[]) || null,
    }));
}

// ─── Hooks ─────────────────────────────────────────────────

/** Fetch all conversations for the current user */
export function useConversations() {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['conversations', user?.id],
        queryFn: () => fetchConversations(user!.id),
        enabled: !!user?.id,
    });
}

/** Fetch messages for a specific conversation */
export function useConversationMessages(conversationId: string | null) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => fetchMessages(conversationId!, user!.id),
        enabled: !!conversationId && !!user?.id,
        refetchInterval: false,
    });
}

/** Send a message in an existing conversation */
export function useSendMessage() {
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

            // Insert message
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

            // Update conversation's last message
            const { error: convError } = await supabase
                .from('conversations')
                .update({
                    last_message: content.substring(0, 100),
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', conversationId);

            if (convError) throw convError;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
}

/** Start a new conversation (or return existing one) */
export function useStartConversation() {
    const queryClient = useQueryClient();
    const { user, profile } = useAuth();

    return useMutation({
        mutationFn: async ({
            recipientId,
            initialMessage,
        }: {
            recipientId: string;
            initialMessage: string;
        }) => {
            if (!user) throw new Error('Must be logged in');
            if (recipientId === user.id) throw new Error('Cannot message yourself');

            // Use profile from AuthContext — single source, no extra DB fetches
            const senderName = profile?.display_name || user.email || 'User';

            // Atomic get-or-create via RPC — handles duplicate-creation race (BUG-9)
            const { data: convId, error: rpcError } = await (supabase.rpc as any)('get_or_create_conversation', {
                p_other_id: recipientId,
                p_initial_message: initialMessage,
            });
            if (rpcError) throw rpcError;
            if (!convId) throw new Error('Failed to get conversation');

            // Insert the initial message (RPC does not insert messages)
            const { error: msgError } = await supabase.from('messages').insert({
                conversation_id: convId as string,
                sender_id: user.id,
                sender_name: senderName,
                content: initialMessage,
                message_type: 'text',
                participants: [user.id, recipientId] as unknown as any,
                read_by: [user.id] as unknown as any,
            } as any);
            if (msgError) throw msgError;

            // Refresh last_message (covers both existing and newly-created cases)
            await supabase
                .from('conversations')
                .update({
                    last_message: initialMessage.substring(0, 100),
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', convId as string);

            return convId as string;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
}

/** Mark all unread messages in a conversation as read — atomic server-side (BUG-8) */
export function useMarkAsRead() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useCallback(async (conversationId: string) => {
        if (!user) return;
        const { error } = await (supabase.rpc as any)('mark_conversation_read', {
            p_conversation_id: conversationId,
        });
        if (error) {
            console.error('[useMarkAsRead] rpc failed:', error.message);
            return;
        }
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }, [user, queryClient]);
}

/** Hook to get unread message count for navbar badge */
export function useUnreadCount() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['unreadCount', user?.id],
        queryFn: async () => {
            if (!user) return 0;

            // Count conversations where the user hasn't read the last message
            const { data: convos } = await supabase
                .from('conversations')
                .select('id, last_message_at')
                .contains('participant_ids', [user.id]);

            if (!convos || convos.length === 0) return 0;

            // Check messages in these conversations that aren't read by user
            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .in('conversation_id', convos.map(c => c.id))
                .not('sender_id', 'eq', user.id)
                .not('read_by', 'cs', JSON.stringify([user.id]));

            return count ?? 0;
        },
        enabled: !!user?.id,
        refetchInterval: 30000, // Poll every 30s as fallback
    });
}

/** Realtime subscription for new messages */
export function useMessageRealtime(conversationId: string | null) {
    const queryClient = useQueryClient();
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    const subscribe = useCallback(() => {
        if (!conversationId) return;

        // Clean up existing channel
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
                    queryClient.invalidateQueries({ queryKey: ['conversations'] });
                    queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
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

