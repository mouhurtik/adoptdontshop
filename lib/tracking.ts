import { SITE_URL } from '@/lib/site';
import type { AmazonCollection } from '@/views/essentials/collectionsData';

export const TRACKING_STORAGE_KEY = 'adoptdontshop-tracking-v1';
export const TRACKING_CHANGED_EVENT = 'adoptdontshop:tracking-changed';
export const OPEN_TRACKING_EVENT = 'adoptdontshop:open-tracking';
export const GA_ID = 'G-FJ0SET7VX9';
export const META_PIXEL_ID = '1462969085759164';
export interface TrackingChoices { version: 1; analytics: boolean; marketing: boolean }

type Pixel = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    push?: Pixel;
    loaded: boolean;
    version: string;
};

declare global {
    interface Window {
        fbq?: Pixel;
        _fbq?: Pixel;
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

let memoryChoices: TrackingChoices | null = null;
let memoryOnly = false;
let googleStarted = false;
let pixelStarted = false;
let lastPixelPath: string | null = null;

export function parseTrackingChoices(raw: string | null): TrackingChoices | null {
    try {
        const value = JSON.parse(raw || 'null');
        return value?.version === 1 && typeof value.analytics === 'boolean' && typeof value.marketing === 'boolean'
            ? { version: 1, analytics: value.analytics, marketing: value.marketing }
            : null;
    } catch { return null; }
}

export function readTrackingChoices(): TrackingChoices | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(TRACKING_STORAGE_KEY);
        return raw === null && memoryOnly ? memoryChoices : parseTrackingChoices(raw);
    }
    catch { return memoryChoices; }
}

export function saveTrackingChoices(choices: TrackingChoices) {
    memoryChoices = choices;
    try { window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(choices)); memoryOnly = false; }
    catch { memoryOnly = true; }
    window.dispatchEvent(new Event(TRACKING_CHANGED_EVENT));
}

export function isPublicMeasurementPath(pathname: string): boolean {
    return pathname === '/' || /^\/(?:about|store|browse|explore|help|contact|welcome|success-stories|adopt-pets-in|pet)(?:\/|$)/.test(pathname)
        || (/^\/community\/[^/]+$/.test(pathname) && !/^\/community\/(?:write|edit|saved)$/.test(pathname));
}

export function hasSafeMeasurementQuery(search: string): boolean {
    for (const [key, value] of new URLSearchParams(search)) {
        // Do not transmit arbitrary searches, auth tokens, email or location queries.
        if (key === 'tab' && ['story', 'store', 'patrons'].includes(value)) continue;
        if (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].includes(key)) continue;
        return false;
    }
    return true;
}

function addScript(id: string, src: string) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onerror = () => script.remove();
    document.head.appendChild(script);
}

export function synchronizeTracking(pathname: string) {
    const choices = readTrackingChoices();
    const native = Boolean((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());
    const eligible = process.env.NODE_ENV === 'production' && !native
        && isPublicMeasurementPath(pathname) && hasSafeMeasurementQuery(window.location.search);
    const analytics = Boolean(eligible && choices?.analytics);
    const marketing = Boolean(eligible && choices?.marketing);
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !analytics;

    if (analytics && !googleStarted) {
        window.dataLayer = window.dataLayer || [];
        // eslint-disable-next-line prefer-rest-params -- gtag's command queue uses the arguments format.
        window.gtag = function () { window.dataLayer?.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
            send_page_view: true,
            page_location: `${SITE_URL}${pathname}`,
            page_referrer: '',
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
        });
        googleStarted = true;
        addScript('adoptdontshop-ga', `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
        // GA Enhanced Measurement owns history page views. Do not send duplicates here.
    }

    if (!marketing) {
        window.fbq?.('consent', 'revoke');
        lastPixelPath = null;
        return;
    }
    if (!pixelStarted) {
        const fbq = function (...args: unknown[]) {
            if (fbq.callMethod) fbq.callMethod(...args);
            else fbq.queue.push(args);
        } as Pixel;
        fbq.queue = [];
        fbq.loaded = true;
        fbq.version = '2.0';
        fbq.push = fbq;
        window.fbq = fbq;
        window._fbq = fbq;
        fbq('set', 'autoConfig', false, META_PIXEL_ID);
        fbq('init', META_PIXEL_ID);
        pixelStarted = true;
        addScript('adoptdontshop-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
    }
    window.fbq?.('consent', 'grant');
    const pageKey = `${pathname}${window.location.search}`;
    if (lastPixelPath !== pageKey) {
        window.fbq?.('track', 'PageView');
        lastPixelPath = pageKey;
    }
}

export function trackAffiliateClick(collection: AmazonCollection) {
    if (process.env.NODE_ENV !== 'production' || !readTrackingChoices()?.analytics
        || !isPublicMeasurementPath(window.location.pathname) || !hasSafeMeasurementQuery(window.location.search)) return;
    if ((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()) return;
    window.gtag?.('event', 'affiliate_click', {
        collection_id: collection.id, merchant: 'amazon', category: collection.group,
        pet_type: collection.petType, link_type: 'collection', placement: 'store', platform: 'web',
    });
}
