import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.adoptdontshop.app',
  appName: 'AdoptDontShop',

  // Live-URL mode: point WebView at the deployed site
  // This avoids the need for static export and supports all dynamic routes
  server: {
    url: 'https://adoptdontshop.xyz',
    cleartext: false, // HTTPS only
    allowNavigation: ['adoptdontshop.xyz', '*.adoptdontshop.xyz'],
  },

  // Android native project lives under mobile/android
  android: {
    path: 'mobile/android',
  },

  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      androidSplashResourceName: 'splash',
      backgroundColor: '#FFF8F0', // playful-cream
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFF8F0',
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Keyboard: {
      resize: 'ionic',
    },
  },
};

export default config;

