'use client';

import { useState } from 'react';
import { Hash, Plus, Loader2, X } from 'lucide-react';
import type { GroupConversation } from '@/hooks/useGroupChat';

interface RoomSidebarProps {
    rooms: GroupConversation[];
    activeRoomId: string | null;
    onSelectRoom: (room: GroupConversation) => void;
    onCreateRoom?: (roomName: string) => void;
    isCreating?: boolean;
    canCreate?: boolean;
}

const RoomSidebar = ({
    rooms,
    activeRoomId,
    onSelectRoom,
    onCreateRoom,
    isCreating = false,
    canCreate = false,
}: RoomSidebarProps) => {
    const [showCreate, setShowCreate] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreate = () => {
        const name = newRoomName.trim();
        if (!name || !onCreateRoom) return;
        onCreateRoom(name);
        setNewRoomName('');
        setShowCreate(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Channels
                </h3>
                {canCreate && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="p-1 rounded-lg hover:bg-playful-cream transition-colors text-gray-400 hover:text-playful-teal"
                        title="Create channel"
                    >
                        {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Create Room Input */}
            {showCreate && (
                <div className="px-3 py-2 border-b border-gray-100 bg-playful-cream/30">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="channel-name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-400 text-playful-text font-medium"
                            maxLength={30}
                            autoFocus
                        />
                        <button
                            onClick={handleCreate}
                            disabled={!newRoomName.trim() || isCreating}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-playful-teal text-white hover:bg-playful-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {/* Room List */}
            <div className="py-1">
                {rooms.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                        <Hash className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No channels yet</p>
                    </div>
                ) : (
                    rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => onSelectRoom(room)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                                activeRoomId === room.id
                                    ? 'bg-playful-teal/10 text-playful-teal font-bold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-playful-text font-medium'
                            }`}
                        >
                            <Hash className={`w-4 h-4 flex-shrink-0 ${
                                activeRoomId === room.id ? 'text-playful-teal' : 'text-gray-400'
                            }`} />
                            <span className="truncate">{room.room_name.toLowerCase()}</span>
                            {room.last_message && (
                                <span className="ml-auto text-[10px] text-gray-400 truncate max-w-[80px]">
                                    {room.last_message}
                                </span>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoomSidebar;
