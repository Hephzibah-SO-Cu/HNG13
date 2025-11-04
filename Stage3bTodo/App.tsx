// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "styled-components/native";

import useLoadedFonts from "./lib/useFonts";
import { lightTheme, darkTheme } from "./lib/themes";
import { ThemeContextProvider, useThemeContext } from "./lib/ThemeContext";
import HomeScreen from "./screens/HomeScreen";

import { enableScreens } from "react-native-screens";
enableScreens();

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

function AppInner(): JSX.Element {
  const { theme } = useThemeContext();

  if (!theme) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function App(): JSX.Element {
  const fontsLoaded = useLoadedFonts();

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Root must be GestureHandlerRootView so gestures work on Android
  // SafeAreaProvider replaces deprecated SafeAreaView warnings and provides safe-area hooks
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeContextProvider>
          <AppInner />
        </ThemeContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
