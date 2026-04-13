'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, MessageCircle, FileText, Info, ArrowLeft, Lock, PenSquare, Crown, Shield, Star } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { PostCardData } from '@/components/community/PostCard';
import PostCardList from '@/components/community/PostCardList';
import GroupChat from '@/components/groups/GroupChat';
import { useGroupDetail, useGroupMembers, useGroupPosts, useIsMember, useJoinGroup, useLeaveGroup, GROUP_CATEGORIES } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'posts' | 'chat' | 'members' | 'about';

const ROLE_ICONS: Record<string, React.ReactNode> = {
    owner: <Crown className="w-3.5 h-3.5 text-yellow-500" />,
    admin: <Shield className="w-3.5 h-3.5 text-blue-500" />,
    moderator: <Star className="w-3.5 h-3.5 text-purple-500" />,
};

const ROLE_LABELS: Record<string, string> = {
    owner: 'Owner',
    admin: 'Admin',
    moderator: 'Moderator',
    member: 'Member',
};

interface GroupDetailProps {
    slug: string;
}

const GroupDetail = ({ slug }: GroupDetailProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const { user } = useAuth();

    const { data: group, isLoading: loadingGroup } = useGroupDetail(slug);
    const { data: members } = useGroupMembers(group?.id);
    const { data: posts } = useGroupPosts(group?.id);
    const { data: membership } = useIsMember(group?.id);
    const joinGroup = useJoinGroup();
    const leaveGroup = useLeaveGroup();

    const isMember = !!membership;
    const isOwner = membership?.role === 'owner';
    const categoryInfo = GROUP_CATEGORIES.find(c => c.value === group?.category);

    const handleJoinLeave = () => {
        if (!user) { router.push('/login'); return; }
        if (!group) return;
        if (isMember && !isOwner) {
            leaveGroup.mutate(group.id);
        } else if (!isMember) {
            joinGroup.mutate(group.id);
        }
    };

    if (loadingGroup) {
        return (
            <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="bg-white rounded-[2rem] h-64 animate-pulse shadow-soft" />
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen text-center">
                <h1 className="text-3xl font-heading font-black text-playful-text">Group not found</h1>
                <Link href="/groups" className="text-playful-teal font-bold mt-4 inline-block">← Back to Groups</Link>
            </div>
        );
    }

    return (
        <div className="pt-6 lg:pt-24 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Back */}
                <Link href="/groups" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-playful-text transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> All Groups
                </Link>

                {/* Group Header Card */}
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden mb-8">
                        {/* Cover */}
                        <div className="relative h-32 md:h-48 bg-gradient-to-br from-playful-teal/30 via-playful-coral/20 to-playful-yellow/20">
                            {group.cover_image_url && (
                                <img src={group.cover_image_url} alt={group.name} className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="px-6 md:px-10 pb-6 -mt-10 relative">
                            <div className="flex items-end gap-4 mb-4">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden flex-shrink-0">
                                    {group.avatar_url ? (
                                        <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-heading font-black text-2xl">
                                            {group.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pb-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-xl md:text-2xl font-heading font-black text-playful-text truncate">
                                            {group.name}
                                        </h1>
                                        {group.is_private && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" /> {group.member_count} members
                                        </span>
                                        <span>{group.post_count} posts</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                                            {categoryInfo?.emoji} {categoryInfo?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                                    {isMember && (
                                        <Link href={`/community/write?group=${group.id}`}>
                                            <PrimaryButton size="sm" className="shadow">
                                                <PenSquare className="w-4 h-4 mr-1.5" /> Post
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleJoinLeave}
                                        disabled={isOwner}
                                        className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                                            isOwner
                                                ? 'bg-playful-teal/10 text-playful-teal cursor-default'
                                                : isMember
                                                    ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                                                    : 'bg-playful-teal text-white hover:bg-playful-teal/90 shadow-sm hover:shadow'
                                        }`}
                                    >
                                        {isOwner ? 'Owner' : isMember ? 'Leave' : 'Join Group'}
                                    </button>
                                </div>
                            </div>

                            {group.description && (
                                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                                    {group.description}
                                </p>
                            )}

                            {/* Mobile Action Bar */}
                            <div className="flex md:hidden items-center gap-2 mt-4">
                                {isMember && (
                                    <Link href={`/community/write?group=${group.id}`} className="flex-1">
                                        <PrimaryButton size="sm" className="w-full shadow">
                                            <PenSquare className="w-4 h-4 mr-1.5" /> Post
                                        </PrimaryButton>
                                    </Link>
                                )}
                                <button
                                    onClick={handleJoinLeave}
                                    disabled={isOwner}
                                    className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${
                                        isOwner
                                            ? 'bg-playful-teal/10 text-playful-teal'
                                            : isMember
                                                ? 'bg-gray-100 text-gray-500'
                                                : 'bg-playful-teal text-white'
                                    }`}
                                >
                                    {isOwner ? 'Owner' : isMember ? 'Leave' : 'Join'}
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center border-t border-gray-100 px-6 md:px-10">
                            {([
                                { key: 'posts' as Tab, icon: FileText, label: 'Posts' },
                                { key: 'chat' as Tab, icon: MessageCircle, label: 'Chat' },
                                { key: 'members' as Tab, icon: Users, label: 'Members' },
                                { key: 'about' as Tab, icon: Info, label: 'About' },
                            ]).map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 md:px-6 py-3.5 text-sm font-bold border-b-2 transition-all ${
                                        activeTab === tab.key
                                            ? 'border-playful-teal text-playful-teal'
                                            : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden md:inline">{tab.label}</span>
                                    {tab.key === 'members' && (
                                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{group.member_count}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Tab Content */}
                <div>
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div>
                            {posts && posts.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {posts.map((post, index) => (
                                        <ScrollReveal key={post.id} mode="fade-up" delay={index * 0.03} width="100%">
                                            <PostCardList post={post as PostCardData} />
                                        </ScrollReveal>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-[2rem] shadow-soft">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-heading font-bold text-playful-text mb-2">
                                        No posts yet
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {isMember ? 'Be the first to post in this group!' : 'Join this group to start posting.'}
                                    </p>
                                    {isMember && (
                                        <Link href={`/community/write?group=${group.id}`}>
                                            <PrimaryButton size="md">
                                                <PenSquare className="w-4 h-4 mr-1.5" /> Write Post
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <div>
                            {isMember ? (
                                <GroupChat
                                    groupId={group.id}
                                    groupName={group.name}
                                    groupAvatarUrl={group.avatar_url}
                                />
                            ) : (
                                <div className="text-center py-16 bg-white rounded-[2rem] shadow-soft">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-heading font-bold text-playful-text mb-2">
                                        Group Chat
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Join this group to access the chat.
                                    </p>
                                    <button
                                        onClick={handleJoinLeave}
                                        className="px-6 py-2.5 rounded-full bg-playful-teal text-white font-bold text-sm hover:bg-playful-teal/90 shadow-sm hover:shadow transition-all"
                                    >
                                        Join Group
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden">
                            <div className="divide-y divide-gray-50">
                                {members && members.length > 0 ? (
                                    members.map(member => (
                                        <Link
                                            key={member.id}
                                            href={`/user/${member.profile?.username || member.user_id}`}
                                            className="flex items-center gap-3 px-6 py-4 hover:bg-playful-cream/30 transition-colors"
                                        >
                                            {member.profile?.avatar_url ? (
                                                <img src={member.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-playful-teal text-white flex items-center justify-center font-bold text-sm">
                                                    {(member.profile?.display_name || 'A').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-playful-text truncate">
                                                    {member.profile?.display_name || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ROLE_ICONS[member.role]}
                                                <span className="text-xs font-medium text-gray-400 capitalize">{ROLE_LABELS[member.role]}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-sm text-gray-400">No members yet</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="bg-white rounded-[2rem] shadow-soft p-6 md:p-10 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">About</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {group.description || 'No description provided.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-2xl font-black text-playful-text">{group.member_count}</p>
                                    <p className="text-xs text-gray-400 font-medium">Members</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-2xl font-black text-playful-text">{group.post_count}</p>
                                    <p className="text-xs text-gray-400 font-medium">Posts</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Category</span>
                                        <span className="font-medium text-playful-text">{categoryInfo?.emoji} {categoryInfo?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Privacy</span>
                                        <span className="font-medium text-playful-text">{group.is_private ? '🔒 Private' : '🌐 Public'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Created</span>
                                        <span className="font-medium text-playful-text">{new Date(group.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
