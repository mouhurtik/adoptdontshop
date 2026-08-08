/**
 * Capacitor Native Bridge
 *
 * Platform detection, haptic feedback, and StatusBar configuration.
 * Adapted from ChessNotes NativeProvider pattern — lazy-loads Capacitor
 * modules to prevent crashes on web.
 */

// Safe Capacitor imports — wrap in try-catch to prevent app crash
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Capacitor: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Haptics: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ImpactStyle: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let NotificationType: any = null;

// Lazy load Capacitor modules to prevent crash on startup
let capacitorLoaded = false;
const loadCapacitor = async () => {
    if (capacitorLoaded) return;
    try {
        const capacitorCore = await import('@capacitor/core');
        Capacitor = capacitorCore.Capacitor;

        const hapticsMod = await import('@capacitor/haptics');
        Haptics = hapticsMod.Haptics;
        ImpactStyle = hapticsMod.ImpactStyle;
        NotificationType = hapticsMod.NotificationType;

        capacitorLoaded = true;
    } catch {
        // Capacitor not available (running on web)
    }
};

// Initialize on load but don't block
loadCapacitor();

// ─── Platform Detection ────────────────────────────────────

export const getPlatform = (): 'android' | 'ios' | 'web' => {
    try {
        if (Capacitor) return Capacitor.getPlatform();
    } catch { /* noop */ }
    return 'web';
};

export const isNative = (): boolean => {
    try {
        if (Capacitor) return Capacitor.isNativePlatform();
    } catch { /* noop */ }
    return false;
};

// ─── StatusBar ─────────────────────────────────────────────

export const configureStatusBar = async () => {
    try {
        if (!isNative()) return;
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { Capacitor: Cap } = await import('@capacitor/core');

        if (Cap.isNativePlatform()) {
            await StatusBar.setOverlaysWebView({ overlay: false });
            await StatusBar.setStyle({ style: Style.Light });
            try {
                await StatusBar.setBackgroundColor({ color: '#FFF8F0' }); // playful-cream
            } catch { /* iOS doesn't support setBackgroundColor */ }
            await StatusBar.show();
        }
    } catch {
        // StatusBar plugin not available
    }
};

// ─── Haptic Feedback ───────────────────────────────────────

const safeHaptic = async (fn: () => Promise<void>) => {
    try {
        if (isNative() && Haptics) await fn();
    } catch {
        // Silently fail — haptics are optional
    }
};

export const haptics = {
    light: () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light })),
    medium: () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium })),
    heavy: () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy })),
    success: () => safeHaptic(() => Haptics.notification({ type: NotificationType.Success })),
    warning: () => safeHaptic(() => Haptics.notification({ type: NotificationType.Warning })),
    error: () => safeHaptic(() => Haptics.notification({ type: NotificationType.Error })),
};
