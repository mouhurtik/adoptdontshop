'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Users, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import GroupCard from '@/components/groups/GroupCard';
import { useGroups, useMyGroups, GROUP_CATEGORIES, type GroupCategory } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';

const GroupsPage = () => {
    const [activeTab, setActiveTab] = useState<'discover' | 'my'>('discover');
    const [category, setCategory] = useState<GroupCategory>('all');
    const [search, setSearch] = useState('');
    const [catOpen, setCatOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

    const { data: allGroups, isLoading: loadingAll } = useGroups(category, search);
    const { data: myGroups, isLoading: loadingMy } = useMyGroups();

    const groups = activeTab === 'my' ? myGroups : allGroups;
    const isLoading = activeTab === 'my' ? loadingMy : loadingAll;

    const activeCategory = GROUP_CATEGORIES.find(c => c.value === category);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Compact Header */}
                <ScrollReveal mode="fade-up" width="100%">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-heading font-black text-playful-text flex items-center gap-2">
                                <Users className="w-6 h-6 text-playful-teal hidden md:block" />
                                <span className="bg-playful-teal/15 px-3 py-0.5 rounded-xl">Communities</span>
                            </h1>
                            <p className="text-sm text-gray-500 font-medium mt-1 hidden md:block">
                                Join communities of pet lovers near you
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Tab switcher */}
                            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setActiveTab('discover')}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                        activeTab === 'discover'
                                            ? 'bg-playful-teal text-white shadow-sm'
                                            : 'text-gray-500 hover:text-playful-text'
                                    }`}
                                >
                                    Discover
                                </button>
                                {isAuthenticated && (
                                    <button
                                        onClick={() => setActiveTab('my')}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                            activeTab === 'my'
                                                ? 'bg-playful-teal text-white shadow-sm'
                                                : 'text-gray-500 hover:text-playful-text'
                                        }`}
                                    >
                                        My Communities
                                    </button>
                                )}
                            </div>

                            {/* Create Group */}
                            {isAuthenticated && (
                                <Link href="/communities/create" prefetch={false}>
                                    <PrimaryButton size="md" className="shadow-sm whitespace-nowrap">
                                        <Plus className="h-4 w-4 mr-1.5" />
                                        Create
                                    </PrimaryButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Search + Category Dropdown Row */}
                {activeTab === 'discover' && (
                    <ScrollReveal mode="fade-up" delay={0.05} width="100%" className="mb-6">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search communities..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal transition-colors shadow-sm"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative" ref={catRef}>
                                <button
                                    onClick={() => setCatOpen(!catOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-playful-text shadow-sm hover:border-gray-300 transition-colors whitespace-nowrap"
                                >
                                    {activeCategory?.emoji} {activeCategory?.label || 'All Groups'}
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {catOpen && (
                                    <div className="absolute top-full mt-1.5 right-0 z-50 w-[200px] bg-white border border-gray-100 shadow-lg rounded-xl p-1.5">
                                        {GROUP_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.value}
                                                onClick={() => { setCategory(cat.value); setCatOpen(false); }}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                                                    category === cat.value
                                                        ? 'bg-playful-teal/10 text-playful-teal'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {cat.emoji} {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Groups Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[1.5rem] h-64 animate-pulse shadow-soft" />
                        ))}
                    </div>
                ) : groups && groups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group, index) => (
                            <ScrollReveal key={group.id} mode="fade-up" delay={index * 0.05} width="100%">
                                <GroupCard group={group} />
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <ScrollReveal mode="fade-up" width="100%">
                        <div className="text-center py-16">
                            <div className="bg-playful-teal/10 p-5 w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-2xl">
                                <Users className="h-10 w-10 text-playful-teal" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-playful-text mb-2">
                                {activeTab === 'my' ? 'No communities joined yet' : 'No communities found'}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium mb-6 max-w-md mx-auto">
                                {activeTab === 'my'
                                    ? 'Discover and join communities to connect with pet lovers.'
                                    : 'Be the first to create a community for your group.'}
                            </p>
                            {activeTab === 'my' ? (
                                <PrimaryButton size="md" onClick={() => setActiveTab('discover')}>Discover Communities</PrimaryButton>
                            ) : isAuthenticated ? (
                                <Link href="/communities/create" prefetch={false}>
                                    <PrimaryButton size="md">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Community
                                    </PrimaryButton>
                                </Link>
                            ) : (
                                <Link href="/login" prefetch={false}>
                                    <PrimaryButton size="md">Sign In to Create</PrimaryButton>
                                </Link>
                            )}
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    );
};

export default GroupsPage;
