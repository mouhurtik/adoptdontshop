'use client';

import { PawPrint } from 'lucide-react';

interface PawprintLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    className?: string;
    fullScreen?: boolean;
}

const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
};

export default function PawprintLoader({
    size = 'md',
    message,
    className = '',
    fullScreen = false,
}: PawprintLoaderProps) {
    const wrapper = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-playful-cream'
        : 'flex items-center justify-center py-12';

    return (
        <div className={`${wrapper} ${className}`}>
            <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                    {/* Pulsing ring */}
                    <div className={`absolute ${sizes[size]} rounded-full bg-playful-coral/20 animate-ping`} />
                    {/* Bouncing paw */}
                    <div className={`relative ${sizes[size]} bg-playful-coral text-white rounded-full flex items-center justify-center animate-bounce shadow-lg`}>
                        <PawPrint className={`${size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} fill-current`} />
                    </div>
                </div>
                {message && (
                    <p className="mt-4 text-gray-500 font-medium text-sm">{message}</p>
                )}
            </div>
        </div>
    );
}
