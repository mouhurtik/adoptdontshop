'use client';

import { useEffect, useState } from 'react';
import { readTrackingChoices, saveTrackingChoices } from '@/lib/tracking';

export default function TrackingPreferences() {
    const [analytics, setAnalytics] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const choices = readTrackingChoices();
        if (choices) { setAnalytics(choices.analytics); setMarketing(choices.marketing); }
    }, []);

    return (
        <section id="tracking-preferences" aria-labelledby="tracking-heading" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 id="tracking-heading" className="font-heading text-lg font-semibold text-playful-text">Your tracking preferences</h3>
            <p className="mt-2 text-sm leading-relaxed">Optional measurement is off until you enable it here. You can use your account with either option off.</p>
            <label className="mt-3 flex min-h-11 items-center gap-3"><input type="checkbox" checked={analytics} onChange={event => { setAnalytics(event.target.checked); setSaved(false); }} className="h-5 w-5 accent-teal-700" />Allow Google Analytics</label>
            <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={marketing} onChange={event => { setMarketing(event.target.checked); setSaved(false); }} className="h-5 w-5 accent-teal-700" />Allow Meta advertising measurement</label>
            <button type="button" onClick={() => { saveTrackingChoices({ version: 1, analytics, marketing }); setSaved(true); }} className="mt-3 min-h-11 rounded-full bg-[#c34b24] px-5 text-sm font-semibold text-white hover:bg-[#ad401c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Save preferences</button>
            <p role="status" className="mt-2 min-h-5 text-sm">{saved ? 'Your preferences have been saved for this browser.' : ''}</p>
        </section>
    );
}