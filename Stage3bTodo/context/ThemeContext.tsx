// context/ThemeContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { Colors } from "@/constants/Colors";
import { useAppTheme, Theme } from "@/hooks/useAppTheme";

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, isDarkMode, toggleTheme } = useAppTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};