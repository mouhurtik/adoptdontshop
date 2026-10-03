'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { StreetAnimalSighting } from '@/hooks/useMapSightings';

interface MapCanvasProps {
    sightings: StreetAnimalSighting[];
    selectedSighting: StreetAnimalSighting | null;
    onSelectSighting: (sighting: StreetAnimalSighting) => void;
    center: [number, number];
    zoom: number;
    onMapClick?: (coords: { lat: number; lng: number }) => void;
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (coords: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });
    return null;
}

export default function MapCanvas({
    sightings,
    selectedSighting,
    onSelectSighting,
    center,
    zoom,
    onMapClick,
}: MapCanvasProps) {
    const icons = useMemo(() => {
        const createIcon = (type: string, isSelected: boolean) => {
            const emoji = type === 'cat' ? '🐱' : type === 'dog' ? '🐕' : '🐾';
            const bgColor = type === 'cat' ? '#FF7F50' : type === 'dog' ? '#20B2AA' : '#F59E0B';
            const size = isSelected ? 44 : 36;
            const border = isSelected ? '3px solid #111' : '2.5px solid white';
            const transform = isSelected ? 'scale(1.15)' : 'scale(1)';

            return L.divIcon({
                className: 'custom-animal-marker',
                html: `<div style="background-color: ${bgColor}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: ${isSelected ? 24 : 18}px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: ${border}; transform: ${transform}; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;">${emoji}</div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });
        };

        return {
            cat: (selected: boolean) => createIcon('cat', selected),
            dog: (selected: boolean) => createIcon('dog', selected),
            other: (selected: boolean) => createIcon('other', selected),
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
            >
                {/* OpenStreetMap Standard Tiles — 100% free, open-source, no API key needed */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />

                <MapRecenter center={center} zoom={zoom} />
                <MapClickHandler onMapClick={onMapClick} />

                {sightings.map(sighting => {
                    const isSelected = selectedSighting?.id === sighting.id;
                    const getIcon = icons[sighting.animal_type] || icons.other;

                    return (
                        <Marker
                            key={sighting.id}
                            position={[sighting.latitude, sighting.longitude]}
                            icon={getIcon(isSelected)}
                            eventHandlers={{
                                click: () => onSelectSighting(sighting),
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}
