import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// YOUR KEYS 
const SUPABASE_URL = 'https://ewjedtclbdiidzufvvro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3amVkdGNsYmRpaWR6dWZ2dnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTI2NzgsImV4cCI6MjA3ODE4ODY3OH0.CT1VPxipdrasvJVspI8nUTePWGme66r2Rnidw1L3fIw';

// Custom storage adapter to avoid "window is not defined" crash during Web SSR
const FramezStorage = {
  getItem: (key: string) => {
    // If on web AND window is missing, we are on the server. Return nothing.
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: FramezStorage, // Use our new safe adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase to start auto-refreshing tokens when the app comes back to foreground
// We also guard this with a platform check just in case
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh();
        } else {
            supabase.auth.stopAutoRefresh();
        }
    });
}