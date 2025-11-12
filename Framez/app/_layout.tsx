import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../theme/colors';

export default function RootLayout() {
  const { session, setSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthInitialized) return;

    // Check if we are in the auth group
    const inAuthGroup = segments[0] === 'auth';

    if (session) {
      // User IS logged in.
      // If they are currently in the 'auth' group, OR if they are at the root (empty segments), send them to tabs.
      if (inAuthGroup || segments.length === 0) {
        router.replace('/(tabs)');
      }
    } else {
      // User is NOT logged in.
      // If they are NOT in the 'auth' group, send them to login.
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
    }
  }, [session, segments, isAuthInitialized]);

  if (!isAuthInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
      <Toast />
    </>
  );
}