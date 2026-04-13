'use client';

import { useState, useEffect } from 'react';
import { Search, MessageCircle, Trash2, Flag, ChevronDown, ChevronUp, Users, Eye, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface GroupChatInfo {
    id: string;
    group_name: string;
    group_avatar_url: string | null;
    group_id: string;
    last_message: string | null;
    last_message_at: string | null;
    participant_count: number;
}

interface ChatMessage {
    id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    created_at: string;
    is_deleted: boolean;
    is_flagged?: boolean;
    flagged_reason?: string;
}

export default function AdminGroupChatPage() {
    const [groupChats, setGroupChats] = useState<GroupChatInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedChat, setExpandedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [loadingMessages, setLoadingMessages] = useState<string | null>(null);

    useEffect(() => {
        fetchGroupChats();
    }, []);

    const fetchGroupChats = async () => {
        setLoading(true);
        // Fetch conversations that are group chats
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('is_group_chat' as string, true)
            .order('last_message_at', { ascending: false });

        if (error) { console.error(error); setLoading(false); return; }

        setGroupChats((data || []).map(c => {
            const conv = c as Record<string, unknown>;
            return {
                id: conv.id as string,
                group_name: (conv.group_name as string) || 'Group Chat',
                group_avatar_url: conv.group_avatar_url as string | null,
                group_id: conv.group_id as string,
                last_message: conv.last_message as string | null,
                last_message_at: conv.last_message_at as string | null,
                participant_count: ((conv.participant_ids as string[]) || []).length,
            };
        }));
        setLoading(false);
    };

    const fetchMessages = async (conversationId: string) => {
        if (messages[conversationId]) return;
        setLoadingMessages(conversationId);

        const { data, error } = await supabase
            .from('messages')
            .select('id, content, sender_id, sender_name, created_at, is_deleted')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) { console.error(error); setLoadingMessages(null); return; }

        setMessages(prev => ({
            ...prev,
            [conversationId]: (data || []).map(m => ({
                ...m,
                is_flagged: false,
                flagged_reason: undefined,
            })),
        }));
        setLoadingMessages(null);
    };

    const handleToggleExpand = (chatId: string) => {
        if (expandedChat === chatId) {
            setExpandedChat(null);
        } else {
            setExpandedChat(chatId);
            fetchMessages(chatId);
        }
    };

    const handleDeleteMessage = async (conversationId: string, messageId: string) => {
        if (!confirm('Delete this message? It will be hidden from users.')) return;

        const { error } = await supabase
            .from('messages')
            .update({ is_deleted: true })
            .eq('id', messageId);

        if (error) {
            alert('Failed: ' + error.message);
        } else {
            setMessages(prev => ({
                ...prev,
                [conversationId]: (prev[conversationId] || []).map(m =>
                    m.id === messageId ? { ...m, is_deleted: true } : m
                ),
            }));
        }
    };

    const handleFlagMessage = async (conversationId: string, messageId: string) => {
        const reason = prompt('Reason for flagging (optional):') ?? '';

        const { error } = await supabase
            .from('messages')
            .update({
                is_flagged: true,
                flagged_reason: reason || 'Flagged by admin',
            } as Record<string, unknown>)
            .eq('id', messageId);

        if (error) {
            alert('Failed: ' + error.message);
        } else {
            setMessages(prev => ({
                ...prev,
                [conversationId]: (prev[conversationId] || []).map(m =>
                    m.id === messageId ? { ...m, is_flagged: true, flagged_reason: reason || 'Flagged by admin' } : m
                ),
            }));
        }
    };

    const filteredChats = groupChats.filter(c =>
        c.group_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Group Chat Monitoring</h1>
                    <p className="text-sm text-gray-500 mt-1">Read-only access to group chat messages. Moderate and flag inappropriate content.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4 text-playful-teal" />
                    <span><strong>{groupChats.length}</strong> group chats</span>
                </div>
            </div>

            {/* Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                    <strong>Admin View:</strong> This is a read-only monitoring panel. You can view, delete, and flag messages but cannot send messages in group chats.
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search group chats..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal"
                />
            </div>

            {/* Chat List */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : filteredChats.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No group chats found</p>
                    <p className="text-xs mt-1">Group chats are created when someone sends the first message in a group.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredChats.map(chat => (
                        <div key={chat.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                            {/* Chat Row */}
                            <div
                                className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                onClick={() => handleToggleExpand(chat.id)}
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    {chat.group_avatar_url ? (
                                        <img src={chat.group_avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-bold text-sm">
                                            {chat.group_name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-gray-800 truncate">{chat.group_name}</h3>
                                    {chat.last_message && (
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{chat.last_message}</p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {chat.participant_count}</span>
                                    {chat.last_message_at && (
                                        <span>{formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}</span>
                                    )}
                                </div>

                                {/* Expand */}
                                <div className="flex-shrink-0">
                                    {expandedChat === chat.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </div>
                            </div>

                            {/* Expanded: Messages */}
                            {expandedChat === chat.id && (
                                <div className="border-t border-gray-100 bg-gray-50/30 max-h-[500px] overflow-y-auto">
                                    <div className="p-4 space-y-1.5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs text-gray-400 font-medium">Last 50 messages (newest first)</span>
                                        </div>

                                        {loadingMessages === chat.id ? (
                                            <p className="text-xs text-gray-400 py-4 text-center">Loading messages...</p>
                                        ) : (messages[chat.id] || []).length === 0 ? (
                                            <p className="text-xs text-gray-400 py-4 text-center">No messages yet</p>
                                        ) : (
                                            (messages[chat.id] || []).map(msg => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex items-start gap-2 p-2.5 rounded-lg border transition-colors ${
                                                        msg.is_deleted ? 'bg-red-50/50 border-red-100 opacity-60'
                                                            : msg.is_flagged ? 'bg-yellow-50 border-yellow-200'
                                                                : 'bg-white border-gray-100 hover:border-gray-200'
                                                    }`}
                                                >
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-xs font-bold text-playful-teal">{msg.sender_name}</span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                                            </span>
                                                            {msg.is_deleted && <span className="text-[10px] text-red-500 font-medium">Deleted</span>}
                                                            {msg.is_flagged && (
                                                                <span className="text-[10px] text-yellow-600 font-medium flex items-center gap-0.5">
                                                                    <Flag className="w-2.5 h-2.5" /> Flagged
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-xs ${msg.is_deleted ? 'text-gray-400 italic line-through' : 'text-gray-700'} break-words`}>
                                                            {msg.is_deleted ? 'Message deleted' : msg.content}
                                                        </p>
                                                        {msg.is_flagged && msg.flagged_reason && (
                                                            <p className="text-[10px] text-yellow-600 mt-0.5">Reason: {msg.flagged_reason}</p>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    {!msg.is_deleted && (
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            {!msg.is_flagged && (
                                                                <button
                                                                    onClick={() => handleFlagMessage(chat.id, msg.id)}
                                                                    className="p-1 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
                                                                    title="Flag message"
                                                                >
                                                                    <Flag className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteMessage(chat.id, msg.id)}
                                                                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Delete message"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
