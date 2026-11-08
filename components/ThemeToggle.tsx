'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, subscribeTheme } from '@/lib/theme';

export default function ThemeToggle({ expanded = false }: { expanded?: boolean }) {
    const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains('dark'), () => false);
    const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
    return (
        <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={label} title={label}
            className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-playful-coral-text ${expanded ? 'w-full px-3 py-2' : 'h-11 w-11 justify-center'}`}>
            {dark ? <Sun aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} /> : <Moon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />}
            {expanded && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
        </button>
    );
}
