'use client';

import { useRouter } from 'next/navigation';
import { Users, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMember, useJoinGroup, useLeaveGroup, type Group, GROUP_CATEGORIES } from '@/hooks/useGroups';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    general: { bg: 'bg-gray-100', text: 'text-gray-600' },
    city: { bg: 'bg-blue-100', text: 'text-blue-600' },
    breed: { bg: 'bg-orange-100', text: 'text-orange-600' },
    adoption: { bg: 'bg-green-100', text: 'text-green-600' },
    volunteering: { bg: 'bg-purple-100', text: 'text-purple-600' },
    tips: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    lost_found: { bg: 'bg-red-100', text: 'text-red-600' },
};

const GroupCard = ({ group }: { group: Group }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { data: membership } = useIsMember(group.id);
    const joinGroup = useJoinGroup();
    const leaveGroup = useLeaveGroup();

    const isMember = !!membership;
    const categoryInfo = GROUP_CATEGORIES.find(c => c.value === group.category);
    const categoryColor = CATEGORY_COLORS[group.category] || CATEGORY_COLORS.general;

    const handleJoinLeave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/login'); return; }

        if (isMember) {
            if (membership?.role === 'owner') return; // Owners can't leave
            leaveGroup.mutate(group.id);
        } else {
            joinGroup.mutate(group.id);
        }
    };

    const handleClick = () => {
        router.push(`/groups/${group.slug}`);
    };

    return (
        <article
            onClick={handleClick}
            className="group bg-white rounded-[1.5rem] shadow-soft border-2 border-transparent hover:border-playful-teal/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
        >
            {/* Cover Image */}
            <div className="relative h-28 md:h-32 bg-gradient-to-br from-playful-teal/20 via-playful-coral/10 to-playful-yellow/20 overflow-hidden">
                {group.cover_image_url && (
                    <img
                        src={group.cover_image_url}
                        alt={group.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                )}
                {/* Category badge */}
                <div className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColor.bg} ${categoryColor.text}`}>
                    {categoryInfo?.emoji} {categoryInfo?.label || group.category}
                </div>
                {/* Private badge */}
                {group.is_private && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full">
                        <Lock className="w-3 h-3" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-3 -mt-8 relative">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white overflow-hidden flex-shrink-0">
                        {group.avatar_url ? (
                            <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-heading font-black text-lg">
                                {group.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-base font-heading font-bold text-playful-text mb-1 group-hover:text-playful-teal transition-colors line-clamp-1">
                    {group.name}
                </h3>

                {group.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">
                        {group.description}
                    </p>
                )}

                {/* Footer: Stats + Join */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                        </span>
                        <span>{group.post_count} posts</span>
                    </div>

                    {isMember ? (
                        <button
                            onClick={handleJoinLeave}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                                membership?.role === 'owner'
                                    ? 'bg-playful-teal/10 text-playful-teal cursor-default'
                                    : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                            }`}
                        >
                            {membership?.role === 'owner' ? 'Owner' : 'Joined ✓'}
                        </button>
                    ) : (
                        <button
                            onClick={handleJoinLeave}
                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-playful-teal text-white hover:bg-playful-teal/90 transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1"
                        >
                            Join <ArrowRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default GroupCard;
