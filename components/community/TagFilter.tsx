'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const activeLabel = activeTag === 'all' ? 'All Posts' : TAG_LABELS[activeTag] || activeTag;

    const handleCloseModal = () => {
        setIsOpen(false);
        setTimeout(() => setIsDropdownOpen(false), 300);
    };

    return (
        <div className={`relative ${isOpen ? 'z-[100]' : 'z-30'}`}>
            {/* Mobile Popout Modal with Custom Dropdown inside */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex justify-between items-center px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-gray-100 transition-all bg-white text-gray-700 hover:bg-playful-cream min-w-[130px]"
                >
                    <span className="flex items-center gap-1.5">Topic: <span className="text-playful-teal px-1 truncate max-w-[80px]">{activeLabel}</span></span>
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
                
                <AnimatePresence>
                    {isOpen && (
                        <div 
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
                            onClick={handleCloseModal}
                        >
                            <motion.div
                                className="bg-white rounded-[2rem] p-6 shadow-xl w-full max-w-md border-2 border-playful-cream relative"
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isDropdownOpen) setIsDropdownOpen(false);
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-heading font-bold text-xl text-playful-teal">Filter Topics</h3>
                                    <button 
                                        onClick={handleCloseModal} 
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors active-scale"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2 px-1">Select a category</label>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                                                className="w-full flex justify-between items-center bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-700 outline-none transition-all cursor-pointer hover:border-playful-teal/50"
                                            >
                                                <span>{activeLabel}</span>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-2 max-h-[40vh] overflow-y-auto hide-scrollbar"
                                                    >
                                                        {ALL_TAGS.map(tag => {
                                                            const label = tag === 'all' ? 'All Posts' : TAG_LABELS[tag] || tag;
                                                            const isActive = activeTag === tag;
                                                            return (
                                                                <button
                                                                    key={tag}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onTagChange(tag);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex justify-between items-center ${isActive ? 'bg-playful-cream text-playful-teal' : 'text-gray-600 hover:bg-gray-50'}`}
                                                                >
                                                                    {label}
                                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-playful-teal"></div>}
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full bg-playful-teal hover:bg-playful-teal/90 text-white font-bold py-4 rounded-2xl transition-colors shadow-md mt-4 active-scale"
                                    >
                                        Show Posts
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop Tags */}
            <div className="hidden md:flex flex-wrap gap-2">
                {ALL_TAGS.map(tag => {
                    const isActive = activeTag === tag;
                    const label = tag === 'all' ? 'All Posts' : TAG_LABELS[tag] || tag;
                    return (
                        <button
                            key={tag}
                            onClick={() => onTagChange(tag)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${isActive
                                ? `${TAG_PILL_COLORS[tag]} shadow-md scale-105`
                                : 'bg-white text-gray-500 hover:bg-playful-cream hover:text-playful-text shadow-sm border border-gray-100'
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TagFilter;
