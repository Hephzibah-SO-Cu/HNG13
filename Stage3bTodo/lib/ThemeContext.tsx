// lib/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeName = "light" | "dark";
type ThemeContextShape = {
  theme: ThemeName | null;
  toggle: () => Promise<void>;
};

const KEY = "@todoapp:theme";
const ThemeContext = createContext<ThemeContextShape>({
  theme: "light",
  toggle: async () => {},
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(KEY);
      setTheme((stored as ThemeName) || "light");
    })();
  }, []);

  const toggle = async () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    await AsyncStorage.setItem(KEY, next);
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => useContext(ThemeContext);
