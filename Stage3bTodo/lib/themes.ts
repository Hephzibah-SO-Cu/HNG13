// lib/themes.ts
export type ThemeName = "light" | "dark";

export const lightTheme = {
  mode: "light" as ThemeName,
  fonts: {
    heading: "JosefinSans_700Bold",
    body: "JosefinSans_400Regular",
  },
  colors: {
    background: "#FAFAFA",
    panel: "#FFFFFF",
    text: "#171823",
    subtext: "#25273D",
    muted: "#9495A5",
    primary: "#3A7CFD",
    accent: "#5596FF",
    border: "#D1D2DA",
    shadow: "rgba(33,24,45,0.08)",
  },
  sizes: {
    h1: 40,
    body: 14,
    bodyLarge: 18,
  },
};

export const darkTheme = {
  mode: "dark" as ThemeName,
  fonts: {
    heading: "JosefinSans_700Bold",
    body: "JosefinSans_400Regular",
  },
  colors: {
    background: "#171823",
    panel: "#393A4B",
    text: "#FAFAFA",
    subtext: "#C8CBE7",
    muted: "#767992",
    primary: "#3A7CFD",
    accent: "#AC2DEB",
    border: "#494C6B",
    shadow: "rgba(8,10,20,0.6)",
  },
  sizes: {
    h1: 40,
    body: 14,
    bodyLarge: 18,
  },
};
