'use client';

import { TAG_LABELS } from './PostCard';

const ALL_TAGS = ['all', 'success_story', 'fundraiser', 'virtual_adoption', 'tips', 'discussion', 'lost_found'];

const TAG_PILL_COLORS: Record<string, string> = {
    all: 'bg-playful-text text-white',
    success_story: 'bg-green-500 text-white',
    fundraiser: 'bg-purple-500 text-white',
    virtual_adoption: 'bg-blue-500 text-white',
    tips: 'bg-yellow-500 text-white',
    discussion: 'bg-orange-500 text-white',
    lost_found: 'bg-red-500 text-white',
};

interface TagFilterProps {
    activeTag: string;
    onTagChange: (tag: string) => void;
}

const TagFilter = ({ activeTag, onTagChange }: TagFilterProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => {
                const isActive = activeTag === tag;
                const label = tag === 'all' ? 'All Posts' : TAG_LABELS[tag] || tag;
                return (
                    <button
                        key={tag}
                        onClick={() => onTagChange(tag)}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${isActive
                            ? `${TAG_PILL_COLORS[tag]} shadow-md scale-105`
                            : 'bg-white text-gray-500 hover:bg-playful-cream hover:text-playful-text shadow-sm border border-gray-100'
                            }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default TagFilter;
