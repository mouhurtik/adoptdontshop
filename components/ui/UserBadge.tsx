'use client';

import { Crown, Shield, Star, Sparkles, Award } from 'lucide-react';

const badgeConfig: Record<string, { label: string; icon: typeof Crown; bg: string; text: string; border: string }> = {
    founder: {
        label: 'Founder',
        icon: Crown,
        bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
        text: 'text-amber-700',
        border: 'border-amber-300',
    },
    admin: {
        label: 'Admin',
        icon: Shield,
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
    },
    patron_platinum: {
        label: 'Platinum Patron',
        icon: Sparkles,
        bg: 'bg-gradient-to-r from-slate-100 to-blue-50',
        text: 'text-slate-700',
        border: 'border-slate-300',
    },
    patron_gold: {
        label: 'Gold Patron',
        icon: Star,
        bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
    },
    patron_silver: {
        label: 'Silver Patron',
        icon: Award,
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
    },
};

interface UserBadgeProps {
    badge: string;
    size?: 'sm' | 'md';
}

export default function UserBadge({ badge, size = 'sm' }: UserBadgeProps) {
    const config = badgeConfig[badge];
    if (!config) return null;

    const Icon = config.icon;
    const isSmall = size === 'sm';

    return (
        <span
            className={`inline-flex items-center gap-1 ${isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} font-bold rounded-full border ${config.bg} ${config.text} ${config.border} shadow-sm`}
            title={config.label}
        >
            <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {config.label}
        </span>
    );
}
