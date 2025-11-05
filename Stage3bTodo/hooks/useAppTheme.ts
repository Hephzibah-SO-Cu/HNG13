// hooks/useAppTheme.ts
import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark";

export const useAppTheme = () => {
  const colorScheme = useColorScheme(); // 'light' or 'dark' from device
  const [theme, setTheme] = useState<Theme>(colorScheme || "light");

  // Load persisted theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      const persistedTheme = (await AsyncStorage.getItem("theme")) as Theme | null;
      if (persistedTheme) {
        setTheme(persistedTheme);
      } else {
        setTheme(colorScheme || "light");
      }
    };
    loadTheme();
  }, [colorScheme]);

  // Toggle theme and persist it
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return {
    theme,
    isDarkMode: theme === "dark",
    toggleTheme,
  };
};