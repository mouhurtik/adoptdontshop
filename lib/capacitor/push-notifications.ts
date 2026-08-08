/**
 * Push Notification Service
 *
 * Handles FCM token registration and notification tap navigation.
 * Uses @capacitor/push-notifications — only runs on native platforms.
 */

import { isNative } from './native';
import { supabase } from '@/lib/supabase/client';

let pushInitialized = false;

/**
 * Register for push notifications and store the FCM token in the user's profile.
 * Call this after the user logs in.
 */
export async function initPushNotifications(userId: string): Promise<void> {
    if (!isNative() || pushInitialized) return;

    try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        // Request permission
        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== 'granted') {
            console.log('[Push] Permission not granted');
            return;
        }

        // Register with APNs/FCM
        await PushNotifications.register();

        // Listen for registration success
        PushNotifications.addListener('registration', async (token) => {
            console.log('[Push] Token:', token.value);
            pushInitialized = true;

            // Store token in profiles table
            const platform = (await import('./native')).getPlatform();
            const { error } = await supabase
                .from('profiles')
                .update({ fcm_token: token.value, device_platform: platform })
                .eq('id', userId);

            if (error) {
                console.error('[Push] Failed to store token:', error);
            }
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (err) => {
            console.error('[Push] Registration error:', err);
        });

        // Handle notification tap — navigate to relevant page
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            const data = notification.notification.data;
            console.log('[Push] Notification tapped:', data);

            // Navigate based on notification type
            if (data?.type === 'message' && data?.conversationId) {
                window.location.href = `/messages?conversation=${data.conversationId}`;
            } else if (data?.type === 'community_post' && data?.slug) {
                window.location.href = `/community/${data.slug}`;
            } else if (data?.type === 'adoption_update' && data?.petSlug) {
                window.location.href = `/pet/${data.petSlug}`;
            }
        });
    } catch (err) {
        console.error('[Push] Init failed:', err);
    }
}

/**
 * Clear push notification state on logout.
 * Optionally removes the FCM token from the profile.
 */
export async function clearPushNotifications(userId?: string): Promise<void> {
    pushInitialized = false;

    if (!isNative()) return;

    try {
        const { PushNotifications } = await import('@capacitor/push-notifications');
        await PushNotifications.removeAllListeners();

        // Clear token from profile
        if (userId) {
            await supabase
                .from('profiles')
                .update({ fcm_token: null })
                .eq('id', userId);
        }
    } catch {
        // Plugin not available
    }
}
