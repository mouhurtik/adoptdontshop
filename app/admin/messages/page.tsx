'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    MessageSquare, Search, AlertCircle, Eye, RefreshCw,
    ArrowLeft, Check, CheckCheck, Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminConversation {
    id: string;
    pet_listing_id: string | null;
    participant_ids: string[];
    last_message: string | null;
    last_message_at: string | null;
    created_at: string | null;
    // Enriched
    participant_names: Record<string, string>;
    pet_name?: string;
    message_count: number;
}

interface AdminMessage {
    id: string;
    content: string;
    created_at: string;
    sender_name: string;
    sender_id: string;
    conversation_id: string;
    read_by: string[] | null;
}

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<AdminConversation[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<AdminConversation | null>(null);
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showMobileThread, setShowMobileThread] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Load all conversations
    const loadConversations = useCallback(async () => {
        setLoading(true);
        try {
            const { data: convos, error } = await supabase
                .from('conversations')
                .select('*')
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            if (!convos || convos.length === 0) {
                setConversations([]);
                setLoading(false);
                return;
            }

            // Collect all unique participant IDs
            const allIds = [...new Set(convos.flatMap(c => c.participant_ids || []))];
            const petIds = [...new Set(convos.map(c => c.pet_listing_id).filter(Boolean))];

            // Fetch profiles for participants
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, display_name')
                .in('id', allIds);

            const profileMap: Record<string, string> = {};
            (profiles || []).forEach(p => {
                profileMap[p.id] = p.display_name || p.username || p.id.slice(0, 8);
            });

            // Fetch pet names
            const petNameMap: Record<string, string> = {};
            if (petIds.length > 0) {
                const { data: pets } = await supabase
                    .from('pet_listings')
                    .select('id, pet_name')
                    .in('id', petIds as string[]);
                (pets || []).forEach(p => {
                    petNameMap[p.id] = p.pet_name;
                });
            }

            // Fetch message counts per conversation
            const convoIds = convos.map(c => c.id);
            const { data: msgCounts } = await supabase
                .from('messages')
                .select('conversation_id')
                .in('conversation_id', convoIds);

            const countMap: Record<string, number> = {};
            (msgCounts || []).forEach(m => {
                countMap[m.conversation_id] = (countMap[m.conversation_id] || 0) + 1;
            });

            const enriched: AdminConversation[] = convos.map(c => ({
                ...c,
                participant_names: Object.fromEntries(
                    (c.participant_ids || []).map((id: string) => [id, profileMap[id] || id.slice(0, 8)])
                ),
                pet_name: c.pet_listing_id ? petNameMap[c.pet_listing_id] : undefined,
                message_count: countMap[c.id] || 0,
            }));

            setConversations(enriched);
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load messages for a conversation
    const loadMessages = useCallback(async (convoId: string) => {
        setMessagesLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convoId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages((data || []).map(m => ({
                ...m,
                read_by: (m.read_by as unknown as string[]) || null,
            })));
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setMessagesLoading(false);
        }
    }, []);

    const handleSelectConvo = useCallback((convo: AdminConversation) => {
        setSelectedConvo(convo);
        loadMessages(convo.id);
        setShowMobileThread(true);
    }, [loadMessages]);

    const handleBack = useCallback(() => {
        setShowMobileThread(false);
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // Filter conversations
    const filteredConvos = conversations.filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        const names = Object.values(c.participant_names).join(' ').toLowerCase();
        return names.includes(q) || c.pet_name?.toLowerCase().includes(q) || c.last_message?.toLowerCase().includes(q);
    });

    // Check if message has been read by all other participants
    const isReadByAll = (msg: AdminMessage, convo: AdminConversation) => {
        if (!msg.read_by || msg.read_by.length === 0) return false;
        const others = convo.participant_ids.filter(id => id !== msg.sender_id);
        return others.every(id => msg.read_by!.includes(id));
    };

    return (
        <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-6 -mb-4 lg:-mb-8">
            <div className="flex h-[calc(100vh-8rem)] bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
                {/* ── Left: Conversation List ── */}
                <div className={`w-full lg:w-[360px] border-r border-gray-100 flex flex-col shrink-0 ${showMobileThread ? 'hidden lg:flex' : 'flex'}`}>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-xl font-heading font-bold text-playful-text flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-playful-coral" />
                                Message Monitor
                            </h1>
                            <button
                                onClick={loadConversations}
                                className="p-2 text-gray-500 hover:text-playful-coral hover:bg-playful-cream rounded-xl transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            {conversations.length} conversations · {conversations.reduce((s, c) => s + c.message_count, 0)} messages
                        </p>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                                <span className="text-sm">Loading conversations...</span>
                            </div>
                        ) : filteredConvos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-medium mb-1">No conversations found</p>
                                <p className="text-xs text-gray-400">
                                    {search ? `No results for "${search}"` : 'No messaging activity yet'}
                                </p>
                            </div>
                        ) : (
                            filteredConvos.map(convo => {
                                const isSelected = selectedConvo?.id === convo.id;
                                const participantNames = Object.values(convo.participant_names);
                                return (
                                    <button
                                        key={convo.id}
                                        onClick={() => handleSelectConvo(convo)}
                                        className={`w-full text-left p-4 border-b border-gray-50 hover:bg-playful-cream/50 transition-colors ${isSelected ? 'bg-playful-cream/70 border-l-4 border-l-playful-coral' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                                    <p className="font-bold text-sm text-gray-800 truncate">
                                                        {participantNames.join(' ↔ ')}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {convo.last_message_at
                                                            ? formatDistanceToNow(new Date(convo.last_message_at), { addSuffix: true })
                                                            : ''}
                                                    </span>
                                                </div>
                                                {convo.pet_name && (
                                                    <p className="text-xs text-playful-coral font-medium truncate">
                                                        Re: {convo.pet_name}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {convo.last_message || 'No messages yet'}
                                                </p>
                                                <span className="text-[10px] text-gray-400 mt-1 inline-block">
                                                    {convo.message_count} messages
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Right: Message Thread ── */}
                <div className={`flex-1 flex flex-col min-h-0 ${showMobileThread ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedConvo ? (
                        <>
                            {/* Thread Header */}
                            <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-3 bg-white">
                                <button
                                    onClick={handleBack}
                                    className="p-2 rounded-full hover:bg-playful-cream transition-colors lg:hidden"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-800 text-sm truncate">
                                        {Object.values(selectedConvo.participant_names).join(' ↔ ')}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {selectedConvo.pet_name && (
                                            <p className="text-xs text-playful-coral font-medium truncate">
                                                About: {selectedConvo.pet_name}
                                            </p>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            · {messages.length} msgs
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-playful-cream px-2 py-1 rounded-full">
                                    <Eye className="w-3 h-3 text-playful-coral" />
                                    <span className="text-[10px] font-bold text-playful-coral">MONITORING</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-playful-cream/20 to-white">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-sm">No messages in this conversation yet.</p>
                                    </div>
                                ) : (
                                    messages.map(msg => {
                                        const senderName = selectedConvo.participant_names[msg.sender_id] || msg.sender_name || 'Unknown';
                                        const readByAll = isReadByAll(msg, selectedConvo);
                                        return (
                                            <div key={msg.id} className="flex justify-start">
                                                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-white border border-gray-100 shadow-sm rounded-bl-md">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-xs font-bold text-playful-teal">{senderName}</p>
                                                        <span className="text-[10px] text-gray-400">
                                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{msg.content}</p>
                                                    <div className="flex items-center justify-end mt-1">
                                                        {readByAll ? (
                                                            <CheckCheck className="w-3 h-3 text-blue-500" />
                                                        ) : (
                                                            <Check className="w-3 h-3 text-gray-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Admin notice footer */}
                            <div className="border-t border-gray-100 px-4 py-3 bg-playful-cream/50 flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">
                                    Read-only monitoring · Admin cannot send messages
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-playful-cream/30">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-gray-500 text-sm max-w-xs">
                                Choose a conversation from the sidebar to monitor messages
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
