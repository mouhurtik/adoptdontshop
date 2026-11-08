import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let tracking: typeof import('../tracking');

beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.head.replaceChildren();
    delete window.fbq;
    delete window._fbq;
    delete window.gtag;
    delete window.dataLayer;
    delete (window as unknown as Record<string, unknown>).Capacitor;
    tracking = await import('../tracking');
});
afterEach(() => vi.unstubAllEnvs());

describe('Optional public-page tracking', () => {
    it('loads no optional vendor script without an explicit choice', () => {
        tracking.synchronizeTracking('/');
        expect(document.querySelectorAll('script')).toHaveLength(0);
        expect(window.fbq).toBeUndefined();
        expect(window.gtag).toBeUndefined();
    });

    it('keeps analytics and advertising consent independent', () => {
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: false });
        tracking.synchronizeTracking('/');
        expect(document.getElementById('adoptdontshop-ga')).not.toBeNull();
        expect(document.getElementById('adoptdontshop-meta-pixel')).toBeNull();
    });

    it('sends one Pixel page view per public route without email matching', () => {
        tracking.saveTrackingChoices({ version: 1, analytics: false, marketing: true });
        tracking.synchronizeTracking('/');
        tracking.synchronizeTracking('/');
        tracking.synchronizeTracking('/browse');
        expect(document.getElementById('adoptdontshop-ga')).toBeNull();
        expect(window.fbq?.queue.filter(command => command[0] === 'track')).toEqual([
            ['track', 'PageView'], ['track', 'PageView'],
        ]);
        expect(window.fbq?.queue.find(command => command[0] === 'init')).toEqual(['init', tracking.META_PIXEL_ID]);
        expect(window.fbq?.queue).toContainEqual(['set', 'autoConfig', false, tracking.META_PIXEL_ID]);
    });

    it.each(['/admin/users', '/messages', '/profile', '/auth/callback', '/community/write', '/community/saved', '/map'])('does not initialise tracking on %s', path => {
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: true });
        tracking.synchronizeTracking(path);
        expect(document.querySelectorAll('script')).toHaveLength(0);
    });

    it('suppresses sensitive query URLs even on a public path', () => {
        window.history.replaceState({}, '', '/browse?email=private%40example.test');
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: true });
        tracking.synchronizeTracking('/browse');
        expect(document.querySelectorAll('script')).toHaveLength(0);
        expect(tracking.hasSafeMeasurementQuery('?tab=store')).toBe(true);
        expect(tracking.hasSafeMeasurementQuery('?lat=12&lng=45')).toBe(false);
    });

    it('revokes future Pixel events and disables GA after a visitor rejects tracking', () => {
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: true });
        tracking.synchronizeTracking('/');
        tracking.saveTrackingChoices({ version: 1, analytics: false, marketing: false });
        tracking.synchronizeTracking('/browse');
        expect(window.fbq?.queue).toContainEqual(['consent', 'revoke']);
        expect(window.fbq?.queue.filter(command => command[0] === 'track')).toHaveLength(1);
        expect((window as unknown as Record<string, unknown>)[`ga-disable-${tracking.GA_ID}`]).toBe(true);
    });

    it('treats cleared or malformed consent as no consent', () => {
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: true });
        window.localStorage.removeItem(tracking.TRACKING_STORAGE_KEY);
        expect(tracking.readTrackingChoices()).toBeNull();
        expect(tracking.parseTrackingChoices('{bad json')).toBeNull();
        expect(tracking.parseTrackingChoices('{"version":1,"analytics":"yes","marketing":true}')).toBeNull();
    });

    it('does not initialise web SDKs in the native shell or development', () => {
        tracking.saveTrackingChoices({ version: 1, analytics: true, marketing: true });
        (window as unknown as Record<string, unknown>).Capacitor = { isNativePlatform: () => true };
        tracking.synchronizeTracking('/');
        delete (window as unknown as Record<string, unknown>).Capacitor;
        vi.stubEnv('NODE_ENV', 'development');
        tracking.synchronizeTracking('/');
        expect(document.querySelectorAll('script')).toHaveLength(0);
    });
});
