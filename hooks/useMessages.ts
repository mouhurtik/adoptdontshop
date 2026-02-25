'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/lib/supabase/types';

// ─── Types ─────────────────────────────────────────────────
type MessageRow = Tables<'messages'>;
type ConversationRow = Tables<'conversations'>;

export interface Conversation extends ConversationRow {
    pet_name?: string;
    pet_image?: string;
    other_participant_name?: string;
    unread_count: number;
}

export interface Message extends MessageRow {
    is_mine: boolean;
    read_by: string[] | null;
}

// ─── Fetch Helpers ─────────────────────────────────────────

async function fetchConversations(userId: string): Promise<Conversation[]> {
    // Fetch conversations
    const { data: convos, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

    if (error) throw error;
    if (!convos || convos.length === 0) return [];

    // Collect pet IDs and other user IDs for batch lookup
    const petIds = convos
        .map(c => c.pet_listing_id)
        .filter((id): id is string => !!id);
    const otherUserIds = convos
        .flatMap(c => (c.participant_ids as string[]).filter(id => id !== userId));

    // Batch fetch pet info
    let petMap: Record<string, { pet_name: string; image_url: string | null }> = {};
    if (petIds.length > 0) {
        const { data: pets } = await supabase
            .from('pet_listings')
            .select('id, pet_name, image_url')
            .in('id', petIds);
        if (pets) {
            petMap = Object.fromEntries(pets.map(p => [p.id, p]));
        }
    }

    // Batch fetch profile names
    let profileMap: Record<string, string> = {};
    if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', [...new Set(otherUserIds)]);
        if (profiles) {
            profileMap = Object.fromEntries(
                profiles.map(p => [p.id, p.display_name || 'User'])
            );
        }
    }

    return convos.map(c => {
        const pet = c.pet_listing_id ? petMap[c.pet_listing_id] : undefined;
        const otherId = (c.participant_ids as string[]).find(id => id !== userId);
        const readBy = (c as unknown as { read_by?: string[] }).read_by;

        return {
            ...c,
            participant_ids: c.participant_ids as string[],
            pet_name: pet?.pet_name,
            pet_image: pet?.image_url ?? undefined,
            other_participant_name: otherId ? profileMap[otherId] || 'User' : 'User',
            unread_count: readBy && !readBy.includes(userId) ? 1 : 0,
        };
    });
}

async function fetchMessages(conversationId: string, userId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

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

            // Get user display name
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();

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
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            recipientId,
            petListingId,
            initialMessage,
        }: {
            recipientId: string;
            petListingId?: string;
            initialMessage: string;
        }) => {
            if (!user) throw new Error('Must be logged in');
            if (recipientId === user.id) throw new Error('Cannot message yourself');

            // Check if conversation already exists between these users
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .contains('participant_ids', [user.id, recipientId]);

            if (existing && existing.length > 0) {
                // Send message in existing conversation
                const convId = existing[0].id;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', user.id)
                    .single();

                await supabase.from('messages').insert({
                    conversation_id: convId,
                    sender_id: user.id,
                    sender_name: profile?.display_name || user.email || 'User',
                    content: initialMessage,
                    message_type: 'text',
                    participants: [user.id, recipientId],
                    read_by: [user.id],
                });

                await supabase
                    .from('conversations')
                    .update({
                        last_message: initialMessage.substring(0, 100),
                        last_message_at: new Date().toISOString(),
                    })
                    .eq('id', convId);

                return convId;
            }

            // Create new conversation
            const { data: newConvo, error: convError } = await supabase
                .from('conversations')
                .insert({
                    pet_listing_id: petListingId || null,
                    participant_ids: [user.id, recipientId],
                    last_message: initialMessage.substring(0, 100),
                    last_message_at: new Date().toISOString(),
                })
                .select('id')
                .single();

            if (convError) throw convError;

            // Send first message
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();

            const { error: msgError } = await supabase.from('messages').insert({
                conversation_id: newConvo.id,
                sender_id: user.id,
                sender_name: profile?.display_name || user.email || 'User',
                content: initialMessage,
                message_type: 'text',
                participants: [user.id, recipientId],
                read_by: [user.id],
            });

            if (msgError) throw msgError;

            return newConvo.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
}

/** Mark all unread messages in a conversation as read by the current user */
export function useMarkAsRead() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useCallback(async (conversationId: string) => {
        if (!user) return;

        // Get messages not read by user
        const { data: unread } = await supabase
            .from('messages')
            .select('id, read_by')
            .eq('conversation_id', conversationId)
            .not('sender_id', 'eq', user.id)
            .not('read_by', 'cs', JSON.stringify([user.id]));

        if (!unread || unread.length === 0) return;

        // Update each to add user to read_by
        for (const msg of unread) {
            const currentReadBy = (msg.read_by as string[]) || [];
            if (!currentReadBy.includes(user.id)) {
                await supabase
                    .from('messages')
                    .update({ read_by: [...currentReadBy, user.id] })
                    .eq('id', msg.id);
            }
        }

        // Refresh queries
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

