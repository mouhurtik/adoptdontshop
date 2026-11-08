'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OPEN_TRACKING_EVENT, readTrackingChoices, saveTrackingChoices } from '@/lib/tracking';

export default function TrackingPreferences() {
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState(false);
    const [analytics, setAnalytics] = useState(false);
    const [marketing, setMarketing] = useState(false);

    useEffect(() => {
        const choices = readTrackingChoices();
        if (choices) { setAnalytics(choices.analytics); setMarketing(choices.marketing); }
        else setNotice(true);
        const show = () => setOpen(true);
        window.addEventListener(OPEN_TRACKING_EVENT, show);
        return () => window.removeEventListener(OPEN_TRACKING_EVENT, show);
    }, []);

    const save = (analyticsChoice: boolean, marketingChoice: boolean) => {
        saveTrackingChoices({ version: 1, analytics: analyticsChoice, marketing: marketingChoice });
        setAnalytics(analyticsChoice);
        setMarketing(marketingChoice);
        setOpen(false);
        setNotice(false);
    };

    return (
        <div id="tracking-preferences">
            <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="min-h-11 rounded-md text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2">Tracking preferences</button>
            {(open || notice) && (
                <section aria-label="Tracking preferences" className={`${notice ? 'fixed inset-x-3 bottom-24 z-50 shadow-lg lg:bottom-6 lg:left-[calc(var(--sidebar-width,0px)+1.5rem)] lg:right-6' : 'mt-3'} max-w-2xl rounded-2xl border border-playful-text/15 bg-white p-5 text-sm text-gray-700`}>
                    <h2 className="font-heading text-lg font-bold text-playful-text">Choose optional measurement</h2>
                    <p className="mt-2 leading-relaxed">Optional tracking is off until you choose. Analytics measures public-page use; Meta Pixel measures advertising activity. <Link href="/privacy-policy" className="text-playful-teal-text underline">Privacy policy</Link>.</p>
                    {open && <>
                        <label className="mt-3 flex min-h-11 items-center gap-3"><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} className="h-5 w-5 accent-teal-700" />Allow Google Analytics</label>
                        <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={marketing} onChange={event => setMarketing(event.target.checked)} className="h-5 w-5 accent-teal-700" />Allow Meta advertising measurement</label>
                    </>}
                    <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => save(false, false)} className="min-h-11 rounded-xl border border-gray-300 px-4 font-medium hover:bg-gray-50 focus-visible:outline focus-visible:outline-2">Reject optional</button>
                        {open
                            ? <button type="button" onClick={() => save(analytics, marketing)} className="min-h-11 rounded-xl border border-gray-300 px-4 font-medium hover:bg-gray-50 focus-visible:outline focus-visible:outline-2">Save choices</button>
                            : <button type="button" onClick={() => setOpen(true)} className="min-h-11 rounded-xl border border-gray-300 px-4 font-medium hover:bg-gray-50 focus-visible:outline focus-visible:outline-2">Choose options</button>}
                        <button type="button" onClick={() => save(true, true)} className="min-h-11 rounded-xl border border-gray-300 px-4 font-medium hover:bg-gray-50 focus-visible:outline focus-visible:outline-2">Accept both</button>
                    </div>
                </section>
            )}
        </div>
    );
}
