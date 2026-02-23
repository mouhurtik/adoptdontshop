'use client';

import { useEffect, useRef, useCallback } from 'react';

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

interface TurnstileProps {
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    className?: string;
}

export default function Turnstile({ onVerify, onError, onExpire, className = '' }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || !siteKey) return;
        if (widgetIdRef.current) return; // Already rendered

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'error-callback': onError,
            'expired-callback': onExpire,
            theme: 'light',
            appearance: 'interaction-only',
        });
    }, [siteKey, onVerify, onError, onExpire]);

    useEffect(() => {
        if (!siteKey) return;

        // If turnstile script already loaded
        if (window.turnstile) {
            renderWidget();
            return;
        }

        // Load the script
        const existingScript = document.querySelector('script[src*="turnstile"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.onload = () => renderWidget();
            document.head.appendChild(script);
        } else {
            // Script exists but not loaded yet
            existingScript.addEventListener('load', () => renderWidget());
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, renderWidget]);

    // Don't render anything if no site key (dev mode)
    if (!siteKey) return null;

    return <div ref={containerRef} className={className} />;
}
