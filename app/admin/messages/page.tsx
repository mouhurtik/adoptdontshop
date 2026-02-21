'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MessageSquare, Search, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminMessage {
    id: string;
    content: string;
    created_at: string;
    sender_name: string;
    sender_id: string;
    conversation_id: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadMessages = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(200);

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error('Failed to load admin messages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const filteredMessages = messages.filter(m => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            m.content.toLowerCase().includes(q) ||
            m.sender_name?.toLowerCase().includes(q)
        );
    });

    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-playful-text flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-playful-coral" />
                        Message Monitoring
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Intercept and review all platform communications for safety.
                    </p>
                </div>
                <button 
                    onClick={loadMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search messages by content or sender..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral shadow-sm"
                />
            </div>

            {/* Messages Feed */}
            <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-gray-500 font-medium flex flex-col items-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-playful-coral mb-4" />
                        Intercepting messages...
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No messages found matching "{search}".</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map(msg => (
                            <div key={msg.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold shadow-sm">
                                            {msg.sender_name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{msg.sender_name}</p>
                                            <p className="text-xs text-gray-500 font-mono">
                                                ID: {msg.sender_id.slice(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-500">
                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                        </p>
                                        <p className="text-xs text-playful-coral font-medium mt-1">
                                            Conv: {msg.conversation_id.slice(0, 8)}...
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-2 relative overflow-hidden group">
                                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{msg.content}</p>
                                    {/* Action overlay */}
                                    <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-gray-50 to-transparent w-24 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 text-playful-coral cursor-help" title="Monitored for safety">
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
