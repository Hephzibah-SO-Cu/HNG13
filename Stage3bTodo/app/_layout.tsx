// app/_layout.tsx
// [MODIFIED]
import "react-native-gesture-handler"; // Must be first import
import { GestureHandlerRootView } from "react-native-gesture-handler"; // 1. Import the wrapper
import { ConvexProvider, ConvexReactClient } from "convex/react";
import env from "../convex/env";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

const convex = new ConvexReactClient(env.CONVEX_URL, {
  unsavedChangesWarning: false,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // 2. Wrap your entire app with GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="light" />
        </ThemeProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}