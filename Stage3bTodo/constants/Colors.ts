// constants/Colors.ts
// ... (all the const definitions are correct)
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
// --- THIS IS THE FIX ---
// Explicitly type the gradient as a readonly array of 2 strings
const gradient: readonly [string, string] = ["#55DDFF", "#C058F3"];
// --- END FIX ---

export const Colors = {
  // ... (rest of the file is unchanged)
  light: {
    background: lightBackground,
    card: lightCard,
    text: lightText,
    textSecondary: lightTextSecondary,
    border: lightBorder,
    completed: lightCompleted,
    primary,
    gradient,
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
  },
};