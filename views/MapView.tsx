'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Plus, Sparkles } from 'lucide-react';
import { useMapSightings, AnimalType, StreetAnimalSighting } from '@/hooks/useMapSightings';
import SightingCard from '@/components/map/SightingCard';
import AddSightingSheet from '@/components/map/AddSightingSheet';

// Dynamic import with SSR disabled to prevent Leaflet window is undefined error
const MapCanvas = dynamic(() => import('@/components/map/MapCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <div className="w-10 h-10 border-4 border-playful-coral border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-bold text-gray-500">Loading Paw Map...</span>
        </div>
    ),
});

const CITIES: Record<string, { label: string; center: [number, number]; zoom: number }> = {
    mumbai: { label: 'Mumbai', center: [19.0760, 72.8777], zoom: 13 },
    delhi: { label: 'Delhi NCR', center: [28.6139, 77.2090], zoom: 12 },
    bangalore: { label: 'Bengaluru', center: [12.9716, 77.5946], zoom: 12 },
    kolkata: { label: 'Kolkata', center: [22.5726, 88.3639], zoom: 12 },
    pune: { label: 'Pune', center: [18.5204, 73.8567], zoom: 12 },
    chennai: { label: 'Chennai', center: [13.0827, 80.2707], zoom: 12 },
    hyderabad: { label: 'Hyderabad', center: [17.3850, 78.4867], zoom: 12 },
};

export default function MapView() {
    const [selectedCityKey, setSelectedCityKey] = useState('mumbai');
    const [animalFilter, setAnimalFilter] = useState<AnimalType>('all');
    const [selectedSighting, setSelectedSighting] = useState<StreetAnimalSighting | null>(null);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [tempPinCoords, setTempPinCoords] = useState<{ lat: number; lng: number } | null>(null);

    const activeCity = CITIES[selectedCityKey] || CITIES.mumbai;

    const { data: sightings = [] } = useMapSightings({
        city: selectedCityKey === 'all' ? undefined : activeCity.label,
        animalType: animalFilter,
        status: 'active',
    });

    const counts = useMemo(() => {
        let cats = 0;
        let dogs = 0;
        sightings.forEach(s => {
            if (s.animal_type === 'cat') cats++;
            if (s.animal_type === 'dog') dogs++;
        });
        return { cats, dogs, total: sightings.length };
    }, [sightings]);

    const handleMapClick = (coords: { lat: number; lng: number }) => {
        setTempPinCoords(coords);
    };

    return (
        <div className="relative w-full h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden bg-gray-100">
            {/* Top Control Bar (City picker + Animal Filters) */}
            <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                    {/* City Selector */}
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-gray-200/80">
                        <MapPin className="w-4 h-4 text-playful-coral shrink-0" />
                        <select
                            value={selectedCityKey}
                            onChange={e => {
                                setSelectedCityKey(e.target.value);
                                setSelectedSighting(null);
                            }}
                            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
                        >
                            {Object.entries(CITIES).map(([key, item]) => (
                                <option key={key} value={key}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Animal Type Pills */}
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-gray-200/80">
                        {(['all', 'cat', 'dog'] as AnimalType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setAnimalFilter(type)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                                    animalFilter === type
                                        ? 'bg-playful-coral text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {type === 'all' ? 'All Spots' : type === 'cat' ? 'Cats 🐱' : 'Dogs 🐕'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Counter Badge */}
                <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-xs font-bold text-gray-700">
                    <Sparkles className="w-3.5 h-3.5 text-playful-yellow" />
                    <span>{counts.cats} Cats</span>
                    <span className="text-gray-300">·</span>
                    <span>{counts.dogs} Dogs</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-playful-coral">{counts.total} Total Spots</span>
                </div>
            </div>

            {/* Interactive Leaflet Map */}
            <MapCanvas
                sightings={sightings}
                selectedSighting={selectedSighting}
                onSelectSighting={s => setSelectedSighting(s)}
                center={activeCity.center}
                zoom={activeCity.zoom}
                onMapClick={handleMapClick}
            />

            {/* Selected Sighting Detail Card (floating overlay) */}
            {selectedSighting && (
                <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-30 pointer-events-auto">
                    <SightingCard
                        sighting={selectedSighting}
                        onClose={() => setSelectedSighting(null)}
                    />
                </div>
            )}

            {/* Floating Action Button (FAB): "Spot Animal" */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
                <button
                    onClick={() => setIsAddSheetOpen(true)}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-playful-coral hover:bg-playful-coral/90 text-white font-heading font-black text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Spot an Animal</span>
                </button>
            </div>

            {/* Add Sighting Modal Sheet */}
            <AddSightingSheet
                isOpen={isAddSheetOpen}
                onClose={() => setIsAddSheetOpen(false)}
                initialCoords={tempPinCoords || { lat: activeCity.center[0], lng: activeCity.center[1] }}
                defaultCity={activeCity.label}
            />
        </div>
    );
}
