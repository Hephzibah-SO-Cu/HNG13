// constants/Colors.ts
// [MODIFIED]
const lightBackground = "#FAFAFA";
const lightCard = "#FFFFFF";
const lightText = "#494C6B";
const lightTextSecondary = "#9495A5";
const lightBorder = "#E3E4F1";
const lightCompleted = "#D1D2DA";

// Dark Theme
const darkBackground = "#171823";
const darkCard = "#25273D";
const darkText = "#C8CBE7";
const darkTextSecondary = "#767992";
const darkBorder = "#393A4B";
const darkCompleted = "#4D5067";

// Shared
const primary = "#3A7CFD";
const gradient: readonly [string, string] = ["#55DDFF", "#C058F3"];

// Header Gradients
const headerGradientLight: readonly [string, string] = ["#55DDFF", "#C058F3"];
const headerGradientDark: readonly [string, string] = ["#3710BD", "#A42395"];

export const Colors = {
  light: {
    background: lightBackground,
    card: lightCard,
    text: lightText,
    textSecondary: lightTextSecondary,
    border: lightBorder,
    completed: lightCompleted,
    primary,
    gradient,
    headerGradient: headerGradientLight, // <-- FIX: Use one consistent key
  },
  dark: {
    background: darkBackground,
    card: darkCard,
    text: darkText,
    textSecondary: darkTextSecondary,
    border: darkBorder,
    completed: darkCompleted,
    primary,
    gradient,
    headerGradient: headerGradientDark, // <-- FIX: Use one consistent key
  },
};