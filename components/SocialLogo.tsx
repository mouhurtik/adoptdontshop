type SocialName = 'Facebook' | 'Instagram' | 'LinkedIn';

// Standalone currentColor brand marks, matching the portfolio footer's SVG treatment.
export default function SocialLogo({ name }: { name: SocialName }) {
    if (name === 'Instagram') return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>;
    if (name === 'Facebook') return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.64.78-1.64 1.58v1.89h2.79l-.45 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>;
    return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.76v-7.6H6.46M7.84 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>;
}
