'use client';

import { useState } from 'react';
import { X, Upload, MapPin, Sparkles, Syringe, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSighting } from '@/hooks/useMapSightings';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddSightingSheetProps {
    isOpen: boolean;
    onClose: () => void;
    initialCoords?: { lat: number; lng: number };
    defaultCity?: string;
}

export default function AddSightingSheet({
    isOpen,
    onClose,
    initialCoords = { lat: 19.0760, lng: 72.8777 },
    defaultCity = 'Mumbai',
}: AddSightingSheetProps) {
    const { isAuthenticated } = useAuth();
    const createSighting = useCreateSighting();

    const [animalType, setAnimalType] = useState<'cat' | 'dog' | 'other'>('cat');
    const [name, setName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [city, setCity] = useState(defaultCity);
    const [lat, setLat] = useState(initialCoords.lat);
    const [lng, setLng] = useState(initialCoords.lng);
    const [isVaccinated, setIsVaccinated] = useState(false);
    const [isSterilized, setIsSterilized] = useState(false);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    setLat(pos.coords.latitude);
                    setLng(pos.coords.longitude);
                    toast.success('Pinned to your current location!');
                },
                () => {
                    toast.error('Could not access location');
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please sign in to add a street animal spot');
            return;
        }

        setIsSubmitting(true);
        try {
            let uploadedImageUrl: string | undefined = undefined;

            if (imageFile) {
                const ext = imageFile.name.split('.').pop();
                const fileName = `sighting-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from('community-images')
                    .upload(fileName, imageFile, { contentType: imageFile.type });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('community-images').getPublicUrl(fileName);
                    uploadedImageUrl = urlData.publicUrl;
                }
            }

            await createSighting.mutateAsync({
                animal_type: animalType,
                name: name.trim() || undefined,
                location_name: locationName.trim() || undefined,
                city: city.trim() || undefined,
                latitude: lat,
                longitude: lng,
                image_url: uploadedImageUrl,
                is_vaccinated: isVaccinated,
                is_sterilized: isSterilized,
                description: description.trim() || undefined,
            });

            toast.success('Spot added! Our community team will verify it shortly (+10 PawCoins on approval)!');
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to add animal spot';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
                className="bg-white rounded-[2.5rem] max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-playful-coral/10 text-playful-coral text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        MapCat Community Spot
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-playful-text">
                        Spot a Street Animal
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Help neighbors and feeders keep track of health, sterilizations, and daily feeding spots.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Animal Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Animal Type *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { type: 'cat' as const, label: 'Cat 🐱', color: 'peer-checked:bg-playful-coral' },
                                { type: 'dog' as const, label: 'Dog 🐕', color: 'peer-checked:bg-playful-teal' },
                                { type: 'other' as const, label: 'Other 🐾', color: 'peer-checked:bg-amber-500' },
                            ].map(item => (
                                <label
                                    key={item.type}
                                    className={`flex items-center justify-center py-2.5 px-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                                        animalType === item.type
                                            ? 'bg-playful-coral text-white border-transparent shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setAnimalType(item.type)}
                                >
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Animal Name / Nickname */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Nickname / Identifier
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Orange Friendly Cat, Sheru, Milky"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    {/* Landmark / Location Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Location Landmark *
                        </label>
                        <input
                            type="text"
                            required
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            placeholder="e.g. Near Carter Road CCD, Bandra West"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    {/* City & GPS Coordinates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="e.g. Mumbai"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                GPS Location
                            </label>
                            <button
                                type="button"
                                onClick={handleGetCurrentLocation}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <MapPin className="w-3.5 h-3.5 text-playful-coral" />
                                <span>Use My Location</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-[11px] text-gray-400 font-mono">
                        Pin Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Animal Photo
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 border border-dashed border-gray-200 hover:border-playful-coral rounded-xl p-3 text-center cursor-pointer transition-colors">
                                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs font-bold text-playful-coral">Upload Picture</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imagePreview && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Health Toggles */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                            isVaccinated ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                            <input
                                type="checkbox"
                                checked={isVaccinated}
                                onChange={e => setIsVaccinated(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex items-center gap-1 text-xs font-bold">
                                <Syringe className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Vaccinated</span>
                            </div>
                        </label>

                        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSterilized ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                            <input
                                type="checkbox"
                                checked={isSterilized}
                                onChange={e => setIsSterilized(e.target.checked)}
                                className="rounded text-teal-600 focus:ring-teal-500"
                            />
                            <div className="flex items-center gap-1 text-xs font-bold">
                                <Scissors className="w-3.5 h-3.5 text-teal-600" />
                                <span>Sterilized</span>
                            </div>
                        </label>
                    </div>

                    {/* Description / Habits */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Habits / Care Notes
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Very friendly, likes wet food, usually sleeps near the tea stall in the morning..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 mt-2 bg-playful-coral hover:bg-playful-coral/90 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting Spot...' : 'Submit Animal Spot (+10 PawCoins)'}
                    </button>
                </form>
            </div>
        </div>
    );
}
