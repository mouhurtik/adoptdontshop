import type { Pet } from '@/types';
import { PawPrint, MapPin, Sparkles, Heart } from 'lucide-react';

interface ShareablePetCardProps {
    pet: Pet;
    elementId: string;
}

const ShareablePetCard = ({ pet, elementId }: ShareablePetCardProps) => {
    // Normalize pet data
    const name = pet.name || pet.pet_name;
    const type = pet.type || pet.animal_type;
    const image = pet.image || pet.image_url;
    const breed = pet.breed;
    const age = pet.age;
    const location = pet.location;
    const description = pet.description;

    // Cap description length for the shareable card
    const maxDescLength = 150;
    const truncatedDescription = description && description.length > maxDescLength
        ? description.slice(0, maxDescLength).trim() + '...'
        : description;

    // Filter out badges to avoid duplicates (e.g. if breed is 'Stray' and status is 'Stray')
    const badges = [
        { label: type, color: 'bg-playful-teal/10 text-playful-teal', icon: <PawPrint className="w-5 h-5" /> },
        { label: pet.status === 'adopted' ? 'Adopted' : (pet.status === 'fostered' ? 'Fostered' : 'Stray'), color: 'bg-red-50 text-red-500', icon: <Heart className="w-5 h-5" /> },
        { label: age, color: 'bg-playful-yellow/20 text-yellow-700', icon: <Sparkles className="w-5 h-5" /> },
        { label: breed, color: 'bg-gray-100 text-gray-600', icon: <PawPrint className="w-5 h-5" /> }
    ].filter((badge, index, self) =>
        // Filter out empty values and duplicates based on label
        badge.label &&
        index === self.findIndex((t) => t.label === badge.label)
    );

    return (
        <div
            id={elementId}
            className="fixed left-[-9999px] top-0 w-[600px] bg-white text-gray-800 font-sans border-none overflow-hidden"
            style={{ minHeight: '600px', height: 'auto' }}
        >
            <div className="w-full h-full bg-white p-6 flex flex-col items-center">

                {/* Card Container */}
                <div className="w-full bg-white rounded-[3rem] shadow-none p-4 flex flex-col gap-8 relative h-full">

                    {/* Image + Label Container - merged together */}
                    <div className="w-full">
                        {/* Hero Image */}
                        <div className="relative w-full aspect-square rounded-t-[2.5rem] overflow-hidden shadow-2xl group">
                            <img
                                src={image || '/placeholder.svg'}
                                alt={name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                            {/* Gradient Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                            {/* Branding Overlay - Navbar Style (table layout for html2canvas compatibility) */}
                            <div className="absolute top-6 left-6 z-20">
                                <div className="bg-white/95 backdrop-blur-md border border-white/50 shadow-lg rounded-full" style={{ padding: '10px 20px 10px 14px' }}>
                                    <table style={{ borderCollapse: 'collapse', borderSpacing: '0' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ verticalAlign: 'middle', padding: '0 10px 0 0' }}>
                                                    <div className="bg-playful-coral text-white" style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <PawPrint style={{ width: '24px', height: '24px', fill: 'white' }} />
                                                    </div>
                                                </td>
                                                <td style={{ verticalAlign: 'middle', padding: '0' }}>
                                                    <span className="font-heading font-black tracking-tight text-playful-text" style={{ fontSize: '24px', lineHeight: '1', whiteSpace: 'nowrap', position: 'relative', top: '-8px' }}>
                                                        Adopt<span className="text-playful-coral">Dont</span>Shop
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Urgent Badge */}
                            {(pet.urgent || pet.status === 'urgent') && (
                                <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-2.5 rounded-full font-black text-xl shadow-lg flex items-center gap-2 animate-pulse border-2 border-white">
                                    <Heart className="fill-current w-5 h-5" />
                                    URGENT
                                </div>
                            )}
                        </div>

                        {/* Powered By Label - Tape Style */}
                        <div className="w-full bg-playful-coral text-white py-1 text-center rounded-b-[2.5rem]">
                            <span className="text-lg font-bold tracking-wide" style={{ transform: 'translateY(-8px)', display: 'inline-block' }}>
                                Powered by adoptdontshop.xyz
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col gap-6 w-full px-2">

                        {/* Info Row: Badges & Location */}
                        <div className="flex flex-wrap items-center gap-3 w-full mt-2">
                            {badges.map((badge, index) => (
                                <span key={index} className={`${badge.color} px-3 py-2 rounded-xl text-sm font-bold border border-black/5 whitespace-nowrap flex items-center gap-1.5`}>
                                    <span style={{ transform: 'translateY(-1px)' }}>{badge.icon}</span>
                                    <span style={{ transform: 'translateY(-6px)' }}>{badge.label}</span>
                                </span>
                            ))}

                            {/* Location */}
                            {location && (
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 shadow-sm shrink-0">
                                    <MapPin className="w-4 h-4 text-playful-teal flex-shrink-0" />
                                    <span className="text-sm font-bold tracking-tight text-gray-700 max-w-[200px]" style={{ transform: 'translateY(-6px)' }}>
                                        {location}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description - Renamed Title */}
                        <div className="w-full -mt-2 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl" style={{ lineHeight: '1' }}>👋</span>
                                <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight" style={{ lineHeight: '1' }}>
                                    Hi, I'm {name}
                                </h1>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {truncatedDescription || `I'm looking for a loving home. I am a ${age} old ${breed}. Please adopt me!`}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareablePetCard;
