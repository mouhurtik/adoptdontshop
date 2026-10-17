'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

type SmoothScrollProps = {
    feel?: 'browse' | 'feed';
};

/**
 * Adds desktop-style inertial scrolling to browsing surfaces without taking
 * over touch scrolling or users who prefer reduced motion.
 */
export default function SmoothScroll({ feel = 'browse' }: SmoothScrollProps) {
    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointer = window.matchMedia('(pointer: fine)');

        if (reducedMotion.matches || !finePointer.matches) return;

        const lenis = new Lenis({
            autoRaf: true,
            duration: feel === 'feed' ? 0.68 : 0.85,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: feel === 'feed' ? 0.9 : 0.95,
            touchMultiplier: 1,
        });

        const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
            if (event.matches) lenis.destroy();
        };

        reducedMotion.addEventListener('change', handleMotionPreferenceChange);

        return () => {
            reducedMotion.removeEventListener('change', handleMotionPreferenceChange);
            lenis.destroy();
        };
    }, [feel]);

    return null;
}
