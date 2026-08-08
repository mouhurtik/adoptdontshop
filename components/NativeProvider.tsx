'use client';

/**
 * NativeProvider
 *
 * Context wrapper for Capacitor native features.
 * Provides haptic feedback, native dialogs, and initializes
 * StatusBar + push notifications when running on native platforms.
 *
 * Adapted from ChessNotes NativeProvider pattern.
 */

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { haptics, configureStatusBar, isNative } from '@/lib/capacitor/native';
import { initPushNotifications, clearPushNotifications } from '@/lib/capacitor/push-notifications';
import { useAuth } from '@/contexts/AuthContext';

// ─── Dialog Context ────────────────────────────────────────

interface DialogConfig {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm' | 'destructive';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface NativeContextType {
    isNativePlatform: boolean;
    haptics: typeof haptics;
    showAlert: (title: string, message: string) => Promise<void>;
    showConfirm: (title: string, message: string, confirmText?: string, cancelText?: string) => Promise<boolean>;
    showDestructive: (title: string, message: string, confirmText?: string) => Promise<boolean>;
    dialogConfig: DialogConfig;
    closeDialog: () => void;
}

const NativeContext = createContext<NativeContextType | null>(null);

export const useNative = () => {
    const context = useContext(NativeContext);
    if (!context) {
        // Return safe defaults when outside provider (web fallback)
        return {
            isNativePlatform: false,
            haptics,
            showAlert: async () => { window.alert('Alert'); },
            showConfirm: async () => window.confirm('Confirm'),
            showDestructive: async () => window.confirm('Are you sure?'),
            dialogConfig: { isOpen: false, title: '', message: '', type: 'alert' as const },
            closeDialog: () => {},
        };
    }
    return context;
};

// ─── Native Dialog Component ───────────────────────────────

function NativeDialog({ config, onClose }: { config: DialogConfig; onClose: () => void }) {
    if (!config.isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-playful-text mb-2">
                        {config.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {config.message}
                    </p>
                </div>
                <div className="flex border-t border-gray-100">
                    {config.type !== 'alert' && (
                        <button
                            onClick={() => { config.onCancel?.(); onClose(); }}
                            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100"
                        >
                            {config.cancelText || 'Cancel'}
                        </button>
                    )}
                    <button
                        onClick={() => { config.onConfirm?.(); onClose(); }}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${
                            config.type === 'destructive'
                                ? 'text-red-500 hover:bg-red-50'
                                : 'text-playful-teal hover:bg-playful-cream/50'
                        }`}
                    >
                        {config.confirmText || 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Provider Component ────────────────────────────────────

export function NativeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const pushInitialized = useRef(false);
    const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert',
    });

    const closeDialog = useCallback(() => {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Configure StatusBar on mount (native only)
    useEffect(() => {
        configureStatusBar();
    }, []);

    // Initialize push notifications on login
    useEffect(() => {
        if (user && isNative() && !pushInitialized.current) {
            pushInitialized.current = true;
            initPushNotifications(user.id);
        } else if (!user && pushInitialized.current) {
            pushInitialized.current = false;
            clearPushNotifications(undefined);
        }
    }, [user]);

    const showAlert = useCallback(async (title: string, message: string): Promise<void> => {
        await haptics.light();
        return new Promise((resolve) => {
            setDialogConfig({
                isOpen: true,
                title,
                message,
                type: 'alert',
                confirmText: 'OK',
                onConfirm: resolve,
            });
        });
    }, []);

    const showConfirm = useCallback(async (
        title: string,
        message: string,
        confirmText = 'Confirm',
        cancelText = 'Cancel'
    ): Promise<boolean> => {
        await haptics.light();
        return new Promise((resolve) => {
            setDialogConfig({
                isOpen: true,
                title,
                message,
                type: 'confirm',
                confirmText,
                cancelText,
                onConfirm: () => { haptics.success(); resolve(true); },
                onCancel: () => resolve(false),
            });
        });
    }, []);

    const showDestructive = useCallback(async (
        title: string,
        message: string,
        confirmText = 'Delete'
    ): Promise<boolean> => {
        await haptics.warning();
        return new Promise((resolve) => {
            setDialogConfig({
                isOpen: true,
                title,
                message,
                type: 'destructive',
                confirmText,
                cancelText: 'Cancel',
                onConfirm: () => { haptics.success(); resolve(true); },
                onCancel: () => resolve(false),
            });
        });
    }, []);

    return (
        <NativeContext.Provider value={{
            isNativePlatform: isNative(),
            haptics,
            showAlert,
            showConfirm,
            showDestructive,
            dialogConfig,
            closeDialog,
        }}>
            {children}
            <NativeDialog config={dialogConfig} onClose={closeDialog} />
        </NativeContext.Provider>
    );
}

export default NativeProvider;
