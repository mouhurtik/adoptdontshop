import React from 'react';
import { Search, Filter } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface PlayfulSearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (type?: string) => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
}

const PlayfulSearchSection = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleKeyPress
}: PlayfulSearchSectionProps) => {

    const categories = [
        { name: 'Dogs', icon: '🐶', type: 'dog', color: 'bg-playful-coral' },
        { name: 'Cats', icon: '🐱', type: 'cat', color: 'bg-playful-teal' },
        { name: 'Birds', icon: '🐦', type: 'bird', color: 'bg-playful-yellow' },
        { name: 'Rabbits', icon: '🐰', type: 'rabbit', color: 'bg-playful-mint' },
    ];

    return (
        <section className="py-16 px-4 bg-white relative z-10 -mt-10 rounded-t-[3rem]">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                    <h2 className="text-3xl font-heading font-bold text-center mb-8 text-playful-text">
                        Who are you looking for?
                    </h2>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-10 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-playful-coral transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-playful-coral focus:ring-4 focus:ring-playful-coral/20 outline-none text-lg transition-all shadow-sm"
                            placeholder="Search by breed, name, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <div className="absolute inset-y-1 right-1">
                            <PrimaryButton onClick={() => handleSearch()} size="md" className="h-full rounded-full px-4 md:px-6">
                                <span className="hidden md:inline">Search</span>
                                <Search className="md:hidden h-5 w-5" />
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleSearch(cat.type)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-3 ${cat.color} bg-opacity-20 group-hover:bg-opacity-100`}>
                                    {cat.icon}
                                </div>
                                <span className="font-bold text-gray-600 group-hover:text-playful-text">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlayfulSearchSection;



